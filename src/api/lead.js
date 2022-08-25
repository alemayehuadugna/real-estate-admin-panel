import request from '@/utils/request'

export function fetchList({limit, page}) {
  return request({
    url: `leads?page=${page}&limit=${limit}`,
    method: 'GET',
  })
}


export function createLead(data) {
  return request({
    url: 'leads',
    method: 'post',
    data
  })
}

export function searchList(phone) {
  return request({
    url: `leads/search?phone=${phone}`,
    method: 'GET',
  })
}

export function updateProgress(data, id) {
  return request({
    url: `leads/${id}`,
    method: 'PATCH',
    data
  })
}

export function deleteLead(id) {
  return request({
    url: `leads/${id}`,
    method: 'DELETE',
  })
}

