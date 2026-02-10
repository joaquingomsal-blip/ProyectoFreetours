<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const form = ref({
    nombre: '',
    email: '',
    password: ''
});

function register() { 
    const userData = {
        nombre: form.value.nombre,
        email: form.value.email,
        contraseña: form.value.password
    };

    fetch('http://localhost/freetours/api.php/usuarios', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Respuesta:', data); 
        alert('Usuario creado correctamente');
        router.push('/login');
    })
    .catch(error => console.error('Error:', error));
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>Registro de Usuario</h2>
      <form @submit.prevent="register">
        <div class="input-group">
          <label>Nombre Completo</label>
          <input v-model="form.nombre" type="text" placeholder="Tu nombre" required />
        </div>
        <div class="input-group">
          <label>Email</label>
          <input v-model="form.email" type="email" placeholder="email@ejemplo.com" required />
        </div>
        <div class="input-group">
          <label>Contraseña</label>
          <input v-model="form.password" type="password" placeholder="Contraseña" required />
        </div>
        <button type="submit" class="btn-submit">Crear Cuenta</button>
      </form>
    </div>
  </div>
</template>
<style scoped>

</style>