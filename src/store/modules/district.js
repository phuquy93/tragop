import { getDistricts } from '@/api/district'
import { Message } from 'element-ui'

const getDefaultState = () => {
  return {
    is_loading: false
  }
}

const state = getDefaultState()

const mutations = {
  IS_LOADING(state, status) {
    state.is_loading = status
  }
}

const actions = {
  getDistricts({ commit }, data) {
    return new Promise((resolve, reject) => {
      commit('IS_LOADING', true)
      getDistricts(data).then(response => {
        if (response.status == 200) {
          commit('IS_LOADING', false)
          resolve(response.json())
        }
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

