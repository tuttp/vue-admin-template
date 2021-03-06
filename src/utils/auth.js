import Cookies from 'js-cookie'

const TokenKey = 'web_token'
const CodeKey = 'web_code'

export function getToken() {
  return localStorage.getItem(TokenKey)
}

export function getCode() {
  return localStorage.getItem(CodeKey)
}

export function setToken(token) {
  return localStorage.setItem(TokenKey, token)
}

export function setCode(Code) {
  return localStorage.setItem(CodeKey, Code)
}

export function removeToken() {
  return localStorage.removeItem(TokenKey)
}

export function removeCode() {
  return localStorage.removeItem(CodeKey)
}
