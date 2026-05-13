import { requestOrder } from '@/utils/fetch'

export function getDistricts(data) {
  return requestOrder({
    url:
      '/restful/getlistadministrative?provinceCode=' +
      data.provinceCode +
      '&districtCode=' +
      data.districtCode,
    method: 'get'
  })
}
