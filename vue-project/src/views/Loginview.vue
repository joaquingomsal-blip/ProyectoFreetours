<script>
import { ref } from 'vue';
import router from '@/router';

const emit = defineEmits(['login']);

const form = ref({
    email: '',
    password: ''
})

    function login() {
    const data = { email: form.value.email, password: form.value.password };

    fetch('http://localhost:8008/api.php/usuarios?login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem('token', data.token);
            emit('login');
            router.push('/home');
        } else {
            alert('Credenciales incorrectas');
        }
    })
    .catch(error => console.error(error));
}
</script>

<template>
    <form @submit.prevent="login" class="d-flex  align-items-center gap-2">
        <label for="email">Email</label>
        <input v-model="form.email" type="text" id="usuario" class="form-control " placeholder="Email" required />
        <label for="password">Contraseña</label>
        <input v-model="form.password" type="password" class="form-control " placeholder="Contraseña" required />
        <button type="submit" class="btn btn-success">Iniciar Sesión</button>
    </form>
    <!-- boton para ir al registro si no tiene cuenta -->
    <router-link to="/register" class="btn btn-primary">Registrarse</router-link>
</template>
