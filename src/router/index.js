import Vue from 'vue'
import Router from 'vue-router'
import MainHeader from '@/components/MainHeader'
import Login from '@/components/Login'
import SprintView from '@/components/Sprint/SprintView'
import MyTimesheet from '@/components/Timesheet/MyTimesheet'
import PrjTimesheet from '@/components/Timesheet/PrjTimesheet'
import TaskList from '@/components/Task/TaskList'
import PrjManagement from '@/components/Management/PrjManagement'
import PmtManagement from '@/components/Management/PmtManagement'
import Charts from '@/components/Others/Charts'
import TasksList from '@/components/TaskList/TasksList'
import Error from '@/components/Error'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {path: '/', redirect: '/Login'},
    {path: '/Sprint', redirect: '/Sprint/SprintView'},
    {path: '/Timesheet', redirect: '/Timesheet/MyTimesheet'},
    {path: '/Task', redirect: '/Task/TaskList'},
    {path: '/Management', redirect: '/Management/PrjManagement'},
    {path: '/Others', redirect: '/Others/Charts'},
    {
      path: '/',
      name: 'MainHeader',
      component: MainHeader,
      children: [
        {
          path: 'Login',
          name: 'Login',
          component: Login,
          meta: {
            needAdmin: false,
            needLogin: false,
            page: 'Login'
          }
        },
        {
          path: 'Sprint/SprintView',
          name: 'SprintView',
          component: SprintView,
          meta: {
            needAdmin: false,
            needLogin: true
          }
        },
        {
          path: 'Timesheet/MyTimesheet',
          name: 'MyTimesheet',
          component: MyTimesheet,
          meta: {
            needAdmin: false,
            needLogin: true
          }
        },
        {
          path: 'Timesheet/ProjectTimesheet',
          name: 'PrjTimesheet',
          component: PrjTimesheet,
          meta: {
            needAdmin: false,
            needLogin: true
          }
        },
        {
          path: 'Task/TaskList',
          name: 'TaskList',
          component: TaskList,
          meta: {
            needAdmin: false,
            needLogin: true
          }
        },
        {
          path: 'Management/PrjManagement',
          name: 'PrjManagement',
          component: PrjManagement,
          meta: {
            needAdmin: true,
            needLogin: true
          }
        },
        {
          path: 'Management/PmtManagement',
          name: 'PmtManagement',
          component: PmtManagement,
          meta: {
            needAdmin: true,
            needLogin: true
          }
        },
        {
          path: 'Others/Charts',
          name: 'Charts',
          component: Charts,
          meta: {
            needAdmin: true,
            needLogin: false
          }
        },
        {
          path: 'TaskList/TasksList',
          name: 'TasksList',
          component: TasksList,
          meta: {
            needAdmin: false,
            needLogin: true
          }
        }
      ]
    },
    {path: '*', name: 'Error', component: Error}
  ]
})
