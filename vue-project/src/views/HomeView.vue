<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router';
import * as bootstrap from 'bootstrap'

const router = useRouter();
const usuario = ref(null)
const rutas = ref([])
const filtro = ref('')
const usuarioLogeado = ref(localStorage.getItem('user'));
const rutaActiva = ref(null);
const cantidadAsistentes = ref(1); // Aprovechamos para definir el contador de la reserva

function abrirDetalles(ruta) {
  rutaActiva.value = ruta;

  usuarioLogeado.value = localStorage.getItem('user');
  const modal = new bootstrap.Modal(document.getElementById('modalLogin'));
  modal.show();

}

const irLogin = () => {
  router.push('/login')
}

const irRegistro = () => {
  router.push('/register')
}

const cargarDatos = () => {
    const datos = localStorage.getItem('user')
    if (datos) {
        usuario.value = JSON.parse(datos)
    }
    
    // FETCH a tu API de rutas
    fetch('http://localhost/freetours/api.php/rutas')
        .then(res => res.json())
        .then(data => rutas.value = data)
        .catch(err => console.error("Error cargando rutas:", err))
}

onMounted(cargarDatos)

// Buscador por localidad o título (Requisito PDF) [cite: 55, 56]
const rutasFiltradas = computed(() => {
    return rutas.value.filter(r => 
        r.localidad.toLowerCase().includes(filtro.value.toLowerCase()) ||
        r.titulo.toLowerCase().includes(filtro.value.toLowerCase())
    )
})
</script>

<template>
  <div class="landing-page" style="background-color: #FFF9F0;">
    
    <div class="video-hero">
      <video autoplay muted loop playsinline class="video-bg">
        <source src="@/assets/video.mp4" type="video/mp4">
      </video>
      <div class="overlay d-flex align-items-center justify-content-center">
        <div class="text-center text-white px-3">
          <h1 class="display-1 fw-bold mb-2 gold-text">HORA DORADA</h1>
          <p class="fs-3 mb-0 text-light opacity-75">Descubre la magia de cada ciudad al alardecer</p> 
        </div>
      </div>
    </div>

    <div class="container mt-n5 position-relative z-index-2">
      
      <div class="row justify-content-center mb-5">
        <div class="col-md-8">
          <div class="search-box p-2 bg-white shadow-lg rounded-pill d-flex align-items-center">
            <span class="ms-3 fs-4">🔎</span>
            <input type="text" v-model="filtro" 
                   class="form-control border-0 shadow-none bg-transparent py-3 ps-3" 
                   placeholder="¿Qué ciudad quieres explorar? (Ej: Granada, Jaén...)"> 
            <button class="btn btn-gold rounded-pill px-4 py-2 me-2 fw-bold">BUSCAR</button>
          </div>
        </div>
      </div>

      <div class="row mb-4">
        <div class="col text-center">
          <h2 class="fw-bold display-6" style="color: #2D241E;">Nuestras Rutas</h2>
          <div class="divider mx-auto mb-4"></div>
          <p v-if="usuario" class="text-muted">Hola, {{ usuario.nombre }}. Tienes acceso a reservas.</p> [cite: 5]
        </div>
      </div>

      <div class="row row-cols-1 row-cols-md-3 g-4 mb-5">
        <div class="col" v-for="ruta in rutasFiltradas" :key="ruta.id">
          <div class="card h-100 border-0 shadow-sm tour-card">
            <div class="position-relative">
                <img :src="ruta.foto || '/placeholder.jpg'" class="card-img-top" :alt="ruta.titulo"> [cite: 18, 60]
                <div class="badge-date">{{ ruta.fecha }}</div> 
            </div>
            
            <div class="card-body p-4">
              <h5 class="card-title fw-bold mb-2" style="color: #2D241E;">{{ ruta.titulo }}</h5> [cite: 61]
              <p class="text-amber mb-3 small">📍 {{ ruta.localidad }}</p>
              <p class="card-text text-muted small mb-0">{{ ruta.descripcion }}</p> [cite: 17, 63]
            </div>

            <div class="card-footer bg-white border-0 p-4 pt-0">
              <button @click="abrirDetalles(ruta)" class="btn btn-outline-dark w-100 rounded-pill fw-bold">
                {{ usuario ? 'Ver detalles y Reservar' : 'Ver más información' }} 
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="rutasFiltradas.length === 0" class="text-center py-5">
        <p class="fs-5 text-muted">No encontramos rutas para "{{ filtro }}". Prueba otra ciudad.</p>
      </div>
    </div>
  </div>

  <!--MODAL-->
  <div class="modal fade" id="modalLogin" tabindex="-1">
  
  <div class="modal-dialog modal-dialog-centered">
    
    <div class="modal-content">
      
      <div class="modal-header">
        <h5 class="modal-title">Título del Modal</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
    <h3>{{ rutaActiva?.ruta_titulo }}</h3>
    <p>{{ rutaActiva?.ruta_descripcion }}</p>
    <p><strong>Punto de encuentro:</strong> {{ rutaActiva?.punto_encuentro }}</p>

    <hr> <div v-if="usuarioLogeado">
        <h5>Realizar Reserva</h5>
        <div class="mb-3">
            <label>Asistentes (Máximo 8):</label>
            <input type="number" v-model="cantidadAsistentes" min="1" max="8" class="form-control">
        </div>
        <button class="btn btn-success w-100" @click="hacerReserva">
            Confirmar Reserva
        </button>
    </div>

    <div v-else class="alert alert-info border-0 rounded-4">
        <p class="mb-3">Debes estar registrado para poder realizar una reserva en esta ruta.</p>
        <div class="d-flex gap-2">
            <button @click="irLogin" class="btn btn-primary btn-sm" data-bs-dismiss="modal">Login</button>
            <button @click="irRegistro" class="btn btn-outline-primary btn-sm" data-bs-dismiss="modal">Registrarse</button>
        </div>
    </div>
</div>
  </div>
  </div>
</div>
</template>

<style scoped>
/* HERO Y VIDEO */
.video-hero {
  position: relative;
  height: 70vh; /* Ajustado para que se vea el inicio del contenido */
  width: 100%;
  overflow: hidden;
}

.video-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  transform: translate(-50%, -50%);
  object-fit: cover;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
}

.gold-text {
  color: #FFB347;
  letter-spacing: 4px;
  text-shadow: 2px 2px 8px rgba(0,0,0,0.5);
}

/* BUSCADOR */
.mt-n5 {
  margin-top: -50px; /* Hace que el buscador "suba" un poco sobre el video */
}

.search-box {
  transition: transform 0.3s ease;
}

.search-box:focus-within {
  transform: translateY(-5px);
}

.btn-gold {
  background-color: #FFB347;
  color: #2D241E;
  border: none;
}

.btn-gold:hover {
  background-color: #E69500;
}

/* CARDS */
.tour-card {
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.tour-card:hover {
  transform: translateY(-12px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
}

.card-img-top {
  height: 220px;
  object-fit: cover;
}

.badge-date {
    position: absolute;
    top: 15px;
    right: 15px;
    background: rgba(255, 179, 71, 0.9);
    color: #2D241E;
    padding: 5px 15px;
    border-radius: 50px;
    font-size: 0.8rem;
    font-weight: bold;
}

.text-amber {
  color: #E69500;
  font-weight: 600;
}

.divider {
    width: 60px;
    height: 4px;
    background-color: #FFB347;
    border-radius: 2px;
}
</style>