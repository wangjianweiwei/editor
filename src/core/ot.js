import Quill from "quill";

const Delta = Quill.import('delta');

const transform = (delta1, delta2, side) => {
    delta1 = new Delta(delta1);
    delta2 = new Delta(delta2);
    return delta2.transform(delta1, side === 'left');
}

export const transformX = (client, server) => {
    let clientOp = transform(client.op, server.op, 'left');
    let serverOp = transform(server.op, client.op, 'right');
    client.op = clientOp;
    server.op = serverOp;
}