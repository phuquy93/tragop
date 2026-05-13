import Cookies from 'js-cookie'

const TokenKey = 'jwt'

const TokenKey2 = 'token_tragop'

const Datauser = 'installment_dmcl'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function getToken2() {
  return Cookies.get(TokenKey2)
}

export function getUser() {
  return Cookies.get(Datauser)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function setToken2(token) {
  return Cookies.set(TokenKey2, token)
}

export function setUser(data) {
  return Cookies.set(Datauser, data)
}

export function removeData(data) {
  return Cookies.remove(data)
}
