import { requestOrder } from '@/utils/fetch'

export function getPayments() {
  return requestOrder({
    url: '/restful/getlistfinancier',
    method: 'get'
  })
}
