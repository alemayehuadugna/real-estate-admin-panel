import request from '@/utils/request'

export function listAgents({limit, page}) {
    return request({
        url: `agents?page=${page}&limit=${limit}`,
        method: 'GET'
    })
}

export function deleteAgent(id) {
    return request({
        url: `agents/${id}`,
        method: 'DELETE'
    })
}

export function createAgent(data) {
    return request({
        url: `agents`,
        method: 'POST',
        data
    })
}

export function filterAgent(query) {
    return request({
        url: `agents/filter`,
        method: 'GET',
        params: query
    })
}