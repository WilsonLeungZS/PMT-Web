import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    userEid: '',
    userId: 0,
    isLogin: false,
    isShowMainBar: true
  },
  getters: {
    getUserEid: function (state) {
      return state.userEid
    },
    getUserId: function (state) {
      return state.userId
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
    newUserId: function (state, userId) {
      state.userId = userId
    },
    clearuserId: function (state) {
      state.userId = ''
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
    setNewUserId: function (context, userId) {
      context.commit('newUserId', userId)
    },
    setClearUserId: function (context) {
      context.commit('clearuserId')
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
