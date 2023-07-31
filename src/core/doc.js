import Quill from "quill";
import Connection from "../core/connection.js";
import {transformX} from "./ot.js";

const Delta = Quill.import('delta');

class Doc {
    constructor(id, editor) {
        this.id = id
        this.editor = editor
        this.v = null
        this.snapshot = []
        this.connection = new Connection(`http://192.168.2.102:8000?doc=${id}`)
        this.inflightOp = null
        this.pendingOps = []
        this.composeDebounceTimer = null
        this.currentDelta = new Delta()
        this.connection.doc = this
        this.addListeners()
        this.subscribe_cb = null
    }

    addListeners() {
        this.connection.addListener('initialize', data => this.initialize(data))
        this.connection.addListener('op', data => this.handleOp(data))
    }

    subscribe(cb) {
        this.subscribe_cb = cb
        this.connection.send("subscribe", {doc: this.id})
    }

    initialize(data) {
        this.v = data.v
        this.snapshot = data.delta
        if (this.subscribe_cb) {
            this.subscribe_cb()
        }
    }


    submitOp(delta) {
        if (this.composeDebounceTimer) {
            clearTimeout(this.composeDebounceTimer)
        }

        this.currentDelta = this.currentDelta.compose(delta)
        this.composeDebounceTimer = setTimeout(() => {
            if (this.editor.selection.composing === false) {
                this.pendingOps.push({op: this.currentDelta.ops})
                this.currentDelta = new Delta()
                this.flush()
            }
        }, 400)
    }

    flush() {
        console.log("pendingOps", this.pendingOps)
        if (this.pendingOps.length) {
            this.sendOp()
        }
    }

    sendOp() {
        console.log("sendOp", this.inflightOp)
        if (this.connection.canSend && !this.inflightOp) {
            this.inflightOp = this.pendingOps.shift()
            this.inflightOp.v = this.v
            this.connection.sendOp(this, this.inflightOp)
        }
    }

    handleOp(op) {
        console.log("handleOp", op, this.inflightOp)
        if (this.inflightOp && this.inflightOp.src === op.src && this.inflightOp.seq === op.seq) {
            this.opAck()
            return;
        }
        if (op.v < this.v) {
            return
        }

        if (this.inflightOp) {
            transformX(this.inflightOp, op)
        }

        if (this.currentDelta.ops.length > 0) {
            let currentOp = {op: this.currentDelta.ops}
            transformX(currentOp, op)
            this.currentDelta = new Delta(currentOp.op)
        }

        this.pendingOps.forEach((pendingOp) => {
            transformX(pendingOp, op)
        })

        this.editor.updateContents(op.op)
        this.v++
    }

    opAck() {
        this.v++
        this.inflightOp = null
        this.flush()
    }

    destroy() {
        this.connection.close()
    }
}

export default Doc