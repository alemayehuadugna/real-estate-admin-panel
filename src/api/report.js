import request from '@/utils/request'

export function fetchList({limit, page}) {
    return request({
        url: `users/reports?sortBy=count:desc&page=${page}&limit=${limit}`,
        method: 'GET',
    })
}

export function deleteReport(id) {
    return request({
        url: `users/reports/${id}`,
        method: 'DELETE'
    })
}

export function searchList(id) {
    return request({
        url: `users/reports/${id}`,
        method: 'GET'
    })
}