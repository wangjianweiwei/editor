import {io} from "socket.io-client";

class Connection {
    constructor(server, path, query) {
        this.seq = 0
        this.doc = null
        this.canSend = true
        this.connection = io(server, {transports: ["websocket"], path: path, query})

    }

    addListener(event, cb) {
        this.connection.on(event, cb)
    }

    sendOp(doc, delta) {
        if (this.connection.connected) {
            delta.src = this.connection.id
            delta.seq = this.seq++
            this.send("compose", delta)
        }
    }

    send(event, data) {
        this.connection.emit(event, data)
    }

    close() {
        this.connection.close()
    }
}

export default Connection