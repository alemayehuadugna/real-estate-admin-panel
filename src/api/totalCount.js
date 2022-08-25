import request from '@/utils/request'

export function getList(params) {
    return request({
        url: 'totalCount',
        method: 'get',
        params
    })
}