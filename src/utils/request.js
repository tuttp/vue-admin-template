import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import querystring from 'querystring'
// import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    // if (store.getters.token) {
    //   // let each request carry token
    //   // ['X-Token'] is a custom headers key
    //   // please modify it according to the actual situation
    //   // config.headers['X-Token'] = getToken()
    // }
    // config.headers['Access-Control-Allow-Origin'] = '*'
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    if (
      config.method === 'post' ||
      config.method === 'put' ||
      config.method === 'delete' ||
      config.method === 'patch'
    ) {
      config.data = querystring.stringify(config.data)
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    console.log('12222222222')
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.Status === -1) {
      Message({
        message: res.Message || '出现错误！',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.Message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    let msg = '网络异常，请重试'
    console.log('err' + error) // for debug
    const errData = JSON.parse(JSON.stringify(error)).response
    if (errData != undefined) {
      switch (errData.status) {
        // case 400: msg = '请求错误(400)'; break;
        case 401: return history.push('/login'); break
        case 403: msg = '拒绝访问(403)'; break
        case 404: msg = '请求出错(404)'; break
        case 408: msg = '请求超时(408)'; break
        // case 500: msg = '服务器错误(500)'; break;
        case 501: msg = '服务未实现(501)'; break
        case 502: msg = '网络错误(502)'; break
        case 503: msg = '服务不可用(503)'; break
        case 504: msg = '网络超时(504)'; break
        case 505: msg = 'HTTP版本不受支持(505)'; break
        default: msg = errData.data.Message
      }
    }
    Message({
      message: msg,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(errData)
  }
)

export default service
