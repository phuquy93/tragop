import { requestOrder, requestLogin } from '@/utils/fetch'

export function getStore() {
  return requestOrder({
    url: '/App/Site',
    method: 'get'
  })
}

export function getSites() {
  return requestOrder({
    url: '/restful/getlistsite',
    method: 'get'
  })
}

export function getLogin() {
  return requestLogin({
    url: 'https://api.identity.service.dienmaycholon.vn/Identity/Login/Password',
    method: 'post',
    data: {
      username: 'staff.test',
      password: 'staff.test'
    }
  })
}
