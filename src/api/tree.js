import request from '@/utils/request'

export function getTree() {
  return request({
    url: '/Tree',
    method: 'get',
    baseURL: 'http://192.168.1.69:5001/rest_api/v1'
  })
}
