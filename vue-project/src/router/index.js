import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/Loginview.vue'
import RegisterView from '../views/Registerview.vue'
import UsuarioView from '../views/UsuariosView.vue'
import CrearRutasview from '../views/CrearRutasview.vue'
import ListarRutasView from '@/views/ListarRutasView.vue'
import AdminDashboardView from '@/views/AdminDashboardView.vue'
import RutasAsignadasView from '@/views/RutasAsignadasView.vue'
import HacerReservaView from '@/views/HacerReservaView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
  
    {
      path: '/usuarios',
      name: 'usuario',
      component: UsuarioView,
      meta: { requiresAdmin: true } 
    },
    {
      path: '/rutas',
      name: 'rutas',
      component: CrearRutasview,
      meta: { requiresAdmin: true }
    },
    {
      path: '/listar-rutas',
      name: 'listar-rutas',
      component: ListarRutasView,
      meta: { requiresAdmin: true }
    },
    {
      path: '/admin-dashboard',
      name: 'admin-dashboard',
      component: AdminDashboardView,
      meta: { requiresAdmin: true }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/asignadas',
      name: 'asignadas',
      component: () => import('../views/RutasAsignadasView.vue'),
    },
    {
      path: '/reservas',
      name: 'reservas',
      component: () => import('../views/HacerReservaView.vue'),
    },
  ],
})


router.beforeEach((to, from, next) => {
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;

  if (to.matched.some(record => record.meta.requiresAdmin)) {
    if (!user || user.rol !== 'admin') {
      next({ 
        path: '/', 
        query: { authError: 'no-admin' } 
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router