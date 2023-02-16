import request from '@/utils/request'
import qs from 'qs';
//获取mac地址
export function getBurnMac(data) {
  return request({
    url: '/mac/getBurnMac',
    method: 'get',
    params: data,
  })
}

//上传烧录结果
export function inBurnMac(data) {
  return request({
    url: '/mac/inBurnMac',
    method: 'get',
    params: data
  })
}

//获取产品
export function findProductList(data) {
  return request({
    url: '/product/findProductList',
    method: 'get',
    params: data
  })
}

export function pcAdd(data) {
  return request({
    url: '/empower/pcAdd',
    method: 'get',
    params: data
  })
}

export function pcAddFile(data) {
  return request({
    url: '/empower/pcAddFile',
    method: 'get',
    params: data
  })
}


