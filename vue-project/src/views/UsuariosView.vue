<script setup>
import { ref, onMounted } from 'vue';
import { CToaster, CToast, CToastHeader, CToastBody } from '@coreui/vue';
import * as Bootstrap from 'bootstrap';

const usuarios = ref([]);
const toasts = ref([]);

// Variables para el modal
const usuarioAEditar = ref(null);
const nuevoRolPendiente = ref('');
const usuarioABorrar = ref(null);

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

// --- CAMBIO DE ROL ---
const prepararCambioRol = (usuario, event) => {
    // Guardamos los datos temporalmente
    usuarioAEditar.value = usuario;
    nuevoRolPendiente.value = event.target.value;

    // Revertimos visualmente el select para que no cambie hasta confirmar
    event.target.value = usuario.rol;

    // Abrimos el modal
    const modalElement = document.getElementById('rolModal');
    const modal = new Bootstrap.Modal(modalElement);
    modal.show();
}

const confirmarCambio = () => {
    if (usuarioAEditar.value) {
        actualizarRol(usuarioAEditar.value.id, nuevoRolPendiente.value);
        
        // Cerramos el modal usando la instancia existente
        const modalElement = document.getElementById('rolModal');
        const modalInstance = Bootstrap.Modal.getInstance(modalElement);
        modalInstance.hide();
    }
}

const actualizarRol = (id, rol,) => {
    fetch(`http://localhost/freetours/api.php/usuarios?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rol })
    })
    .then(response => response.json())
    .then(() => {
        addToast('Actualizado', `El rol se ha actualizado correctamente`, 'success');
        cargarUsuarios();
    })
    .catch(() => addToast('Error', 'No se pudo actualizar el rol', 'danger'));
};

// --- ELIMINAR USUARIO ---
const prepararEliminacion = (usuario) => {
    // Guardamos los datos temporalmente
    usuarioABorrar.value = usuario;
    // Abrimos el modal
    const modalElement = document.getElementById('eliminarModal');
    const modal = new Bootstrap.Modal(modalElement);
    modal.show();
}

const confirmarEliminacion = () => {
    // Cerramos el modal usando la instancia existente
    if(usuarioABorrar.value) {
        borrarUsuario(usuarioABorrar.value.id);
        const modalElement = document.getElementById('eliminarModal');
        const modalInstance = Bootstrap.Modal.getInstance(modalElement);
        modalInstance.hide();
    }
}
const borrarUsuario = (id) => {
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

onMounted(() => {
    cargarUsuarios();
});
</script>

<template>
    <div class="container-fluid mt-5 py-5">
        
        <div class="row justify-content-center">
            <div class="col-12 col-md-11 col-lg-10">
                
                <h1 class="mb-4 text-dark fw-bold text-center text-md-start">Administrar Usuarios</h1>
                
                <div class="table-responsive shadow-lg rounded-3 border-0">
                    <table class="table table-hover table-striped align-middle mb-0 w-100">
                        <thead class="table-dark">
                            <tr>
                                <th scope="col" class="py-3 ps-4" style="width: 80px">ID</th>
                                <th scope="col" class="py-3">Nombre</th>
                                <th scope="col" class="py-3">Email</th>
                                <th scope="col" class="py-3" style="width: 150px">Rol</th>
                                <th scope="col" class="py-3 text-center" style="width: 150px">Acciones</th> 
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="usuario in usuarios" :key="usuario.id">
                                <td class="ps-4 fw-bold">#{{ usuario.id }}</td>
                                <td class="fw-semibold">{{ usuario.nombre }}</td>
                                <td>{{ usuario.email }}</td>
                                <td>
                                    <select :value="usuario.rol" class="form-select form-select-sm shadow-sm" @change="prepararCambioRol(usuario, $event)" style="max-width: 130px;">
                                        <option value="admin">Admin</option>
                                        <option value="cliente">Cliente</option>
                                        <option value="guia">Guia</option>
                                    </select>
                                </td>
                                <td class="text-center">
                                    <button class="btn btn-outline-danger btn-sm px-3 fw-bold"  @click="prepararEliminacion(usuario)">
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <!-------------- MODAL CAMBIAR ROL ------------>
        <div class="modal fade" id="rolModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content text-dark"> 
                    <div class="modal-header bg-warning">
                        <h5 class="modal-title fw-bold text-dark">Confirmar cambio de permisos</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body text-center py-4 text-dark">
                        <p v-if="usuarioAEditar">
                            ¿Estás seguro de que quieres cambiar el rol de <strong>{{ usuarioAEditar.nombre }}</strong>?
                            <br><br>
                            De <span class="badge bg-secondary text-uppercase">{{ usuarioAEditar.rol }}</span> 
                            a <span class="badge bg-primary text-uppercase">{{ nuevoRolPendiente }}</span>
                        </p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-warning fw-bold" @click="confirmarCambio">Sí, actualizar</button>
                    </div>
                </div>
            </div>
        </div>
        <!-------------- MODAL ELIMINAR USUARIO ------------>
        <div class="modal fade" id="eliminarModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content text-dark"> 
                    <div class="modal-header bg-danger text-white">
                        <h5 class="modal-title fw-bold">Confirmar eliminación</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body text-center py-4 text-dark">
                        <p v-if="usuarioABorrar">
                            ¿Estás seguro de que deseas eliminar el usuario <strong>{{ usuarioABorrar.nombre }}</strong>?
                            <br>
                            <small class="text-danger">Esta acción no se puede deshacer.</small>
                        </p>
                    </div>
                    <div class="modal-footer border-0">
                        <button type="button" class="btn btn-light border" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-danger fw-bold" @click="confirmarEliminacion">Sí, eliminar</button>
                    </div>
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
