const state = {
  controlJarResult: ''
}

const mutations = {
  SET_ControlJarResult: (state, msg) => {
    state.controlJarResult = state.controlJarResult + msg
  },
  RESET_ControlJarResult: (state) => {
    state.controlJarResult = ''
  }
}

const actions = {
  setControlJarResult({ commit }, msg) {
    commit('SET_ControlJarResult', msg)
  },
  resetControlJarResult({ commit }) {
    commit('RESET_ControlJarResult')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
