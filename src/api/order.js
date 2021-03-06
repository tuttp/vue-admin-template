import request from '@/utils/request'

// http://192.168.1.113:8020/GetPurchaseDetail?pageIndex=1&pagerow=10&Code=S072

export function TestPermit(params) {
  return request({
    url: '/GetPurchaseDetail',
    method: 'get',
    params
  })
}

export function GetPurchaseDetail(params) {
  return request({
    url: '/GetPurchaseDetail',
    method: 'get',
    params
  })
}

export function GetPurchaseinfo(params) {
  return request({
    url: '/GetPurchaseinfo',
    method: 'get',
    params
  })
}

export function DeletePurchaseinfo(params) {
  return request({
    url: '/DeletePurchaseinfo',
    method: 'get',
    params
  })
}

export function GetCustomerClient(params) {
  return request({
    url: '/GetCustomerClient',
    method: 'get',
    params
  })
}

export function AddPurchaseinfo(data) {
  return request({
    url: '/AddPurchaseinfo',
    method: 'post',
    data
  })
}

export function CustomerPrintLabel(data) {
  return request({
    url: '/CustomerPrintLabel',
    method: 'post',
    data
  })
}
