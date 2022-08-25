import request from '@/utils/request'

export function fetchList({limit, page}) {
    return request({
        url: `users/feedbacks?limit=${limit}&page=${page}`,
        method: 'GET',
    })
}

export function deleteFeedback(id) {
    return request({
      url: `users/feedbacks/${id}`,
      method: 'DELETE',
    })
  }