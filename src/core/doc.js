import Quill from "quill";

const Delta = Quill.import('delta');

class Doc {
    constructor(id, connection) {
        this.id = id
        this.version = null
        this.connection = connection
        this.inflightOp = null
        this.pendingOps = []
        this.composeDebounceTimer = null
        this.currentDelta = new Delta()
    }

    submitOp(delta) {
        if (this.composeDebounceTimer) {
            clearTimeout(this.composeDebounceTimer)
        }
        this.currentDelta = this.currentDelta.compose(delta)
        this.composeDebounceTimer = setTimeout(() => {
            this.pendingOps.push(this.currentDelta.ops)
            this.currentDelta = new Delta()
            this.flush()
        }, 300)
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
            this.connection.sendOp(this, this.inflightOp)
        }
    }

    handleOp(op) {

    }

    destroy() {
        this.connection.close()
    }
}

export default Doc