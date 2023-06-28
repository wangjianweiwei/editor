import request from './index.js'


export function getDocumentList() {
    return request({
        url: 'document/list'
    })
}