import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import MainLayout from '@/components/layout/MainLayout.vue'
import Home from '@/views/Home.vue'
import FinanzasDashboard from '@/views/finanzas/FinanzasDashboard.vue'
import GastosDashboard from '@/views/gastos/GastosDashboard.vue'
import EstudioDashboard from '@/views/estudio/EstudioDashboard.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: 'home', name: 'home', component: Home },
      { path: 'finanzas', name: 'finanzas', component: FinanzasDashboard },
      { path: 'finanzas/gestion', name: 'finanzas-gestion', component: () => import('@/views/finanzas/GestionFinanciera.vue') },
      { path: 'finanzas/estadisticas', name: 'finanzas-estadisticas', component: () => import('@/views/dashboard/Estadisticas.vue') },
      { path: 'finanzas/reportes', name: 'finanzas-reportes', component: () => import('@/views/dashboard/EstadoResultados.vue') },
      { path: 'estudio', name: 'estudio', component: EstudioDashboard },
    ]
  },
  // Redirección para compatibilidad con links viejos
  { path: '/inicio', redirect: '/gastos' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
