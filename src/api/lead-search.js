import request from '@/utils/request'

export function leadList(query) {
    return request({
        url: 'leads',
        method: 'GET',
    })
}
