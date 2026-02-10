<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Definimos el formulario con ref
const form = ref({
    email: '',
    password: '' 
});

function login() {
    const loginData = {
        email: form.value.email,
        contraseña: form.value.password
    };

    fetch('http://localhost/freetours/api.php/usuarios?login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            console.log('Login exitoso:', data.user);
            
            // Guardamos el objeto usuario entero para saber su ROL luego
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Redirigimos a la home
            router.push('/').then(() => {
                window.location.reload()
            })
        } else {
            console.log('Error de login:', data.message);
            alert('Error: ' + data.message);
        }
    })
    .catch(error => console.error('Error:', error));
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <h2>Iniciar Sesión</h2>
      <form @submit.prevent="login">
        <div class="form-group">
          <label>Email</label>
          <input v-model="form.email" type="email" placeholder="email@ejemplo.com" required />
        </div>
        <div class="form-group">
          <label>Contraseña</label>
          <input v-model="form.password" type="password" placeholder="Tu contraseña" required />
        </div>
        <button type="submit" class="btn-login">Entrar</button>
      </form>
    </div>
  </div>
</template>
<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 100px); 
}

.login-card {
  background: rgba(255, 255, 255, 0.95); 
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 380px;
  backdrop-filter: blur(5px);
}

h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
  font-weight: 700;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #4a5568;
  font-size: 0.9rem;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #edf2f7;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #42b983;
  background-color: #fff;
  box-shadow: 0 0 0 4px rgba(66, 185, 131, 0.1);
}

.btn-login {
  width: 100%;
  padding: 0.85rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.3s;
  margin-top: 1rem;
}

.btn-login:hover {
  background-color: #3aa876;
  transform: translateY(-1px);
}

.btn-login:active {
  transform: translateY(0);
}
</style><style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 100px); 
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 380px;
  backdrop-filter: blur(5px);
}

h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
  font-weight: 700;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #4a5568;
  font-size: 0.9rem;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #edf2f7;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #42b983;
  background-color: #fff;
  box-shadow: 0 0 0 4px rgba(66, 185, 131, 0.1);
}

.btn-login {
  width: 100%;
  padding: 0.85rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.3s;
  margin-top: 1rem;
}

.btn-login:hover {
  background-color: #3aa876;
  transform: translateY(-1px);
}

.btn-login:active {
  transform: translateY(0);
}
</style>