import request from '@/utils/request'

export function listUsers({limit, page}) {
    return request({
        url: `users?page=${page}&limit=${limit}`,
        method: 'GET'
    })
}

export function deleteUser(id) {
    return request({
        url: `users/${id}`,
        method: 'DELETE'
    })
}

export function createUser(data) {
    console.log("user data: ", data);
    return request({
        url: `users`,
        method: 'POST',
        data
    })
}

export function filterUser(query) {
    return request({
        url: `users/filter`,
        method: 'GET',
        params: query
    })
}

