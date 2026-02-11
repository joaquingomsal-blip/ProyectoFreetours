<script setup>
import { ref, onMounted } from 'vue';
import { CToaster, CToast, CToastHeader, CToastBody } from '@coreui/vue';

const usuarios = ref([]);

const toasts = ref([]);

const addToast = (titulo, mensaje, color = 'primary') => {
    toasts.value.push({
        id: Date.now(), 
        title: titulo,
        content: mensaje,
        color: color
    });
};

const cargarUsuarios = () => {
    fetch('http://localhost/freetours/api.php/usuarios')
    .then(response => response.json())
    .then(data => {
        usuarios.value = data;
    })
    .catch(error => {
        addToast('Error', 'No se pudo conectar con el servidor', 'danger');
    });
};

const actualizarRol = (id, rol) => {
    fetch(`http://localhost/freetours/api.php/usuarios?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rol })
    })
    .then(response => response.json())
    .then(() => {
        addToast('Actualizado', `Usuario #${id} ahora es ${rol}`, 'success');
        cargarUsuarios();
    })
    .catch(() => addToast('Error', 'No se pudo actualizar el rol', 'danger'));
};

const borrarUsuario = (id) => {
    if(confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
        fetch(`http://localhost/freetours/api.php/usuarios?id=${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if(response.ok) {
                addToast('Eliminado', 'El usuario ha sido borrado', 'warning');
                cargarUsuarios();
            }
        })
        .catch(() => addToast('Error', 'Error al eliminar usuario', 'danger'));
    }
}

onMounted(() => {
    cargarUsuarios();
});
</script>

<template>
    <div class="container mt-4">
        <h1 class="mb-4">Administrar Usuarios</h1>
       
        <div class="table-responsive shadow-sm rounded">
            <table class="table table-hover table-striped align-middle mb-0">
                <thead class="table-dark">
                    <tr>
                        <th scope="col" class="ps-3">ID</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Email</th>
                        <th scope="col">Rol</th>
                        <th scope="col" class="text-center">Acciones</th> 
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="usuario in usuarios" :key="usuario.id">
                        <td class="ps-3 fw-bold">#{{ usuario.id }}</td>
                        <td>{{ usuario.nombre }}</td>
                        <td>{{ usuario.email }}</td>
                        <td>
                            <select 
                                v-model="usuario.rol" 
                                class="form-select form-select-sm" 
                                @change="actualizarRol(usuario.id, usuario.rol)"
                                style="max-width: 120px;"
                            >
                                <option value="admin">Admin</option>
                                <option value="cliente">Cliente</option>
                                <option value="guia">Guia</option>
                            </select>
                        </td>
                        <td class="text-center">
                            <button 
                                class="btn btn-outline-danger btn-sm" 
                                @click="borrarUsuario(usuario.id)"
                            >
                                <i class="cil-trash"></i> Eliminar
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <CToaster class="p-3" placement="top-end">
            <CToast v-for="toast in toasts" :key="toast.id" visible :color="toast.color">
                <CToastHeader closeButton>
                    <span class="me-auto fw-bold">{{ toast.title }}</span>
                </CToastHeader>
                <CToastBody>{{ toast.content }}</CToastBody>
            </CToast>
        </CToaster>
    </div>
</template>

