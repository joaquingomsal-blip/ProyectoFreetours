<script setup>
import { ref, onMounted } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const rutas = ref({
    titulo: '',
    localidad: '',
    descripcion: '',
    fecha: '',
    hora: '',
    latitud: '', 
    longitud: '', 
    guia_id: ''
});

let map;
let marker;

onMounted(() => {
    map = L.map('map-container').setView([37.77, -3.78], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        rutas.value.latitud = lat.toFixed(6);
        rutas.value.longitud = lng.toFixed(6);

        if (marker) {
            marker.setLatLng(e.latlng);
        } else {
            marker = L.marker(e.latlng).addTo(map);
        }
    });
});
</script>

<template>
    <div class="container mt-4">
        <div v-if="mostrarAlerta" :class="['alert', 'alert-' + tipoAlerta]" role="alert">
            {{ mensaje }}
        </div>

        <div class="card shadow p-5">
            <h1 class="text-center mb-4">Crear Nueva Ruta</h1>
            <form @submit.prevent="crear_ruta" class="row g-3">
                <div class="col-md-6">
                    <label class="form-label">Título</label>
                    <input type="text" class="form-control" v-model="rutas.titulo" required>
                </div>

                <div class="col-md-6">
                    <label class="form-label">Localidad</label>
                    <input type="text" class="form-control" v-model="rutas.localidad" required>
                </div>

                <div class="col-12">
                    <label class="form-label">Descripción</label>
                    <textarea class="form-control" v-model="rutas.descripcion" required></textarea>
                </div>
                <!---MAPA-->
                <div class="col-12">
                    <label class="form-label fw-bold">Punto de Encuentro (Haz clic en el mapa)</label>
                    <div id="map-container" style="height: 300px; border-radius: 8px;" class="mb-2 shadow-sm"></div>
                    
                    <div class="row">
                        <div class="col-md-6">
                            <input type="text" class="form-control form-control-sm" 
                                   v-model="rutas.latitud" placeholder="Latitud" readonly>
                        </div>
                        <div class="col-md-6">
                            <input type="text" class="form-control form-control-sm" 
                                   v-model="rutas.longitud" placeholder="Longitud" readonly>
                        </div>
                    </div>
                </div>
                <!---MAPA-->
                <div class="col-md-6">
                    <label class="form-label">Fecha</label>
                    <input type="date" class="form-control" v-model="rutas.fecha" required>
                </div>

                <div class="col-md-6">
                    <label class="form-label">Hora</label>
                    <input type="time" class="form-control" v-model="rutas.hora" required>
                </div>
                <div class="col-md-4">
                    <label class="form-label">ID Guía</label>
                    <input type="number" class="form-control" v-model="rutas.guia_id" required>
                </div>

                <button type="submit" class="btn btn-primary w-100 mt-4">Publicar Ruta</button>
            </form>
        </div>
    </div>
</template>
