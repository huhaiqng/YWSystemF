import request from '@/utils/request'

export function login(data) {
  var loginData = new FormData()
  loginData.append('username', data.username)
  loginData.append('password', data.password)
  loginData.append('grant_type', 'password')
  loginData.append('scope', 'write')
  loginData.append('client_id', 'uJfDugEBMRPFGabdsPUcQ85JMrkO0B0US5nvu7pz')
  loginData.append('client_secret', 'JNLRcIDlHH3bBzpdy0evZZ36zNh0ghZWHpqNIeDVKH7arwWsvFHyeF2p37sUDLik7knkrPGzXnKBuTlMjG3jyeSQUNBC0veFyPVzqI4YcVYfJDYvhCAB8xsaDpWx8ZkW')

  return request({
    url: '/api/o/token/',
    method: 'post',
    data: loginData
  })
}

export function getUserInfo() {
  return request({
    url: '/api/getUserInfo/',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}

// Group API
export function getGroup(data) {
  return request({
    url: '/api/getGroups/',
    method: 'get',
    params: data
  })
}

export function addGroup(data) {
  return request({
    url: '/api/groups/',
    method: 'post',
    data
  })
}

export function deleteGroup(id) {
  return request({
    url: `/api/groups/${id}/`,
    method: 'delete'
  })
}

export function updateGroup(data) {
  return request({
    url: `/api/groups/${data.id}/`,
    method: 'put',
    data
  })
}

// User API
export function getUser(data) {
  return request({
    url: '/api/getUsers/',
    method: 'get',
    params: data
  })
}

export function addUser(data) {
  return request({
    url: '/api/users/',
    method: 'post',
    data
  })
}

export function deleteUser(id) {
  return request({
    url: `/api/users/${id}/`,
    method: 'delete'
  })
}

export function updateUser(data) {
  return request({
    url: `/api/users/${data.id}/`,
    method: 'put',
    data
  })
}

export function changeMyPassword(data) {
  return request({
    url: '/api/changeMyPassword/',
    method: 'put',
    data
  })
}

export function getContentType() {
  return request({
    url: '/api/contentType/',
    method: 'get'
  })
}

export function getGroupObjectPerms(data) {
  return request({
    url: '/api/getGroupObjectPerms/',
    method: 'post',
    data
  })
}

export function setGroupObjectPerms(data) {
  return request({
    url: '/api/setGroupObjectPerms/',
    method: 'post',
    data
  })
}

export function getGroupPerms(data) {
  return request({
    url: '/api/getGroupPerms/',
    method: 'get',
    params: data
  })
}

export function getGroupL2menu(data) {
  return request({
    url: '/api/getGroupL2menu/',
    method: 'get',
    params: data
  })
}

export function getL2Menu() {
  return request({
    url: '/api/getL2Menu/',
    method: 'get'
  })
}
