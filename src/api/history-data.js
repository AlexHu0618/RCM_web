import request from '@/utils/request'

export function getHistoryData(params) {
  return request({
    url: '/api/datas/history',
    method: 'get',
    params
  })
}
