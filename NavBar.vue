<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const usuario = ref(null)

const cargarUsuario = () => {
    const datos = localStorage.getItem('user')
    if (datos) {
        usuario.value = JSON.parse(datos)
    }
}

onMounted(() => {
    cargarUsuario()
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
  <div class="p-3 bg-freetours shadow-sm d-flex align-items-center fixed-top w-100 text-white">
    <button class="btn btn-light me-3" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebarMenu">
      <span class="navbar-toggler-icon" style="filter: invert(0);"></span> Menu
    </button>
    <div class="fs-4 fw-bold">FreeTours</div>
  </div>

  <div class="offcanvas offcanvas-start bg-dark text-white" tabindex="-1" id="sidebarMenu" aria-labelledby="sidebarMenuLabel" style="width: 280px;">
    <div class="offcanvas-header border-bottom border-secondary">
      <h5 class="offcanvas-title" id="sidebarMenuLabel">FreeTours</h5>
      <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    
    <div class="offcanvas-body d-flex flex-column p-0">
      <ul class="nav nav-pills flex-column mb-auto mt-3">
        <li class="nav-item px-3 mb-2">
          <RouterLink to="/" class="nav-link text-white" active-class="active bg-success">
            Inicio
          </RouterLink>
        </li>

        <template v-if="!usuario">
          <li class="nav-item px-3 mb-2">
            <RouterLink to="/login" class="nav-link text-white" active-class="active bg-success">Iniciar Sesión</RouterLink>
          </li>
          <li class="nav-item px-3 mb-2">
            <RouterLink to="/register" class="nav-link text-white" active-class="active bg-success">Registro</RouterLink>
          </li>
        </template>

        <template v-else>
          <li v-if="usuario.rol === 'admin'" class="nav-item px-3 mb-2">
            <RouterLink to="/usuarios" class="nav-link text-white" active-class="active bg-success">
              Administrar usuarios
            </RouterLink>
          </li>
        </template>
      </ul>

      <div v-if="usuario" class="p-3 border-top border-secondary">
        <div class="mb-3">
            <small class="text-secondary d-block">Conectado como:</small>
            <span class="fw-bold">{{ usuario.nombre }}</span>
        </div>
        <button @click="logout" class="btn btn-danger w-100">Cerrar Sesión</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-freetours {
    background-color: #00BB77;
}

.nav-link {
    transition: 0.3s;
    border-radius: 8px;
}

.nav-link:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

/* Ajuste para que el contenido de la página no empiece debajo del botón fixed */


.offcanvas-body .nav-link {
    font-size: 1.1rem;
    padding: 10px 15px;
}
</style>