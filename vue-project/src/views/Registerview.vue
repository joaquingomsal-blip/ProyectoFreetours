<script>
import { ref } from 'vue';
import router from '@/router';

const form = ref({
    name: '',
    email: '',
    password: ''
})

function register() {
const data = { name: form.value.name, email: form.value.email, password: form.value.password };

fetch('http://localhost:8008/api.php/usuarios', {
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
        router.push('/home');
    } else {
        alert('Credenciales incorrectas');
    }
})
.catch(error => console.error(error));
}
</script>

<template>
    <form @submit.prevent="register" class="d-flex  align-items-center gap-2">
        <label for="name">Nombre</label>
        <input v-model="form.name" type="text" id="name" class="form-control " placeholder="Nombre" required />
        <label for="email">Email</label>
        <input v-model="form.email" type="text" id="email" class="form-control " placeholder="Email" required />
        <label for="password">Contraseña</label>
        <input v-model="form.password" type="password" class="form-control " placeholder="Contraseña" required />
        <button type="submit" class="btn btn-success">Registrarse</button>
    </form>
</template>