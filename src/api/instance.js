import request from '@/utils/request'

// MySQL 实例
export function getMySQLInstance(query) {
  return request({
    url: '/api/mysqlInstance/',
    method: 'get',
    params: query
  })
}
export function addMySQLInstance(data) {
  return request({
    url: '/api/mysqlInstance/',
    method: 'post',
    data
  })
}
export function updateMySQLInstance(data) {
  return request({
    url: `/api/mysqlInstance/${data.id}/`,
    method: 'put',
    data
  })
}
export function deleteMySQLInstance(id) {
  return request({
    url: `/api/mysqlInstance/${id}/`,
    method: 'delete'
  })
}

// Redis 实例
export function getRedisInstance(query) {
  return request({
    url: '/api/redisInstance/',
    method: 'get',
    params: query
  })
}
export function addRedisInstance(data) {
  return request({
    url: '/api/redisInstance/',
    method: 'post',
    data
  })
}
export function updateRedisInstance(data) {
  return request({
    url: `/api/redisInstance/${data.id}/`,
    method: 'put',
    data
  })
}
export function deleteRedisInstance(id) {
  return request({
    url: `/api/redisInstance/${id}/`,
    method: 'delete'
  })
}

// Zookeeper 实例
export function getZookeeperInstance(query) {
  return request({
    url: '/api/zookeeperInstance/',
    method: 'get',
    params: query
  })
}
export function addZookeeperInstance(data) {
  return request({
    url: '/api/zookeeperInstance/',
    method: 'post',
    data
  })
}
export function updateZookeeperInstance(data) {
  return request({
    url: `/api/zookeeperInstance/${data.id}/`,
    method: 'put',
    data
  })
}
export function deleteZookeeperInstance(id) {
  return request({
    url: `/api/zookeeperInstance/${id}/`,
    method: 'delete'
  })
}

// Activemq 实例
export function getActivemqInstance(query) {
  return request({
    url: '/api/activemqInstance/',
    method: 'get',
    params: query
  })
}
export function addActivemqInstance(data) {
  return request({
    url: '/api/activemqInstance/',
    method: 'post',
    data
  })
}
export function updateActivemqInstance(data) {
  return request({
    url: `/api/activemqInstance/${data.id}/`,
    method: 'put',
    data
  })
}
export function deleteActivemqInstance(id) {
  return request({
    url: `/api/activemqInstance/${id}/`,
    method: 'delete'
  })
}

// Rabbitmq 实例
export function getRabbitmqInstance(query) {
  return request({
    url: '/api/rabbitmqInstance/',
    method: 'get',
    params: query
  })
}
export function addRabbitmqInstance(data) {
  return request({
    url: '/api/rabbitmqInstance/',
    method: 'post',
    data
  })
}
export function updateRabbitmqInstance(data) {
  return request({
    url: `/api/rabbitmqInstance/${data.id}/`,
    method: 'put',
    data
  })
}
export function deleteRabbitmqInstance(id) {
  return request({
    url: `/api/rabbitmqInstance/${id}/`,
    method: 'delete'
  })
}
