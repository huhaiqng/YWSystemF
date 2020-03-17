export function encodeStr(password) {
  const toEncodeStr = window.btoa(password)
  var code = ''
  for (var i = 0; i < toEncodeStr.length; i++) {
    var charNo = toEncodeStr[i].charCodeAt() + i
    code += String.fromCharCode(charNo)
  }
  return code
}

export function decodeStr(code) {
  var toDecodeStr = ''
  for (var i = 0; i < code.length; i++) {
    var charNo = code[i].charCodeAt() - i
    toDecodeStr += String.fromCharCode(charNo)
  }
  return window.atob(toDecodeStr)
}
