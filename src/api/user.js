import { request } from '@/utils/fetch'

export function addUser(data) {
  let url = '/restful/adduser?'
  for (var pair of data.entries()) {
    if (pair[0] == 'id') {
      url = '/restful/updateuser?'
    }
  }
  return request({
    url: url,
    method: 'post',
    data
  })
}

export function getUsers(data) {
  let param = ''

  Object.entries(data).forEach((a) => {
    param = param + '&' + a[0] + '=' + a[1]
  })
  return request({
    url: '/restful/listuser?' + param,
    method: 'get'
  })
}

export function gettoken() {
  return request({
    url: '/restful/checklogin?get_token=1',
    method: 'get'
  })
}

export function login(data) {
  return request({
    url: '/restful/login',
    method: 'post',
    data
  })
}

export function adduser(data) {
  return request({
    url: '/restful/adduser?',
    method: 'post',
    data
  })
}

export function edituser(data) {
  return request({
    url: '/restful/updateuser?',
    method: 'post',
    data
  })
}

export function changePassword(data) {
  return request({
    url: '/restful/changepassworduser?',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/restful/logout?',
    method: 'get'
  })
}

export function getlists(data) {
  return request({
    url:
      '/restful/listuser?username=' +
      data.username +
      '&store=' +
      data.code_store +
      '&page=' +
      data.page,
    method: 'get'
  })
}
