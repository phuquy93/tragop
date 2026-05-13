
const state = {
  sidebar: {
    opened: false
  },
  isCollapse: false
}

const mutations = {
  CHANGE_ISCOLLAPSE: (state, status) => {
    state.isCollapse = status
  },
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
  }
}

const actions = {
  changeIscollapse({ commit }, status) {
    commit('CHANGE_ISCOLLAPSE', status)
    commit('TOGGLE_SIDEBAR')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

