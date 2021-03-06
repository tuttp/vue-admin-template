import Cookies from 'js-cookie'

const TokenKey = 'web_token'
const CodeKey = 'web_code'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function getCode() {
  return Cookies.get(CodeKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function setCode(Code) {
  return Cookies.set(CodeKey, Code)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function removeCode() {
  return Cookies.remove(CodeKey)
}
