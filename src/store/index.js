import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    userEid: '',
    userId: 0,
    userLevel: -1,
    userEmployeeNumber: '',
    userRole: 'Users',
    isLogin: false,
    isShowMainBar: true,
    themeStyle: 0,
    planTaskName: '',
    planTaskDesc: ''
  },
  getters: {
    getUserEid: function (state) {
      return state.userEid
    },
    getUserId: function (state) {
      return state.userId
    },
    getUserLevel: function (state) {
      return state.userLevel
    },
    getUserEmployeeNumber: function (state) {
      return state.userEmployeeNumber
    },
    getUserRole: function (state) {
      return state.userRole
    },
    getIsShowMainBar: function (state) {
      return state.isShowMainBar
    },
    getThemeStyle: function (state) {
      return state.themeStyle
    },
    getPlanTaskName: function (state) {
      return state.planTaskName
    },
    getPlanTaskDesc: function (state) {
      return state.planTaskDesc
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
    clearUserId: function (state) {
      state.userId = ''
    },
    newUserLevel: function (state, userLevel) {
      state.userLevel = userLevel
    },
    clearUserLevel: function (state) {
      state.userLevel = ''
    },
    newUserEmployeeNumber: function (state, userEmployeeNumber) {
      state.userEmployeeNumber = userEmployeeNumber
    },
    clearUserEmployeeNumber: function (state) {
      state.userEmployeeNumber = ''
    },
    newUserRole: function (state, userRole) {
      state.userRole = userRole
    },
    clearUserRole: function (state) {
      state.userRole = ''
    },
    showMainBar: function (state) {
      state.isShowMainBar = true
    },
    hideMainBar: function (state) {
      state.isShowMainBar = false
    },
    newThemeStyle: function (state, themeStyle) {
      state.themeStyle = themeStyle
    },
    defaultThemeStyle: function (state) {
      state.themeStyle = 0
    },
    newPlanTaskName: function (state, planTaskName) {
      state.planTaskName = planTaskName
    },
    clearPlanTaskName: function (state) {
      state.planTaskName = ''
    },
    newPlanTaskDesc: function (state, planTaskDesc) {
      state.planTaskDesc = planTaskDesc
    },
    clearPlanTaskDesc: function (state) {
      state.planTaskDesc = ''
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
      context.commit('clearUserId')
    },
    setNewUserLevel: function (context, userLevel) {
      context.commit('newUserLevel', userLevel)
    },
    setClearUserLevel: function (context) {
      context.commit('clearUserLevel')
    },
    setNewUserEmployeeNumber: function (context, userEmployeeNumber) {
      context.commit('newUserEmployeeNumber', userEmployeeNumber)
    },
    setClearUserEmployeeNumber: function (context) {
      context.commit('clearUserEmployeeNumber')
    },
    setNewUserRole: function (context, userRole) {
      context.commit('newUserRole', userRole)
    },
    setClearUserRole: function (context) {
      context.commit('clearUserRole')
    },
    setShowMainBar: function (context) {
      context.commit('showMainBar')
    },
    setHideMainBar: function (context) {
      context.commit('hideMainBar')
    },
    setNewThemeStyle: function (context, themeStyle) {
      context.commit('newThemeStyle', themeStyle)
    },
    setDefaultThemeStyle: function (context) {
      context.commit('defaultThemeStyle')
    },
    setNewPlanTaskName: function (context, planTaskName) {
      context.commit('newPlanTaskName', planTaskName)
    },
    setClearPlanTaskName: function (context) {
      context.commit('clearPlanTaskName')
    },
    setNewPlanTaskDesc: function (context, planTaskDesc) {
      context.commit('newPlanTaskDesc', planTaskDesc)
    },
    setClearPlanTaskDesc: function (context) {
      context.commit('clearPlanTaskDesc')
    }
  }
})

export default store
