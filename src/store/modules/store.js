import { getStore, getLogin } from '@/api/store'
import { Message } from 'element-ui'

const getDefaultState = () => {
  return {
    stores: [],
    is_loading: false
  }
}

const state = getDefaultState()

const mutations = {
  IS_LOADING(state, status) {
    state.is_loading = status
  },
  GET_STORES(state, stores) {
    console.log(stores)
    state.stores = stores
  }
}

const actions = {
  getStores({ commit }) {
    return new Promise((resolve, reject) => {
      commit('IS_LOADING', true)
      getStore().then(async response => {
        if (response.status == 200) {
          const store = await response.json()
          commit('GET_STORES', store)
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
  },
  getLogin({ }) {
    return new Promise((resolve, reject) => {
      getLogin().then(response => {
        resolve(response)
      }).catch(error => {
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

