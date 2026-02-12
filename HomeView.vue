<script setup>
import { ref, onMounted } from 'vue'

const usuario = ref(null)

onMounted(() => {
    const datos = localStorage.getItem('user')
    if (datos) {
        usuario.value = JSON.parse(datos)
    }
})
</script>

<template>
  <div class="home-container">
    <div v-if="usuario" class="welcome-card">
      <h1>Bienvenido, {{ usuario.nombre }}</h1>
      <p>Has iniciado sesión como: <strong>{{ usuario.rol }}</strong></p>
      <p>Utiliza el menú superior para gestionar las rutas y reservas.</p>
    </div>

    <div v-else class="welcome-card">
      <h1>Plataforma FreeTours</h1>
      <p>Descubre las mejores rutas por la ciudad.</p>
      <hr>
      <p>Por favor, inicia sesión para continuar.</p>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
}
.welcome-card {
  background: #00BB77;
  padding: 3rem;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  text-align: center;
  color: white;
}
</style>