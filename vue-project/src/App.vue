<script setup>
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
</script>

<template>
  <NavBar />

  <main class="container-fluid p-0">
    <RouterView />
  </main>
</template>