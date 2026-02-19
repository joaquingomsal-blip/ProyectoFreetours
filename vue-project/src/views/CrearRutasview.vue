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
    guia_id: '',
    foto: '',
});



const address = ref('');
const mensaje = ref('');
const tipoAlerta = ref('success');
const mostrarAlerta = ref(false);
const guiasLibres = ref([]);

let map;
let marker;

function buscarGuias() {
    const fechaElegida = rutas.value.fecha;
    fetch(`http://localhost/freetours/api.php/asignaciones?fecha=${fechaElegida}`)
        .then(response => response.json())
        .then(data => {
            guiasLibres.value = data; 
            console.log('Estos guías están libres:', data);
        })
        .catch(error => console.error('Error:', error));
}

//Geocoding 
const buscarDireccion = () => {
    if (address.value.length < 3) return;

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${address.value}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const { lat, lon } = data[0];
                const newCoords = [parseFloat(lat), parseFloat(lon)];

                map.setView(newCoords, 16);

                if (marker) {
                    marker.setLatLng(newCoords);
                } else {
                    marker = L.marker(newCoords).addTo(map);
                }

                rutas.value.latitud = lat;
                rutas.value.longitud = lon;
            } else {
                alert("No se ha encontrado la ubicación");
            }
        })
        .catch(error => console.error('Error en geocoding:', error));
};


const crear_ruta = () => {
    fetch('http://localhost/freetours/api.php/rutas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rutas.value)
    })
    .then(res => res.json())
    .then(data => {
        mensaje.value = "Ruta creada y guía asignado correctamente";
        tipoAlerta.value = "success";
        mostrarAlerta.value = true;
        
        // Limpiar formulario
        Object.keys(rutas.value).forEach(key => rutas.value[key] = '');
        if (marker) map.removeLayer(marker);
        address.value = '';
        
        setTimeout(() => mostrarAlerta.value = false, 3000);
    })
    .catch(err => {
        mensaje.value = "Error al guardar la ruta";
        tipoAlerta.value = "danger";
        mostrarAlerta.value = true;
    });
};

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
    <!--MENSAJE CREACION RUTA-->
    <div class="container mt-5 p-5">
        <transition name="fade">
            <div v-if="mostrarAlerta" :class="['alert', 'alert-' + tipoAlerta, 'sticky-top', 'mt-3', 'shadow']" role="alert">
                {{ mensaje }}
            </div>
        </transition>

        <div class="card shadow p-4 mt-5">
            <h1 class="text-center mb-4 text-primary">Crear Nueva Ruta</h1>
            
            <form @submit.prevent="crear_ruta" class="row g-3">
                <div class="col-md-6">
                    <label class="form-label fw-bold">Título de la ruta</label>
                    <input type="text" class="form-control" v-model="rutas.titulo" placeholder="Ej: Jaén Renacentista" required>
                </div>

                <div class="col-md-6">
                    <label class="form-label fw-bold">Localidad</label>
                    <input type="text" class="form-control" v-model="rutas.localidad" placeholder="Ej: Úbeda" required>
                </div>

                <div class="col-12">
                    <label class="form-label fw-bold">Descripción</label>
                    <textarea class="form-control" v-model="rutas.descripcion" rows="3" required></textarea>
                </div>

                <div class="col-12">
                    <label class="form-label fw-bold text-success">Punto de Encuentro</label>
                    <div class="input-group mb-2">
                        <input type="text" v-model="address" class="form-control" 
                               placeholder="Busca una calle o plaza..." @keyup.enter="buscarDireccion">
                        <button class="btn btn-outline-secondary" type="button" @click="buscarDireccion"> Buscar</button>
                    </div>
                    <div id="map-container" style="height: 300px; border-radius: 8px;" class="mb-2 border shadow-sm"></div>
                    
                    <div class="row g-2">
                        <div class="col-md-6">
                            <input type="text" class="form-control form-control-sm bg-light" 
                                   v-model="rutas.latitud" placeholder="Latitud" readonly>
                        </div>
                        <div class="col-md-6">
                            <input type="text" class="form-control form-control-sm bg-light" 
                                   v-model="rutas.longitud" placeholder="Longitud" readonly>
                        </div>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label fw-bold">Enlace de la imagen</label>
                    <input v-model="rutas.foto" type="text" class="form-control rounded-pill shadow-sm" placeholder="/fotos/nombre-imagen.jpg">
                </div>


                <div class="col-md-6">
                    <label class="form-label fw-bold">Fecha</label>
                    <input type="date" class="form-control" v-model="rutas.fecha"required @change="buscarGuias">
                </div>

                <div class="col-md-6">
                    <label class="form-label fw-bold">Hora</label>
                    <input type="time" class="form-control" v-model="rutas.hora" required>
                </div>

                <div class="col-md-6">
                    <label class="form-label fw-bold">Seleccionar Guia</label>
                   
                        <select v-model="rutas.guia_id">
                            <option value="">Seleccionar Guia</option>
                            <option v-for="guia in guiasLibres" :key="guia.id" :value="guia.id">
                            {{ guia.nombre }}
                            </option>
                        </select>
                </div>
                <div class="col-12 mt-4">
                    <button type="submit" class="btn btn-primary btn-lg w-100 shadow">Publicar Ruta</button>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>

#map-container {
    z-index: 1;
}
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
    opacity: 0;
}
</style>