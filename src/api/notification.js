import request from '@/utils/request'

export function sendPushNotification(data, id) {
    return request({
      url:`notification/subscribed/${id}`,
      method: 'POST',
      data
    })
}

export function sendWelcomeNotification(data){
  return request({
    url: 'notification/subscribe',
    method: 'POST',
    data
  })
}

export function fetchList(id) {
  return request({
    url: `notification/${id}`,
    method: 'GET',
  })
}

export function deleteNotification(data, id) {
  console.log("data: ", data);
  return request({
    url: `notification/delete/${id}`,
    method: 'POST',
    data
  })
}