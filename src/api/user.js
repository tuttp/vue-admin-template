import request from '@/utils/request'

// 登入接口
export function login(data) {
  return request({
    url: '/LableClinteLogin',
    method: 'post',
    data: {
      UserCode: data.username,
      PassWord: data.password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
