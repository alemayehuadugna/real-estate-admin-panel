import request from '@/utils/request'

export function listEmployees(query) {
    return request({
        url: `employees`,
        method: 'GET',
        params: query
    })
}

export function deleteEmployee(id) {
    return request({
        url: `employees/${id}`,
        method: 'DELETE'
    })
}

export function createEmployee(data) {
    return request({
        url: `employees`,
        method: 'POST',
        data
    })
}

