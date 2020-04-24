import { decodeStr } from '@/utils/base64'

export function handleExecTask(task, hosts, resolve) {
  document.getElementById('result').innerHTML = ''
  var websock = new WebSocket('ws://' + window.location.host + '/api/task/')
  var sendHosts = []
  for (var i = 0; i < hosts.length; i++) {
    sendHosts[i] = Object.assign({}, hosts[i])
    sendHosts[i].password = decodeStr(sendHosts[i].password)
  }
  websock.onopen = () => {
    var toMessage = { 'task': task, 'hosts': sendHosts }
    websock.send(JSON.stringify(toMessage))
  }
  websock.onmessage = (e) => {
    if (e.data !== 'closed') {
      document.getElementById('result').append(e.data)
    } else {
      resolve()
      websock.close(1000, 'closed by client')
    }
  }
}

export function controlJar(jar, hosts, cmd, store, resolve) {
  store.dispatch('websocket/resetControlJarResult')
  var websock = new WebSocket('ws://' + window.location.host + '/api/controlJar/')
  var sendHosts = []
  for (var i = 0; i < hosts.length; i++) {
    sendHosts[i] = Object.assign({}, hosts[i])
    sendHosts[i].password = decodeStr(sendHosts[i].password)
  }
  websock.onopen = () => {
    var toMessage = { 'jar': jar, 'hosts': sendHosts, 'cmd': cmd }
    websock.send(JSON.stringify(toMessage))
  }
  websock.onmessage = (e) => {
    if (e.data !== 'closed') {
      store.dispatch('websocket/setControlJarResult', e.data)
    } else {
      resolve()
      websock.close(1000, 'closed by client')
    }
  }
}
