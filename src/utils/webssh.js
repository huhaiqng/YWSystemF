import { decodeStr } from '@/utils/base64'

export function sshConnectHost(host) {
  var hostname = 'hostname' + '=' + host.ip
  var username = 'username' + '=' + host.admin
  var password = 'password' + '=' + btoa(decodeStr(host.password))
  window.open('http://127.0.0.1:8888/webssh?' + hostname + '&' + username + '&' + password)
}
