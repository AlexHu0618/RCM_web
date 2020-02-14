import request from '@/utils/request'

export function getHistoryData(params) {
  return request({
    url: '/api/datas/history',
    method: 'get',
    baseURL: 'http://39.108.137.187:8888',
    params
  })
}
