import { getPayments } from '@/api/payment'
import { Message } from 'element-ui'

const getDefaultState = () => {
  return {
    payments: [],
    is_loading: false
  }
}

const state = getDefaultState()

const mutations = {
  IS_LOADING(state, status) {
    state.is_loading = status
  },
  GET_PAYMENTS(state, payments) {
    state.payments = payments.data
  }
}

const actions = {
  getPayments({ commit }, data) {
    return new Promise((resolve, reject) => {
      commit('IS_LOADING', true)
      getPayments(data).then(async response => {
        if (response.status == 200) {
          const res = await response.json()
          res.data.forEach(a => {
            a.value = a.id,
            a.label = a.name
          })
          commit('GET_PAYMENTS', res)
          commit('IS_LOADING', false)
        }

        resolve(response)
      }).catch(error => {
        Message({
          message: error,
          type: 'error',
          duration: 5 * 1000
        })
        commit('IS_LOADING', true)
        reject(error)
      })
    })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

