<script setup>
//PAGINA DASHBOARD VISTA DE UN TEMPLATE
import { ref, onMounted } from 'vue';
import Chart from 'chart.js/auto';

const stats = ref({
    totalClientes: 124,
    totalRutas: 15,
    totalReservas: 450,
    totalGuias: 8
});


const graficoCanvas = ref(null);

const inicializarGrafico = () => {
    const ctx = graficoCanvas.value.getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
            datasets: [{
                label: 'Nuevos Registros',
                data: [12, 19, 15, 25, 22, 30, 45], // Datos de ejemplo
                borderColor: '#FFB347',
                backgroundColor: 'rgba(255, 179, 71, 0.2)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#E69500'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true, grid: { display: false } },
                x: { grid: { display: false } }
            }
        }
    });
};

onMounted(() => {
    inicializarGrafico();
});
</script>

<template>
    <div class="admin-container min-vh-100 py-5">
        <div class="container mt-5">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2 class="fw-bold m-0" style="color: #2D241E;">Dashboard Administrativo</h2>
                <span class="text-muted small">Datos actualizados al momento</span>
            </div>
            
            <div class="row g-3 mb-4">
                <div class="col-md-3" v-for="(val, label) in { 'Usuarios': stats.totalClientes, 'Rutas': stats.totalRutas, 'Reservas': stats.totalReservas, 'Guías': stats.totalGuias }" :key="label">
                    <div class="card border-0 shadow-sm p-3 text-center stat-card">
                        <div class="fs-2 fw-bold" style="color: #E69500;">{{ val }}</div>
                        <div class="text-muted small text-uppercase">{{ label }}</div>
                    </div>
                </div>
            </div>

            <div class="row g-4">
                <div class="col-lg-8">
                    <div class="card border-0 shadow-sm p-4 h-100">
                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <h5 class="fw-bold m-0">Tendencia de Registros</h5>
                            <select class="form-select form-select-sm w-auto border-0 bg-light">
                                <option>Última semana</option>
                                <option>Último mes</option>
                            </select>
                        </div>
                        <div style="height: 300px;">
                            <canvas ref="graficoCanvas"></canvas>
                        </div>
                    </div>
                </div>

                <div class="col-lg-4">
                    <div class="card border-0 shadow-sm p-4 bg-dark-gold text-white mb-4">
                        <h5 class="fw-bold mb-3">Gestión Rápida</h5>
                        <div class="d-grid gap-2">
                            <RouterLink to="/rutas" class="btn btn-gold btn-sm py-2">Crear Nueva Ruta</RouterLink>
                            <RouterLink to="/usuarios" class="btn btn-outline-light btn-sm py-2"> Ver Usuarios</RouterLink>
                        </div>
                    </div>
                    
                    <div class="card border-0 shadow-sm p-4 h-100">
                        <h5 class="fw-bold mb-3 small text-uppercase text-muted">Aviso de Sistema</h5>
                        <div class="alert alert-warning border-0 small mb-0">
                            <strong>Rutas con bajo cupo:</strong> Hay 3 rutas con menos de 10 inscritos que requieren revisión.
                        </div>
                    </div>
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

.stat-card {
    border-radius: 15px;
    border-bottom: 4px solid #FFB347 !important;
}

.bg-dark-gold {
    background-color: #2D241E;
    border-radius: 20px;
}

.btn-gold {
    background-color: #FFB347;
    color: #2D241E;
    font-weight: bold;
    border: none;
}

.btn-gold:hover {
    background-color: #E69500;
}

canvas {
    width: 100% !important;
}
</style>