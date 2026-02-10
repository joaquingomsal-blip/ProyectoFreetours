<script setup>
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
</script>

<template>
  <NavBar />

  <main class="container">
    <RouterView />
  </main>
</template>
<style>
body {
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif;
  background: white;
  min-height: 100vh;
}
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
}

.auth-card {
  background: white;
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 8px;
  width: 100%;
  max-width: 350px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.input-group {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

.input-group label {
  font-size: 14px;
  margin-bottom: 5px;
  font-weight: bold;
}

.input-group input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.btn-submit {
  width: 100%;
  padding: 12px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.btn-submit:hover {
  background-color: #34495e;
}
</style>