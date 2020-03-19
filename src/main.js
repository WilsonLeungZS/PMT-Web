/* eslint-disable */
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en'
import App from './App.vue'
import router from './router'
import store from './store'
import http from './utils/http'
import Blob from './excel/Blob'
import Export2Excel from './excel/Export2Excel.js'

Vue.use(ElementUI, { locale })

Vue.config.productionTip = false

router.beforeEach(async (to, from, next) => {
  let getFlag = localStorage.getItem('Flag')
  let reqUserEid = localStorage.getItem('UserEid')
  var needAdmin = to.meta.needAdmin
  console.log(to)
  if (to.meta.page != null && to.meta.page === 'Login') {
    if (getFlag === 'isLogin') {
      const res = await http.get('/users/login', {
        userEid: reqUserEid
      })
      if (res.data.status === 0 && res.data.user != null && res.data.user.IsActive) {
        var resUserEid = res.data.user.Name
        var resUserId = res.data.user.Id
        var resUserLevel = res.data.user.Level
        var resUserEmployeeNumber = res.data.user.EmployeeNumber
        var resUserRole = res.data.user.Role
        store.dispatch('setNewUserEid', resUserEid)
        store.dispatch('setNewUserId', resUserId)
        store.dispatch('setNewUserLevel', resUserLevel)
        store.dispatch('setNewUserEmployeeNumber', resUserEmployeeNumber)
        store.dispatch('setNewUserRole', resUserRole)
        store.dispatch('setShowMainBar')
        next('/Timesheet')
      } else {
        alert('Your EID is not found or inactive! Please retry or contact administrator!')
        localStorage.setItem('Flag', '')
        localStorage.setItem('UserEid', '')
        next('/Login')
      }
    }
    console.log('Debug')
    store.dispatch('setNewThemeStyle', 0)
  }
  if (to.meta.needLogin) {
    if (getFlag === 'isLogin') {
      const res = await http.get('/users/login', {
        userEid: reqUserEid
      })
      if (res.data.status === 0 && res.data.user != null && res.data.user.IsActive) {
        var resUserEid = res.data.user.Name
        var resUserId = res.data.user.Id
        var resUserLevel = res.data.user.Level
        var resUserEmployeeNumber = res.data.user.EmployeeNumber
        var resUserRole = res.data.user.Role
        var resUserThemeStyle = Number(res.data.user.ThemeStyle)
        store.dispatch('setNewUserEid', resUserEid)
        store.dispatch('setNewUserId', resUserId)
        store.dispatch('setNewUserLevel', resUserLevel)
        store.dispatch('setNewUserEmployeeNumber', resUserEmployeeNumber)
        store.dispatch('setNewUserRole', resUserRole)
        store.dispatch('setNewThemeStyle', resUserThemeStyle)
        store.dispatch('setShowMainBar')
        if (needAdmin) {
          if (resUserRole === 'Admin') {
            next()
          } else {
            alert('You can not access these pages as you are not admin user!')
            next(from.path)
          }
        } else {
          next()
        }
      } else {
        alert('Your EID is not found or inactive! Please retry or contact administrator!')
        localStorage.setItem('Flag', '')
        localStorage.setItem('UserEid', '')
        next('/Login')
      }
    } else {
      alert('You need to login first!')
      next('/Login')
    }
  } else {
    next()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
