<script setup>
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
</script>

<template>
  <NavBar /> <main class="main-content">
    <router-view />
  </main>
</template>

<style>
/* Elimina márgenes que pone el navegador por defecto */
html, body {
  margin: 0 !important;
  padding: 0 !important;
  width: 100% !important;
  overflow-x: hidden; /* Evita que la página baile hacia los lados */
}

.main-content {
  width: 100%;
  margin: 0;
  padding: 0;
}
</style>