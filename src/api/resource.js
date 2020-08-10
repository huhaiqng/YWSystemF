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

// Project API
export function getProjects() {
  return request({
    url: '/api/getProjects/',
    method: 'get'
  })
}

export function addProjects(data) {
  return request({
    url: '/api/projects/',
    method: 'post',
    data
  })
}

export function deleteProjects(id) {
  return request({
    url: `/api/projects/${id}/`,
    method: 'delete'
  })
}

export function updateProjects(data) {
  return request({
    url: `/api/projects/${data.id}/`,
    method: 'put',
    data
  })
}

export function getSoftware() {
  return request({
    url: '/api/softwares/',
    method: 'get'
  })
}

export function getEnv() {
  return request({
    url: '/api/getEnv/',
    method: 'get'
  })
}

// ProjectWeb API
export function getProjectWeb(data) {
  return request({
    url: '/api/getProjectWeb/',
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

export function updateProjectWeb(data) {
  return request({
    url: `/api/projectWeb/${data.id}/`,
    method: 'put',
    data
  })
}

export function deleteProjectWeb(id) {
  return request({
    url: `/api/projectWeb/${id}`,
    method: 'delete'
  })
}

// JavaPackage API
export function addJavaPackage(data) {
  return request({
    url: '/api/javaPackages/',
    method: 'post',
    data
  })
}

export function deleteJavaPackage(id) {
  return request({
    url: `/api/javaPackages/${id}/`,
    method: 'delete'
  })
}

export function updateJavaPackage(data) {
  return request({
    url: `/api/javaPackages/${data.id}/`,
    method: 'put',
    data
  })
}

export function getJavaPackageList(data) {
  return request({
    url: '/api/getJavaPackages/',
    method: 'get',
    params: data
  })
}

// ProjectTomcat API
export function getProjectTomcat(data) {
  return request({
    url: '/api/getProjectTomcat/',
    method: 'get',
    params: data
  })
}

export function addProjectTomcat(data) {
  return request({
    url: '/api/projectTomcat/',
    method: 'post',
    data
  })
}

export function updateProjectTomcat(data) {
  return request({
    url: `/api/projectTomcat/${data.id}/`,
    method: 'put',
    data
  })
}

export function deleteProjectTomcat(id) {
  return request({
    url: `/api/projectTomcat/${id}`,
    method: 'delete'
  })
}

// MySQLDB API
export function getMySQLDB(data) {
  return request({
    url: '/api/getMysqldb/',
    method: 'get',
    params: data
  })
}

export function addMySQLDB(data) {
  return request({
    url: '/api/mysqldb/',
    method: 'post',
    data
  })
}

export function updateMySQLDB(data) {
  return request({
    url: `/api/mysqldb/${data.id}/`,
    method: 'put',
    data
  })
}

export function deleteMySQLDB(id) {
  return request({
    url: `/api/mysqldb/${id}`,
    method: 'delete'
  })
}

// ProjectMySQLDB API
export function addProjectMySQLDB(data) {
  return request({
    url: '/api/projectMysqldb/',
    method: 'post',
    data
  })
}

export function updateProjectMySQLDB(data) {
  return request({
    url: `/api/projectMysqldb/${data.id}/`,
    method: 'put',
    data
  })
}

export function deleteProjectMySQLDB(id) {
  return request({
    url: `/api/projectMysqldb/${id}`,
    method: 'delete'
  })
}

// ProjectGeneralSoftware API
export function getProjectGeneralSoftware(data) {
  return request({
    url: '/api/getProjectGeneralSoftware/',
    method: 'get',
    params: data
  })
}

export function addProjectGeneralSoftware(data) {
  return request({
    url: '/api/projectGeneralSoftware/',
    method: 'post',
    data
  })
}

export function updateProjectGeneralSoftware(data) {
  return request({
    url: `/api/projectGeneralSoftware/${data.id}/`,
    method: 'put',
    data
  })
}

export function deleteProjectGeneralSoftware(id) {
  return request({
    url: `/api/projectGeneralSoftware/${id}`,
    method: 'delete'
  })
}

// ProjectMongoDB API
export function getProjectMongoDB(data) {
  return request({
    url: '/api/getProjectMongoDB/',
    method: 'get',
    params: data
  })
}

export function addProjectMongoDB(data) {
  return request({
    url: '/api/projectMongoDB/',
    method: 'post',
    data
  })
}

export function updateProjectMongoDB(data) {
  return request({
    url: `/api/projectMongoDB/${data.id}/`,
    method: 'put',
    data
  })
}

export function deleteProjectMongoDB(id) {
  return request({
    url: `/api/projectMongoDB/${id}`,
    method: 'delete'
  })
}

// ProjectOracle API
export function getProjectOracle(data) {
  return request({
    url: '/api/getProjectOracle/',
    method: 'get',
    params: data
  })
}

export function addProjectOracle(data) {
  return request({
    url: '/api/projectOracle/',
    method: 'post',
    data
  })
}

export function updateProjectOracle(data) {
  return request({
    url: `/api/projectOracle/${data.id}/`,
    method: 'put',
    data
  })
}

export function deleteProjectOracle(id) {
  return request({
    url: `/api/projectOracle/${id}`,
    method: 'delete'
  })
}

