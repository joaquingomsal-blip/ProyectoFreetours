<script setup>
import { ref } from 'vue';

const nuevaRuta = ref({
    titulo: '',
    localidad: '',
    descripcion: '',
    fecha: '',
    hora: '',
    punto_encuentro: ''
});

const mensaje = ref('');
const mostrarAlerta = ref(false);

const guardarRuta = () => {
    fetch('http://localhost/freetours/api.php/rutas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaRuta.value)
    })
    .then(res => res.json())
    .then(data => {
        mensaje.value = "Ruta creada con éxito";
        mostrarAlerta.value = true;
        nuevaRuta.value = { titulo: '', localidad: '', descripcion: '', fecha: '', hora: '', punto_encuentro: '' };
        setTimeout(() => mostrarAlerta.value = false, 3000);
    })
    .catch(err => console.error("Error:", err));
};
</script>

