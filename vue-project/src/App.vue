<script setup>
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
//import Footer from './components/Footer.vue';
</script>

<template>
  <NavBar /> <main class="main-content">
    <router-view />
  </main>
  <!--<Footer />-->
</template>

<style>
html, body {
  margin: 0 !important;
  padding: 0 !important;
  width: 100% !important;
  overflow-x: hidden; 
}

.main-content {
  width: 100%;
  margin: 0;
  padding: 0;
}
</style>