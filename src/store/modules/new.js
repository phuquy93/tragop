import { getNews, addNew, uploadFileShdAdmin } from '@/api/new'
import { Message } from 'element-ui'

const getDefaultState = () => {
  return {
    news: [],
    is_loading: false
  }
}

const state = getDefaultState()

const mutations = {
  IS_LOADING(state, status) {
    state.is_loading = status
  },
  GET_NEWS(state, news) {
    state.news = news
  }
}

const actions = {
  getNews({ commit }, data) {
    return new Promise((resolve, reject) => {
      commit('IS_LOADING', true)
      getNews(data).then(response => {
        if (response.status == 200) {
          commit('GET_NEWS', response.data)
        }
        commit('IS_LOADING', false)
        resolve(response)
      }).catch(error => {
        commit('IS_LOADING', true)
        reject(error)
      })
    })
  },
  uploadPdf({ commit }, data) {
    return new Promise((resolve, reject) => {
      commit('IS_LOADING', true)
      uploadFileShdAdmin(data).then((res) => {
        if (res.status == 200) {
          Message({
            message: res.message || 'Upload file thành công',
            type: 'success',
            duration: 5 * 1000
          })
        } else {
          Message({
            message: res.message || JSON.stringify(res.data),
            type: 'error',
            duration: 5 * 1000
          })
        }
        commit('IS_LOADING', false)
        resolve(res)
      }).catch(error => {
        Message({
          message: error.message || String(error),
          type: 'error',
          duration: 5 * 1000
        })
        commit('IS_LOADING', false)
        reject(error)
      })
    })
  },
  handleNew({ commit }, data) {
    return new Promise((resolve, reject) => {
      commit('IS_LOADING', true)
      addNew(data).then((res) => {
        if (res.status == 200) {
          Message({
            message: res.message,
            type: 'success',
            duration: 5 * 1000
          })
        } else {
          if (res.status == 400) {
            Message({
              message: res.message + ' : ' + JSON.stringify(res.resultapi),
              type: 'error',
              duration: 5 * 1000
            })
          } else {
            Message({
              message: JSON.stringify(res.data),
              type: 'error',
              duration: 5 * 1000
            })
          }
        }
        commit('IS_LOADING', false)
        resolve(res)
      }).catch(error => {
        Message({
          message: error,
          type: 'error',
          duration: 5 * 1000
        })
        commit('IS_LOADING', false)
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

