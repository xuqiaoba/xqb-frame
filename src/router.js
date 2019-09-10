import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/Index.vue'
import Nofind from './views/404'
import Login from './views/Login'
import Home from './views/Home'
import Equipment from './views/Equipment'
import Shift from './views/Shift'
import Attendance from './views/Attendance'
import User from './views/system/User'
import Role from './views/system/Role'
import Project from './views/system/Project'
import TableSetting from './views/system/TableSetting'

import MaintenanceWork from './views/maintenance/maintenanceWork'
import InspectionPlan from './views/inspection/inspectionPlan'
import InspectionWork from './views/inspection/inspectionWork'

// 运营管理
import Operation from './views/Operation'
import OHome from './views/operation/OHome'
import Tenant from './views/operation/Tenant'
import Space from './views/operation/Space'
import Repairs from './views/operation/Repairs'
import RunHomePage from './views/operation/RunHomePage'


Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { path: '*', name: '/404', component: Nofind },
    { path: '/', redirect: '/index' },
    { path: '/login', name: 'login', component: Login },
    {
      path: '/index',
      name: 'index',
      component: Index,
      children: [
        { path: '', component: Home },
        { path: '/home', name: 'home', component: Home },
        { path: '/equipment', name: 'equipment', component: Equipment },
        { path: '/shift', name: 'shift', component: Shift },
        // { path: '/workorder', name: 'workorder', component: Workorder },
        { path: '/inspectionPlan', name: 'inspectionPlan', component: InspectionPlan },
        { path: '/inspectionWork', name: 'inspectionWork', component: InspectionWork },
        { path: '/maintenanceWork', name: 'maintenanceWork', component: MaintenanceWork },
        { path: '/attendance', name: 'attendance', component: Attendance },
        { path: '/project', name: 'project', component: Project },
        { path: '/tableSetting', name: 'tableSetting', component: TableSetting },
        { path: '/user', name: 'user', component: User },
        { path: '/role', name: 'role', component: Role },
      ]
    },    
    {
      path: '/operation',
      name: 'operation',
      component: Operation,
      children: [
        { path: '/operation', component: OHome },
        { path: '/tenant', name: 'tenant', component: Tenant },
        { path: '/space', name: 'space', component: Space },
        { path: '/repairs', name: 'repairs', component: Repairs },
        { path: '/runhomepage', name: 'runhomepage', component: RunHomePage },
      ]
    },    
  ]
})

// 添加路由守卫
router.beforeEach((to, from, next) => {
  const isLogin = localStorage.eleToken ? true : false;
  if (to.path == "/login") {
    next();
  } else {
    isLogin ? next() : next("/login");
  }
})

export default router;