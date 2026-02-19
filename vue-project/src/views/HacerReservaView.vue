<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const reservaData = ref({
    email: '',
    ruta_id: '',
    num_personas: 1 
})

const mensaje = ref('');

onMounted(() => {

    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        reservaData.value.email = user.email;
    }

    if (route.query.rutaId) {
        reservaData.value.ruta_id = route.query.rutaId;
    }
});

const hacerReserva = () => {
    if (reservaData.value.num_personas > 8) {
        alert("El máximo de asistentes es 8.");
        return;
    }

    fetch('http://localhost/freetours/api.php/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservaData.value)
    })
    .then(response => response.json())
    .then(data => {
        mensaje.value = "¡Reserva realizada con éxito!";
        setTimeout(() => router.push('/'), 2000);
    })
    .catch(error => console.error('Error:', error));
}
</script>

<template>
    <div class="container mt-5 pt-5">
        <div class="card shadow p-4 mx-auto" style="max-width: 500px;">
            <h1 class="text-center mb-4">Finalizar Reserva</h1>
            
            <div v-if="mensaje" class="alert alert-success">{{ mensaje }}</div>

            <form @submit.prevent="hacerReserva">
                <div class="mb-3">
                    <label class="form-label">Tu Email</label>
                    <input type="email" v-model="reservaData.email" class="form-control" readonly>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">ID de la Ruta seleccionada</label>
                    <input type="number" v-model="reservaData.ruta_id" class="form-control" readonly>
                </div>

                <div class="mb-3">
                    <label class="form-label">¿Cuántas personas vendréis? (Máx. 8)</label>
                    <input type="number" v-model="reservaData.num_personas" class="form-control" min="1" max="8" required>
                </div>

                <button type="submit" class="btn btn-primary w-100">Confirmar y Pagar</button>
            </form>
        </div>
    </div>
</template>