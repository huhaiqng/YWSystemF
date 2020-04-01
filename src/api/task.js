import request from '@/utils/request'

export function getTask(query) {
  return request({
    url: '/api/tasks/',
    method: 'get',
    params: query
  })
}

export function addTask(data) {
  return request({
    url: '/api/tasks/',
    method: 'post',
    data
  })
}

export function deleteTask(id) {
  return request({
    url: `/api/tasks/${id}/`,
    method: 'delete'
  })
}

export function updateTask(data) {
  return request({
    url: `/api/tasks/${data.id}/`,
    method: 'put',
    data
  })
}
