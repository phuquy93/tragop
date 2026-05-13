import Cookies from 'js-cookie'

const getDefaultState = () => {
  return {
    listTabs: Cookies.get('Admin-Tabs-Ticket') ? JSON.parse(Cookies.get('Admin-Tabs-Ticket')) : []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  GET_TAB_VIEWS(state, tabs) {
    state.listTabs = tabs
    Cookies.set('Admin-Tabs-Ticket', JSON.stringify(tabs))
  }
}

const actions = {
  getTabViews({ commit }, tabs) {
    tabs = tabs.sort((a, b) => a.id - b.id)
    commit('GET_TAB_VIEWS', tabs)
  },
  resetState({ commit }) {
    commit('RESET_STATE')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

