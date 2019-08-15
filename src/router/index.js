import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main'
import Login from '@/components/Login'
import MyTimesheet from '@/components/Timesheet/MyTimesheet'
import PrjTimesheet from '@/components/Timesheet/PrjTimesheet'
import TaskList from '@/components/Task/TaskList'
import PrjManagement from '@/components/Management/PrjManagement'
import Charts from '@/components/Others/Charts'
import Error from '@/components/Error'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {path: '/', redirect: '/Login'},
    {path: '/Timesheet', redirect: '/Timesheet/MyTimesheet'},
    {path: '/Task', redirect: '/Task/TaskList'},
    {path: '/Management', redirect: '/Management/PrjManagement'},
    {path: '/Others', redirect: '/Others/Charts'},
    {
      path: '/',
      name: 'Main',
      component: Main,
      children: [
        {
          path: 'Login',
          name: 'Login',
          component: Login,
          meta: {
            needLogin: false
          }
        },
        {
          path: 'Timesheet/MyTimesheet',
          name: 'MyTimesheet',
          component: MyTimesheet,
          meta: {
            needLogin: true
          }
        },
        {
          path: 'Timesheet/ProjectTimesheet',
          name: 'PrjTimesheet',
          component: PrjTimesheet,
          meta: {
            needLogin: true
          }
        },
        {
          path: 'Task/TaskList',
          name: 'TaskList',
          component: TaskList,
          meta: {
            needLogin: true
          }
        },
        {
          path: 'Management/PrjManagement',
          name: 'PrjManagement',
          component: PrjManagement,
          meta: {
            needLogin: true
          }
        },
        {
          path: 'Others/Charts',
          name: 'Charts',
          component: Charts,
          meta: {
            needLogin: true
          }
        }
      ]
    },
    {path: '*', name: 'Error', component: Error}
  ]
})
