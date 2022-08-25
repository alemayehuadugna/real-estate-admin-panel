import request from '@/utils/request'

export function listProperties({limit, page}) {
    return request({
        url: `properties?page=${page}&limit=${limit}`,
        method: 'GET'
    })
} 

export function filterProperties(data) {
    return request({
        url: `properties/filter`,
        method: 'POST',
        data
    })
}

export function uploadImage(data) {
    return request({
        url: `upload`,
        method: 'POST',
        data
    })
}

export function createProperty(data) {
    return request({
        url:'/properties',
        method: 'POST',
        data
    })
}

export function getProperty(id) {
    return request({
        url: `/properties/${id}`,
        method: 'GET',
    })
}

export function deleteProperty(id) {
    return request({
        url: `/properties/${id}`,
        method: 'DELETE'
    })
}

export function updateProperty(id, data) {
    return request({
        url: `/properties/${id}`,
        method: 'PATCH',
        data
    })
}

