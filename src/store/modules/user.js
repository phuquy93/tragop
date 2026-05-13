import { logout, login, addUser, getUsers } from '@/api/user'
import { removeData, setUser, getUser } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import { Message } from 'element-ui'

const state = {
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  user: getUser() ? JSON.parse(getUser()) : null,

  is_loading: false,
  listUsers: []
}

const mutations = {
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  IS_LOADING(state, status) {
    state.is_loading = status
  },
  GET_USERS(state, data) {
    state.listUsers = data
  }
}

const actions = {
  // user login
  async login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo).then(res => {
        if (Number(res.status) === 200) {
          setUser(JSON.stringify(['code_store=' + res.code_store, 'data=' + res.data, 'dataid=' + res.dataid, 'rule=' + res.rule, 'token=' + res.token, 'username=' + res.username, 'name=' + res.name]))
        }
        resolve(res)
      }).catch(err => reject(err))
    })
  },

  // user logout
  logout({ }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        resetRouter()
        removeData('installment_dmcl')
        router.push({ path: '/login' })
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      resolve()
    })
  },

  handleUser({ commit }, data) {
    return new Promise((resolve, reject) => {
      commit('IS_LOADING', true)
      addUser(data).then((res) => {
        if (res.status == 200) {
          Message({
            message: res.message,
            type: 'success',
            duration: 5 * 1000
          })
        } else {
          Message({
            message: JSON.stringify(res.data),
            type: 'error',
            duration: 5 * 1000
          })
        }

        commit('IS_LOADING', false)
        resolve(res)
      }).catch(error => {
        commit('IS_LOADING', false)
        reject(error)
      })
    })
  },

  getUsers({ commit }, data) {
    return new Promise((resolve, reject) => {
      commit('IS_LOADING', true)
      getUsers(data).then(response => {
        if (response.status == 200) {
          commit('GET_USERS', response.data)
        }
        commit('IS_LOADING', false)
        resolve(response)
      }).catch(error => {
        commit('IS_LOADING', true)
        reject(error)
      })
    })
  },

  getToken({ }, data) {
    return new Promise((resolve, reject) => {
      getToken(data).then(response => {
        console.log(response)
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
