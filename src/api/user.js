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

export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}

export function getGroup(data) {
  return request({
    url: '/api/groups/',
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
    url: `/api/groups/${id}`,
    method: 'delete'
  })
}

export function updateGroup(data) {
  return request({
    url: `/api/groups/${data.id}`,
    method: 'put',
    data
  })
}
