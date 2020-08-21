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
export function getProjectMySQLDB(data) {
  return request({
    url: '/api/getProjectMysqldb/',
    method: 'get',
    params: data
  })
}

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

// ProjectJar API
export function getProjectJar(data) {
  return request({
    url: '/api/getProjectJar/',
    method: 'get',
    params: data
  })
}

export function addProjectJar(data) {
  return request({
    url: '/api/projectJar/',
    method: 'post',
    data
  })
}

export function updateProjectJar(data) {
  return request({
    url: `/api/projectJar/${data.id}/`,
    method: 'put',
    data
  })
}

export function deleteProjectJar(id) {
  return request({
    url: `/api/projectJar/${id}`,
    method: 'delete'
  })
}

// ProjectWar API
export function getProjectWar(data) {
  return request({
    url: '/api/getProjectWar/',
    method: 'get',
    params: data
  })
}

export function addProjectWar(data) {
  return request({
    url: '/api/projectWar/',
    method: 'post',
    data
  })
}

export function updateProjectWar(data) {
  return request({
    url: `/api/projectWar/${data.id}/`,
    method: 'put',
    data
  })
}

export function deleteProjectWar(id) {
  return request({
    url: `/api/projectWar/${id}`,
    method: 'delete'
  })
}

// ProjectRedis API
export function getProjectRedis(data) {
  return request({
    url: '/api/getProjectRedis/',
    method: 'get',
    params: data
  })
}

export function addProjectRedis(data) {
  return request({
    url: '/api/projectRedis/',
    method: 'post',
    data
  })
}

export function updateProjectRedis(data) {
  return request({
    url: `/api/projectRedis/${data.id}/`,
    method: 'put',
    data
  })
}

export function deleteProjectRedis(id) {
  return request({
    url: `/api/projectRedis/${id}`,
    method: 'delete'
  })
}

// ProjectDotnet API
export function getProjectDotnet(data) {
  return request({
    url: '/api/getProjectDotnet/',
    method: 'get',
    params: data
  })
}

export function addProjectDotnet(data) {
  return request({
    url: '/api/projectDotnet/',
    method: 'post',
    data
  })
}

export function updateProjectDotnet(data) {
  return request({
    url: `/api/projectDotnet/${data.id}/`,
    method: 'put',
    data
  })
}

export function deleteProjectDotnet(id) {
  return request({
    url: `/api/projectDotnet/${id}`,
    method: 'delete'
  })
}

// ProjectPHP API
export function getProjectPHP(data) {
  return request({
    url: '/api/getProjectPHP/',
    method: 'get',
    params: data
  })
}

export function addProjectPHP(data) {
  return request({
    url: '/api/projectPHP/',
    method: 'post',
    data
  })
}

export function updateProjectPHP(data) {
  return request({
    url: `/api/projectPHP/${data.id}/`,
    method: 'put',
    data
  })
}

export function deleteProjectPHP(id) {
  return request({
    url: `/api/projectPHP/${id}`,
    method: 'delete'
  })
}

// ProjectPython API
export function getProjectPython(data) {
  return request({
    url: '/api/getProjectPython/',
    method: 'get',
    params: data
  })
}

export function addProjectPython(data) {
  return request({
    url: '/api/projectPython/',
    method: 'post',
    data
  })
}

export function updateProjectPython(data) {
  return request({
    url: `/api/projectPython/${data.id}/`,
    method: 'put',
    data
  })
}

export function deleteProjectPython(id) {
  return request({
    url: `/api/projectPython/${id}`,
    method: 'delete'
  })
}

// ProjectRabbitmq API
export function getProjectRabbitmq(data) {
  return request({
    url: '/api/getProjectRabbitmq/',
    method: 'get',
    params: data
  })
}

export function addProjectRabbitmq(data) {
  return request({
    url: '/api/projectRabbitmq/',
    method: 'post',
    data
  })
}

export function updateProjectRabbitmq(data) {
  return request({
    url: `/api/projectRabbitmq/${data.id}/`,
    method: 'put',
    data
  })
}

export function deleteProjectRabbitmq(id) {
  return request({
    url: `/api/projectRabbitmq/${id}`,
    method: 'delete'
  })
}

// ProjectActivemq API
export function getProjectActivemq(data) {
  return request({
    url: '/api/getProjectActivemq/',
    method: 'get',
    params: data
  })
}

export function addProjectActivemq(data) {
  return request({
    url: '/api/projectActivemq/',
    method: 'post',
    data
  })
}

export function updateProjectActivemq(data) {
  return request({
    url: `/api/projectActivemq/${data.id}/`,
    method: 'put',
    data
  })
}

export function deleteProjectActivemq(id) {
  return request({
    url: `/api/projectActivemq/${id}`,
    method: 'delete'
  })
}

// ProjectZookeeper API
export function getProjectZookeeper(data) {
  return request({
    url: '/api/getProjectZookeeper/',
    method: 'get',
    params: data
  })
}

export function addProjectZookeeper(data) {
  return request({
    url: '/api/projectZookeeper/',
    method: 'post',
    data
  })
}

export function updateProjectZookeeper(data) {
  return request({
    url: `/api/projectZookeeper/${data.id}/`,
    method: 'put',
    data
  })
}

export function deleteProjectZookeeper(id) {
  return request({
    url: `/api/projectZookeeper/${id}`,
    method: 'delete'
  })
}

// ProjectKafka API
export function getProjectKafka(data) {
  return request({
    url: '/api/projectKafka/',
    method: 'get',
    params: data
  })
}

export function addProjectKafka(data) {
  return request({
    url: '/api/projectKafka/',
    method: 'post',
    data
  })
}

export function updateProjectKafka(data) {
  return request({
    url: `/api/projectKafka/${data.id}/`,
    method: 'put',
    data
  })
}

export function deleteProjectKafka(id) {
  return request({
    url: `/api/projectKafka/${id}`,
    method: 'delete'
  })
}

// ProjectSQLServer API
export function getProjectSQLServer(data) {
  return request({
    url: '/api/projectSQLServer/',
    method: 'get',
    params: data
  })
}

export function addProjectSQLServer(data) {
  return request({
    url: '/api/projectSQLServer/',
    method: 'post',
    data
  })
}

export function updateProjectSQLServer(data) {
  return request({
    url: `/api/projectSQLServer/${data.id}/`,
    method: 'put',
    data
  })
}

export function deleteProjectSQLServer(id) {
  return request({
    url: `/api/projectSQLServer/${id}`,
    method: 'delete'
  })
}
