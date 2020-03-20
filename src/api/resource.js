import request from '@/utils/request'

export function getHosts(query) {
  return request({
    url: '/api/hosts/',
    method: 'get',
    params: query
  })
}
export function addHost(data) {
  return request({
    url: '/api/hosts/',
    method: 'post',
    data
  })
}
export function updateHost(data) {
  return request({
    url: `/api/hosts/${data.id}/`,
    method: 'put',
    data
  })
}
export function deleteHost(id) {
  return request({
    url: `/api/hosts/${id}/`,
    method: 'delete'
  })
}

export function getProjects() {
  return request({
    url: '/api/projects/',
    method: 'get'
  })
}

export function getSoftware() {
  return request({
    url: '/api/softwares/',
    method: 'get'
  })
}

export function getProjectWeb(data) {
  return request({
    url: '/api/getProjectWeb',
    method: 'get',
    params: data
  })
}

export function addProjectWeb(data) {
  return request({
    url: '/api/projectWeb/',
    method: 'post',
    data
  })
}

export function deleteProjectWeb(id) {
  return request({
    url: `/api/projectWeb/${id}`,
    method: 'delete'
  })
}
