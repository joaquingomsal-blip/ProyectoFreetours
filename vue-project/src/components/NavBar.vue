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
  <header>
    <div class="logo">FreeTours</div>
    <nav>
      <RouterLink to="/">Inicio</RouterLink>

      <template v-if="!usuario">
        <RouterLink to="/login">Iniciar Sesion</RouterLink>
        <RouterLink to="/register">Registro</RouterLink>
      </template>

      <template v-else>
        <RouterLink v-if="usuario.rol === 'admin'" to="/usuarios">Administrar usuarios</RouterLink>
        <span class="user-info">Hola, {{ usuario.nombre }}</span>
        <button @click="logout" class="btn-logout">Salir</button>
      </template>
    </nav>
  </header>
  </template>
<style scoped>
*{
    color: white;
}
header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background-color: #00BB77;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 5%;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  box-sizing: border-box;
  color: white;
}
nav {
  display: flex;
  align-items: center;
  gap: 15px;
  color: white  ;
}
.user-info { 
    margin-left: 1rem; 
    font-weight: bold; 
    color: white; 
}
.btn-logout { 
  background: #ff4757; 
  color: white; 
  border: none; 
  padding: 8px 15px; 
  border-radius: 6px; 
  cursor: pointer;
}
</style>