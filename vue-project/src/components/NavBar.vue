<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute() // Necesario para detectar la página actual
const usuario = ref(null)
const scrolleado = ref(false)
const esPaginaEstatica = ref(false)

const cargarUsuario = () => {
    const datos = localStorage.getItem('user')
    if (datos) usuario.value = JSON.parse(datos)
}

const controlarScroll = () => {
    scrolleado.value = window.scrollY > 50
}

// Verifica si estamos en una página que NO es el Inicio
const verificarRuta = () => {
    esPaginaEstatica.value = route.path !== '/'
}

onMounted(() => {
    cargarUsuario()
    window.addEventListener('scroll', controlarScroll)
    verificarRuta() // Comprobar ruta al cargar
})

// Vigilamos el cambio de ruta para actualizar el comportamiento del Navbar
watch(() => route.path, () => {
    verificarRuta()
})

onUnmounted(() => {
    window.removeEventListener('scroll', controlarScroll)
})

const logout = () => {
    localStorage.removeItem('user')
    usuario.value = null
    router.push('/login').then(() => {
        window.location.reload()
    })
}
</script>

<template>
  <div :class="['p-3 shadow-sm d-flex align-items-center fixed-top w-100 text-white transition-nav', 
                (scrolleado || esPaginaEstatica) ? 'bg-freetours shadow' : 'bg-transparent shadow-none']">
    
    <button class="btn btn-outline-light me-3 border-0 shadow-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebarMenu">
       <span class="fs-3">☰</span>
    </button>
    
    <div :class="['fs-4 fw-bold transition-text', (scrolleado || esPaginaEstatica) ? 'opacity-100' : 'opacity-0']">
      FreeTours
    </div>
  </div>

  <div class="offcanvas offcanvas-start bg-dark text-white" tabindex="-1" id="sidebarMenu" style="width: 280px;">
    <div class="offcanvas-header border-bottom border-secondary">
      <h5 class="offcanvas-title">Menú FreeTours</h5>
      <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas"></button>
    </div>
    <div class="offcanvas-body d-flex flex-column p-0">
      <ul class="nav nav-pills flex-column mb-auto mt-3">
        <li class="nav-item px-3 mb-2">
          <RouterLink to="/" class="nav-link text-white" active-class="bg-gold-active">Inicio</RouterLink>
        </li>
        <template v-if="!usuario">
          <li class="nav-item px-3 mb-2">
            <RouterLink to="/login" class="nav-link text-white" active-class="bg-gold-active">Iniciar Sesión</RouterLink>
          </li>
        </template>
        <template v-else>
          <li v-if="usuario.rol === 'admin'" class="nav-item px-3 mb-2">
            <RouterLink to="/usuarios" class="nav-link text-white" active-class="bg-gold-active">Administrar usuarios</RouterLink>
          </li>
          <li v-if="usuario.rol === 'admin'" class="nav-item px-3 mb-2">
            <RouterLink to="/rutas" class="nav-link text-white" active-class="bg-gold-active">Crear rutas</RouterLink>
          </li>
          <li v-if="usuario.rol === 'admin'" class="nav-item px-3 mb-2">
            <RouterLink to="/listar-rutas" class="nav-link text-white" active-class="bg-gold-active">Listar rutas</RouterLink>
          </li>
          <li v-if="usuario.rol === 'admin'" class="nav-item px-3 mb-2">
            <RouterLink to="/admin-dashboard" class="nav-link text-white" active-class="bg-gold-active">Estadisticas</RouterLink>
          </li>
          <li v-if="usuario.rol === 'guia'" class="nav-item px-3 mb-2">
            <RouterLink to="/asignadas" class="nav-link text-white" active-class="bg-gold-active">Administrar rutas</RouterLink>
          </li>
        </template>
      </ul>
      <div v-if="usuario" class="p-3 border-top border-secondary">
        <div class="mb-3">
            <small class="text-secondary d-block">Usuario:</small>
            <span class="fw-bold">{{ usuario.nombre }} ({{ usuario.rol }})</span>
        </div>
        <button @click="logout" class="btn btn-danger w-100">Cerrar Sesión</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.transition-nav { transition: all 0.4s ease-in-out; }
.transition-text { transition: opacity 0.3s ease; }

.bg-freetours { 
    background-color: #FFB347 !important; /* Dorado cálido */
}
.bg-transparent { background-color: transparent !important; }

.opacity-0 { opacity: 0; }
.opacity-100 { opacity: 1; }

.nav-link { border-radius: 8px; transition: 0.3s; }
.nav-link:hover { background-color: rgba(255, 255, 255, 0.1); }

/* Color ámbar para el link activo en el sidebar */
.bg-gold-active {
    background-color: #E69500 !important;
}

.offcanvas {
    background-color: #2D241E !important; /* Marrón Golden Hour */
}
</style>