import request from '@/utils/request'

export function getDashboardData() {
  return request({
    url: '/api/getDashboardData/',
    method: 'get'
  })
}

export function getMenus() {
  return request({
    url: '/api/menu/',
    method: 'get'
  })
}
