import request from './index.js'


export function getDocumentList() {
    return request({
        url: 'document/list'
    })
}

export function createDocument(data) {
    return request({
        method: "POST",
        url: 'document/create',
        data: data
    })
}