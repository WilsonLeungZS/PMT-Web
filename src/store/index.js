import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    userEid: '',
    isShowMainBar: true
  },
  getters: {
    getUserEid: function (state) {
      return state.userEid
    },
    getIsShowMainBar: function (state) {
      return state.isShowMainBar
    }
  },
  mutations: {
    newUserEid: function (state, userEid) {
      state.userEid = userEid
    },
    clearUserEid: function (state) {
      state.userEid = ''
    },
    showMainBar: function (state) {
      state.isShowMainBar = true
    },
    hideMainBar: function (state) {
      state.isShowMainBar = false
    }
  },
  actions: {
    setNewUserEid: function (context, userEid) {
      context.commit('newUserEid', userEid)
    },
    setClearUserEid: function (context) {
      context.commit('clearUserEid')
    },
    setShowMainBar: function (context) {
      context.commit('showMainBar')
    },
    setHideMainBar: function (context) {
      context.commit('hideMainBar')
    }
  }
})

export default store
