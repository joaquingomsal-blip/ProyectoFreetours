<script setup>
import { ref, onMounted } from 'vue';
import * as bootstrap from 'bootstrap';

// 1. ESTADO
const rutas = ref([]);         // Todas las rutas del guía
const asistentes = ref([]);    // Lista de personas para la ruta abierta
const rutaActiva = ref(null);  // La ruta que el guía está gestionando en ese momento

// 2. CARGAR RUTAS DEL GUÍA
function CargarRutas() {
    const usuarioString = localStorage.getItem('user');
    
    if (usuarioString) {
        const objeto = JSON.parse(usuarioString);
        const guia_id = objeto.id;

        fetch(`http://localhost/freetours/api.php/asignaciones?guia_id=${guia_id}`)
            .then(response => response.json())
            .then(data => {
                // Guardamos solo en rutas.value
                rutas.value = data;
            })
            .catch(error => {
                console.error("Error al cargar rutas:", error);
            });
    }
}

// 3. CARGAR ASISTENTES DE UNA RUTA
function abrirGestionRuta(rutaPulsada) {
    // Importante: Guardamos la ruta pulsada en la variable 'rutaActiva'
    rutaActiva.value = rutaPulsada;
    asistentes.value = []; // Limpiamos la lista anterior

    // Mostrar el Modal correctamente
    const modalElement = document.getElementById('modalAsistentes');
    if (modalElement) {
        const modalAsistentes = new bootstrap.Modal(modalElement);
        modalAsistentes.show();
    }

    // Petición de inscritos
    fetch(`http://localhost/freetours/api.php/inscritos?id_ruta=${rutaPulsada.id}`)
        .then(response => response.json())
        .then(data => {
            asistentes.value = data;
        })
        .catch(error => {
            console.error("Error al cargar inscritos:", error);
        });
}

onMounted(CargarRutas);
</script>

<template>
    <div class="admin-container min-vh-100 py-5">
        <div class="container mt-5">
            <h2 class="fw-bold mb-4" style="color: #2D241E;">Mis Rutas Asignadas</h2>
            
            <div class="row g-4">
                <div class="col-md-6 col-lg-4" v-for="ruta in rutas" :key="ruta.id">
                    <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                        <img :src="ruta.ruta_foto || '/placeholder.jpg'" class="card-img-top" :alt="ruta.ruta_titulo">
                        
                        <div class="card-body">
                            <h5 class="fw-bold" style="color: #2D241E;">{{ ruta.ruta_titulo }}</h5>
                            <p class="text-amber mb-2 small">📍 {{ ruta.ruta_localidad }}</p>
                            <p class="text-muted small mb-0">{{ ruta.ruta_descripcion }}</p>
                        </div>

                        <div class="card-footer bg-white border-0 pb-4 px-3">
                            <button @click="abrirGestionRuta(ruta)" class="btn btn-gold w-100 rounded-pill fw-bold">
                                Gestionar Asistentes
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="rutas.length === 0" class="text-center py-5">
                <p class="text-muted fs-5">No tienes rutas asignadas actualmente.</p>
            </div>
        </div>

        <div class="modal fade" id="modalAsistentes" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 rounded-4 shadow-lg">
                    <div class="modal-header bg-dark text-white border-0 rounded-top-4">
                        <h5 class="modal-title">
                            Asistentes: {{ rutaActiva?.ruta_titulo }}
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body p-4">
                        <div v-if="asistentes.length > 0">
                            <p class="text-muted small mb-3">Lista de personas registradas para este tour:</p>
                            <ul class="list-group list-group-flush">
                                <li v-for="persona in asistentes" :key="persona.email" 
                                    class="list-group-item d-flex justify-content-between align-items-center px-0 py-3 bg-transparent">
                                    <div>
                                        <div class="fw-bold text-dark">{{ persona.nombre }}</div>
                                        <div class="small text-muted">{{ persona.email }}</div>
                                    </div>
                                    <span class="badge rounded-pill bg-gold-soft text-gold">Confirmado</span>
                                </li>
                            </ul>
                        </div>
                        <div v-else class="text-center py-4">
                            <div class="fs-1 mb-2">🤷‍♂️</div>
                            <p class="text-muted">Aún no hay reservas confirmadas para esta ruta.</p>
                        </div>
                    </div>
                    <div class="modal-footer border-0">
                        <button type="button" class="btn btn-dark rounded-pill w-100 py-2" data-bs-dismiss="modal">Cerrar Lista</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.admin-container {
    background-color: #FFF9F0; /* Fondo Crema Golden Hour */
}

.text-amber {
    color: #E69500;
}

.btn-gold {
    background-color: #FFB347;
    color: #2D241E;
    border: none;
    transition: all 0.3s;
}

.btn-gold:hover {
    background-color: #E69500;
    transform: translateY(-2px);
}

.bg-gold-soft {
    background-color: rgba(255, 179, 71, 0.1);
}

.text-gold {
    color: #E69500;
}

.modal-content {
    background-color: #FFF9F0;
}

.card {
    transition: transform 0.3s ease;
}

.card:hover {
    transform: translateY(-5px);
}
</style>