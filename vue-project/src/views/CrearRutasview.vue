<script setup>
import { ref, onMounted } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// 1. ESTADO DEL FORMULARIO [cite: 14, 22, 28]
const rutas = ref({
    titulo: '',
    localidad: '',
    descripcion: '',
    fecha: '',
    hora: '',
    latitud: '', 
    longitud: '', 
    guia_id: '',
    foto: '' // Puedes guardar aquí la URL de la foto general [cite: 18]
});

// 2. ESTADO DE LA UI
const guiasLibres = ref([]);
const address = ref('');
const mensaje = ref('');
const tipoAlerta = ref('success');
const mostrarAlerta = ref(false);

let map;
let marker;

// 3. FUNCIONES DE LÓGICA

// Buscar guías que no tengan rutas ese día
const buscarGuiasDisponibles = () => {
    if (!rutas.value.fecha) return;

    // Nota: La URL debe coincidir con tu API para filtrar por fecha y rol
    fetch(`http://localhost/freetours/api.php/usuarios?rol=guia&disponible_en=${rutas.value.fecha}`)
        .then(res => res.json())
        .then(data => {
            guiasLibres.value = data.filter(usuario => usuario.rol === 'guia');
            // Si el guía seleccionado ya no está disponible, reseteamos el campo
            if (!guiasLibres.value.find(g => g.id === rutas.value.guia_id)) {
                rutas.value.guia_id = '';
            }
        })
        .catch(err => console.error("Error al filtrar guías:", err));
};

// Buscador de direcciones (Geocoding) 
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

// Enviar el formulario a la API 
const crear_ruta = () => {
    fetch('http://localhost/freetours/api.php/rutas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rutas.value)
    })
    .then(res => res.json())
    .then(data => {
        mensaje.value = "✅ Ruta creada y guía asignado correctamente";
        tipoAlerta.value = "success";
        mostrarAlerta.value = true;
        
        // Limpiar formulario tras éxito
        Object.keys(rutas.value).forEach(key => rutas.value[key] = '');
        if (marker) map.removeLayer(marker);
        address.value = '';
        
        setTimeout(() => mostrarAlerta.value = false, 3000);
    })
    .catch(err => {
        mensaje.value = "❌ Error al guardar la ruta";
        tipoAlerta.value = "danger";
        mostrarAlerta.value = true;
    });
};

// 4. INICIALIZACIÓN DEL MAPA 
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
    <div class="container mt-5 p-5">
        <transition name="fade">
            <div v-if="mostrarAlerta" :class="['alert', 'alert-' + tipoAlerta, 'fixed-top', 'm-3', 'shadow']" role="alert">
                {{ mensaje }}
            </div>
        </transition>

        <div class="card shadow p-4">
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
                    <input type="url" class="form-control" v-model="rutas.imagen" placeholder="https://example.com/image.jpg" required>
                </div>

                <div class="col-md-6">
                    <label class="form-label fw-bold">Fecha</label>
                    <input type="date" class="form-control" v-model="rutas.fecha" @change="buscarGuiasDisponibles" required>
                </div>

                <div class="col-md-6">
                    <label class="form-label fw-bold">Hora</label>
                    <input type="time" class="form-control" v-model="rutas.hora" required>
                </div>

                <div class="col-12">
                    <label class="form-label fw-bold">Asignar Guía para este día</label>
                    <select class="form-select border-primary" v-model="rutas.guia_id" :disabled="!rutas.fecha" required>
                        <option value="" disabled>
                            {{ rutas.fecha ? '--- Seleccione un Guía disponible ---' : ' Selecciona primero la fecha' }}
                        </option>
                        <option v-for="guia in guiasLibres" :key="guia.id" :value="guia.id">
                             {{ guia.nombre }}
                        </option>
                    </select>
                </div>

                <div class="col-12 mt-4">
                    <button type="submit" class="btn btn-primary btn-lg w-100 shadow">🚀 Publicar Ruta</button>
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