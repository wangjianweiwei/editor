import {io} from "socket.io-client";

class Connection {
    constructor(uri) {
        this.seq = 0
        this.canSend = true
        this.connection = io(uri, {transports: ["websocket"]})
        this.id = this.connection.id
    }

    sendOp(doc, delta) {
        let op = {
            src: this.id,
            seq: this.seq++,
            op: delta,
            v: doc.version,
            sentAt: Date.now()
        }

        this.send("op", op)
    }

    send(event, data) {
        this.connection.emit(event, data)
    }

    close() {
        this.connection.close()
    }
}

export default Connection