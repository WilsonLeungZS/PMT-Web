import Vue from 'vue'
import Router from 'vue-router'
import MainHeader from '@/components/MainHeader'
import Login from '@/components/Login'
import SprintView from '@/components/Sprint/SprintView'
import MyTimesheet from '@/components/Timesheet/MyTimesheet'
import PrjTimesheet from '@/components/Timesheet/PrjTimesheet'
import TaskList from '@/components/Task/TaskList'
import SptManagement from '@/components/Management/SptManagement'
import PrjManagement from '@/components/Management/PrjManagement'
import RptManagement from '@/components/Management/RptManagement'
import Charts from '@/components/Others/Charts'
import Error from '@/components/Error'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {path: '/', redirect: '/Login'},
    {path: '/Sprint', redirect: '/Sprint/SprintView'},
    {path: '/Timesheet', redirect: '/Timesheet/MyTimesheet'},
    {path: '/Task', redirect: '/Task/TaskList'},
    {path: '/Management', redirect: '/Management/SptManagement'},
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
          path: 'Management/SptManagement',
          name: 'SptManagement',
          component: SptManagement,
          meta: {
            needAdmin: true,
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
          path: 'Management/RptManagement',
          name: 'RptManagement',
          component: RptManagement,
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
        }
      ]
    },
    {path: '*', name: 'Error', component: Error}
  ]
})
