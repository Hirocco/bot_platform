import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import ParametersView from '@/views/ParametersView.vue'

const routes = [
  { path: '/', redirect: '/login' },

  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
  },
  {
    path: '/parameters',
    name: 'parameters',
    component: ParametersView,
  },
  // {
  //   path: '/strategies',
  //   name: 'strategies',
  //   component: StrategiesView,
  // },
  //   {
  //   path: '/settings',
  //   name: 'settings',
  //   component: SettingsView,
  // },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
