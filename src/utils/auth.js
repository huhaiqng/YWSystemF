import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function getUserName() {
  return Cookies.get('username')
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function setUserName(username) {
  return Cookies.set('username', username)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
