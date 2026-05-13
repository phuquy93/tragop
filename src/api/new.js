import { request } from '@/utils/fetch'

export function addNew(data) {
  let url = '/order/add?'
  for (var pair of data.entries()) {
    if (pair[0] == 'id') {
      url = '/order/update?'
    }
  }
  return request({
    url: url,
    method: 'post',
    data
  })
}
export function getNews(data) {
  let param = ''

  Object.entries(data).forEach((a) => {
    param = param + '&' + a[0] + '=' + a[1]
  })
  return request({
    url: '/order/list?' + param,
    method: 'get'
  })
}

export function uploadFileShdAdmin(data) {
  return request({
    url: '/order/uploadfileshdadmin?error=1',
    method: 'post',
    data
  })
}
