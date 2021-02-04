import request from '@/utils/request'

export function getDashboardData() {
  return request({
    url: '/api/getDashboardData/',
    method: 'get'
  })
}

export function getMenus() {
  return request({
    url: '/api/getL1Menu/',
    method: 'get'
  })
}

export function getL1Menu() {
  return request({
    url: '/api/getL1Menu/',
    method: 'get'
  })
}
