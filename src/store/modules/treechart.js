const state = {
  treeNodeID: 1,
  curType2signal: 'demod'
}

const mutations = {
  CHANGE_TREE_NODE: (state, treeNodeID) => {
    state.treeNodeID = treeNodeID
  },
  CHANGE_TAB: (state, curType2signal) => {
    state.curType2signal = curType2signal
  }
}

const actions = {
  changeTreeNode({ commit }, nodeID) {
    commit('CHANGE_TREE_NODE', nodeID)
  },
  
  changeTab({ commit }, tabName) {
    commit('CHANGE_TAB', tabName)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}