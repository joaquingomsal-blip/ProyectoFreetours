<script setup>
import { ref, onMounted } from 'vue';
import * as bootstrap from 'bootstrap'; 


const rutas = ref([]);
const rutaSeleccionada = ref(null);
const asistentes = ref([]); 
const cargandoAsistentes = ref(false);

// TOAST
const mensajeToast = ref('');
const tipoToast = ref('success');


const cargarRutas = () => {
    fetch('http://localhost/freetours/api.php/rutas')
        .then(response => response.json())
        .then(data => {
            rutas.value = data;
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarToast('Error al conectar con el servidor', 'danger');
        });
};

const mostrarToast = (texto, tipo = 'success') => {
    mensajeToast.value = texto;
    tipoToast.value = tipo;
    const toastElement = document.getElementById('liveToast');
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
};

//ARREGLAR PARA QUE FUNCIONE BIEN
const verAsistentes = (ruta) => {
    asistentes.value = []; 
    rutaSeleccionada.value = ruta;
    cargandoAsistentes.value = true;

    const modalElement = document.getElementById('modalAsistentes');
    let modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (!modalInstance) modalInstance = new bootstrap.Modal(modalElement);
    modalInstance.show();

    fetch(`http://localhost/freetours/api.php/reservas?id_ruta=${ruta.id}`)
        .then(res => res.json())
        .then(data => {
           //Filtrar asistentes por ruta
            asistentes.value = data.filter(a => a.ruta_id == ruta.id);
            cargandoAsistentes.value = false;
        })
        .catch(err => {
            console.error("Error:", err);
            cargandoAsistentes.value = false;
        });
};
//MODAL ELIMINAR RUTA
const abrirConfirmacion = (ruta) => {
    rutaSeleccionada.value = ruta;
    const modalElement = document.getElementById('modalEliminar');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
};

const confirmarCancelacion = () => {
    if (!rutaSeleccionada.value) return;

    const id = rutaSeleccionada.value.id;
    fetch(`http://localhost/freetours/api.php/rutas?id=${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            mostrarToast('Ruta cancelada y eliminada correctamente');
            cargarRutas(); 
            const modalElement = document.getElementById('modalEliminar');
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) modal.hide();
        } else {
            throw new Error();
        }
    })
    .catch(() => {
        mostrarToast('Error al eliminar la ruta', 'danger');
    });
};

onMounted(cargarRutas);
</script>

<template>
    <div class="admin-container min-vh-100 py-5">
        <div class="container mt-5">
            <div class="row mb-4 align-items-center">
                <div class="col">
                    <h2 class="fw-bold display-6" style="color: #2D241E;">Gestión de Rutas</h2>
                    <p class="text-muted">Panel de administración para el control de asistencia y cancelaciones.</p>
                </div>
            </div>

            <div class="card shadow-lg border-0 overflow-hidden rounded-4">
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-hover mb-0 align-middle text-center">
                            <thead class="bg-dark-gold text-white text-uppercase small">
                                <tr>
                                    <th class="py-3">Id</th>
                                    <th class="py-3">Título</th>
                                    <th class="py-3">Localidad</th>
                                    <th class="py-3">Inscritos</th>
                                    <th class="py-3">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="ruta in rutas" :key="ruta.id">
                                    <td>
                                        {{ ruta.id }}                                       
                                    </td>
                                    <td class="fw-bold" style="color: #2D241E;">{{ ruta.titulo }}</td>
                                    <td>{{ ruta.localidad }}</td>
                                    <td>
                                        <button @click="verAsistentes(ruta)" class="btn btn-sm btn-light rounded-pill border shadow-sm px-3">
                                             {{ ruta.asistentes || 0 }} / 10
                                        </button>
                                    </td>
                                    <td>
                                        <button @click="abrirConfirmacion(ruta)" class="btn btn-outline-danger btn-sm rounded-pill px-3">
                                            Cancelar
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div v-if="rutas.length === 0" class="text-center py-5">
                <p class="fs-5 text-muted">No hay rutas pendientes en el sistema.</p>
            </div>
        </div>
        <!--MODAL ASISTENTES TERMINAR-->
        <div class="modal fade" id="modalAsistentes" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg">
                    <div class="modal-header bg-dark-gold text-white border-0 rounded-top-4">
                        <h5 class="modal-title">Lista de Asistentes</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body p-4">
                        <div class="mb-3 text-center">
                            <h4 class="fw-bold mb-0 text-amber" v-if="rutaSeleccionada">{{ rutaSeleccionada.titulo }}</h4>
                            <p class="text-muted small">{{ rutaSeleccionada?.localidad }} |  {{ rutaSeleccionada?.fecha }}</p>
                        </div>

                        <div v-if="cargandoAsistentes" class="text-center py-4">
                            <div class="spinner-border text-warning" role="status"></div>
                            <p class="mt-2 text-muted">Cargando...</p>
                        </div>

                        <div v-else-if="asistentes.length > 0">
                            <ul class="list-group list-group-flush">
                                <li v-for="asistente in asistentes" :key="asistente.cliente_id" class="list-group-item d-flex justify-content-between align-items-center px-0 py-3 bg-transparent">
                                    <div>
                                        <div class="fw-bold text-dark">{{ asistente.usuario_nombre }}</div>
                                        <div class="small text-muted">{{ asistente.num_personas }}</div>
                                    </div>
                                    <span class="badge rounded-pill bg-gold-soft text-gold">Confirmado</span>
                                </li>
                            </ul>
                        </div>
                        <div v-else class="text-center py-4">
                            <p class="text-muted">Aún no hay inscritos.</p>
                        </div>
                    </div>
                    <div class="modal-footer border-0">
                        <button type="button" class="btn btn-dark rounded-pill w-100" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>

        <!--MODAL ELIMINAR-->
        <div class="modal fade" id="modalEliminar" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg">
                    <div class="modal-header bg-danger text-white border-0 rounded-top-4">
                        <h5 class="modal-title">Confirmar Cancelación</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body p-5 text-center">
                        <div class="mb-3 fs-1"></div>
                        <h4 class="fw-bold mb-3">¿Cancelar esta ruta?</h4>
                        <p class="text-muted" v-if="rutaSeleccionada">
                            Se eliminará <strong>"{{ rutaSeleccionada.titulo }}"</strong>. Esta acción no se puede deshacer.
                        </p>
                        <div class="d-flex gap-2 justify-content-center mt-4">
                            <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Atrás</button>
                            <button type="button" @click="confirmarCancelacion" class="btn btn-danger rounded-pill px-4">Sí, Eliminar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="toast-container position-fixed bottom-0 end-0 p-3">
            <div id="liveToast" class="toast align-items-center text-white border-0" :class="'bg-' + tipoToast" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body fw-bold">{{ mensajeToast }}</div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.admin-container {
    background-color: #FFF9F0; 
    padding-top: 80px;
}

.bg-dark-gold {
    background-color: #2D241E;
}

.btn-gold {
    background-color: #FFB347;
    color: #2D241E;
    border: none;
    font-weight: bold;
}

.btn-gold:hover { background-color: #E69500; }

.bg-danger-soft { background-color: #ffeaea; }
.bg-success-soft { background-color: #e8f5e9; }

.table thead th {
    border: none;
    letter-spacing: 1px;
}

.modal-content {
    background-color: #FFF9F0;
    border-radius: 20px !important;
}

.text-amber { color: #E69500; }
.bg-gold-soft { background-color: rgba(255, 179, 71, 0.1); }
.text-gold { color: #E69500; font-weight: bold; }

.rounded-4 { border-radius: 1rem !important; }

.toast { z-index: 2000; }
.bg-success { background-color: #00BB77 !important; }
.bg-danger { background-color: #d9534f !important; }
</style>