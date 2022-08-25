import request from '@/utils/request'

export function login(data) {
    return request({
        url: 'auth/login',
        method: 'POST',
        data
    })
}

export function getInfo(token) {
    return request({
        url: `/users/${token}`,
        method: 'GET'
    })
}

export function updateInfo(id,data) {
    return request({
        url: `/users/${id}`,
        method: 'PATCH',
        data
    })
}

export function changePassword(id, data) {
    return request({
        url: `/users/${id}/password/change`,
        method: 'PATCH',
        data
    })
}
