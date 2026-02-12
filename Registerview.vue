<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { CToaster, CToast, CToastHeader, CToastBody } from '@coreui/vue';

const router = useRouter();
const toasts = ref([]);

const form = ref({
    nombre: '',
    email: '',
    password: ''
});

const addToast = (titulo, mensaje, color = 'primary') => {
    toasts.value.push({
        id: Date.now(),
        title: titulo,
        content: mensaje,
        color: color
    });
};

function register() { 
    const userData = {
        nombre: form.value.nombre,
        email: form.value.email,
        contraseña: form.value.password
    };

    fetch('http://localhost/freetours/api.php/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        addToast('¡Éxito!', 'Cuenta creada correctamente. Redirigiendo...', 'success');
        

        setTimeout(() => {
            router.push('/login');
        }, 1500);
    })
    .catch(error => {
        console.error('Error:', error);
        addToast('Error', 'No se pudo completar el registro', 'danger');
    });
}
</script>

<template>
  <div class="container d-flex justify-content-center align-items-center vh-100">
    
    <div class="card shadow-lg border-0 p-4 rounded-4" style="max-width: 450px; width: 100%; background: rgba(255, 255, 255, 0.98);">
      <div class="card-body">
        <h2 class="text-center mb-4 fw-bold text-dark">Crear Cuenta</h2>
        
        <form @submit.prevent="register">
          <div class="mb-3">
            <label class="form-label fw-bold text-secondary small">Nombre Completo</label>
            <input v-model="form.nombre" type="text" class="form-control form-control-lg border-2"  placeholder="Tu nombre" required 
            />
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold text-secondary small">Email</label>
            <input v-model="form.email" type="email" class="form-control form-control-lg border-2" placeholder="email@ejemplo.com" required />
          </div>

          <div class="mb-4">
            <label class="form-label fw-bold text-secondary small">Contraseña</label>
            <input v-model="form.password" type="password" class="form-control form-control-lg border-2" placeholder="Crea una contraseña" required />
          </div>

          <button type="submit" class="btn btn-success btn-lg w-100 fw-bold shadow-sm py-2">
            Registrarse
          </button>
        </form>

        <div class="mt-4 text-center">
            <span class="text-muted small">¿Ya eres parte de FreeTours? </span>
            <RouterLink to="/login" class="text-success fw-bold text-decoration-none small">Inicia sesión</RouterLink>
        </div>
      </div>
    </div>

    <CToaster class="p-3" placement="top-end">
        <CToast v-for="toast in toasts" :key="toast.id" visible :color="toast.color">
            <CToastHeader closeButton>
                <span class="me-auto fw-bold text-dark">{{ toast.title }}</span>
            </CToastHeader>
            <CToastBody class="text-dark">{{ toast.content }}</CToastBody>
        </CToast>
    </CToaster>

  </div>
</template>

<style scoped>
.form-control:focus {
    border-color: #00BB77;
    box-shadow: 0 0 0 0.25rem rgba(0, 187, 119, 0.15);
}

.btn-success {
    background-color: #00BB77;
    border-color: #00BB77;
}

.btn-success:hover {
    background-color: #00a66a;
    transform: translateY(-1px);
    transition: all 0.2s;
}

.card {
    background-color: white;
}
</style>