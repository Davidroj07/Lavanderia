import * as mensaje from "./mensajesUtil.js";
import constantes from "../constantes/constantes.js";
import crudService from "./crudService.js";
import {obtenerMaximo} from "./funciones.js";
import * as funciones from "./funciones.js";

let tableBody = document.getElementById('team-member-rows');
let modal = document.getElementById('modal');
let form = document.getElementById('member-form');
let itemsPerPageSelect = document.getElementById('items-per-page');

let data = []; // Inicializamos data como un array vacío
let allTableData = [];
let itemsPerPage = 10;
let currentPage = 1;

// Obtenemos los datos de manera asincrónica
async function obtenerDatos() {
    const res = await fetch('api/catalogos');
    data = await res.json();
    allTableData = data
    return data;
}

// Renderizamos la tabla
function renderTable() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const datoToShowToShow = data.slice(startIndex, endIndex);

    tableBody.innerHTML = datoToShowToShow.map((dato, index) => `
        <tr>
            <td>${dato.id}</td>
            <td>${dato.producto}</td>
            <td>${dato.descripcion}</td>
            <td>
                <button onclick="editMember(${startIndex + index})"><img src="/icons/edit.svg" alt="Editar" class="icon"></button>
                <button onclick="deleteMember(${startIndex + index})"><img src="/icons/delete.svg" alt="Eliminar" class="icon"></button>
            </td>
        </tr>
    `).join('');
    const rowCountElement = document.querySelector('.table-row-count');
    if (rowCountElement) {
        rowCountElement.textContent = `(${data.length})`;
    }

    renderPagination();
}

// Función para manejar la paginación
function renderPagination() {
    const pagination = document.querySelector('.pagination');
    const totalPages = Math.ceil(data.length / itemsPerPage);

    pagination.innerHTML = Array.from({ length: totalPages }, (_, i) => `
        <li><a href="#catalogo" class="${i + 1 === currentPage ? 'active' : ''}" onclick="changePage(${i + 1})">${i + 1}</a></li>
    `).join('');

}


// Cambiar página
async function changePage(page) {
    currentPage = page;
    data = await obtenerDatos();
    renderTable();
}

// Eliminar miembro
async function deleteMember(index) {
    const dato = data[index]; // Obtener el miembro que se va a eliminar
    const datoId = dato.id;

    if (confirm(`¿Estás seguro de que deseas borrar con ID ${datoId}?`)) {

        const apiUrl = `/api/catalogos/${dato.id}`;
        const method = constantes.DELETE;
        const eliminaDato = await crudService.ejecutarOperacion(apiUrl, method,'');

        if (eliminaDato) {
            data.splice(index, 1);
            renderTable(); // Actualizar la tabla
        }


    }
}

// Editar miembro
function editMember(index) {
    const dato = data[index]; // Obtener el miembro a editar
    const originalData = { ...dato }; // Crear una copia del estado original

    // Cargar los datos en el formulario
    document.getElementById('code').value = dato.id;
    document.getElementById('producto').value = dato.producto;
    document.getElementById('descripcion').value = dato.descripcion;
    modal.classList.remove('hidden');

    form.onsubmit = async (e) => {
        e.preventDefault();

        // Crear un objeto con los datos actualizados
        const updatedData = {
            id: document.getElementById('code').value,
            producto: document.getElementById('producto').value,
            descripcion: document.getElementById('descripcion').value,
        };

        // Detectar cambios entre los datos originales y los actualizados
        const changes = {};
        for (const key in updatedData) {
            if (updatedData[key] !== originalData[key]) {
                changes[key] = updatedData[key];
            }
        }

        // Si no hay cambios, no realizar ninguna acción
        if (Object.keys(changes).length === 0) {
            mensaje.registroConAlerta(constantes.REGISTROCONALERTA)
            modal.classList.add('hidden');
            return;
        }

        const apiUrl = `/api/catalogos/${dato.id}`;
        const method = constantes.UPDATE;
        const actualizaDato = await crudService.ejecutarOperacion(apiUrl, method, changes);

        if (actualizaDato) {
            Object.assign(dato, changes);
            renderTable(); // Actualizar la tabla
            modal.classList.add('hidden');
        }


    };
}

// Función para agregar
document.getElementById('new-record-btn').onclick = () => {
    form.reset();
    modal.classList.remove('hidden');
    form.onsubmit = async (e) => {
        e.preventDefault();

        // Obtener los valores del formulario
        const id = await obtenerMaximo("catalogo");
        const producto = document.getElementById('producto').value;
        const descripcion = document.getElementById('descripcion').value;

        // Crear el objeto con los datos
        const sucursalData = {
            id: id,
            producto: producto,
            descripcion: descripcion
        };

        const apiUrl = '/api/catalogos';
        const method = constantes.INSERT;
        const nuevoDato = await crudService.ejecutarOperacion(apiUrl, method, sucursalData);

        if (nuevoDato) {
            modal.classList.add('hidden');
            data = await obtenerDatos(); // Refrescar los datos
            renderTable(); // Actualizar la tabla
        }
    };
};


// Cancelar edición
document.getElementById('cancel-btn').onclick = () => {
    modal.classList.add('hidden');
};

// Cambiar la cantidad de elementos por página
itemsPerPageSelect.onchange = (e) => {
    itemsPerPage = parseInt(e.target.value, 10);
    currentPage = 1;
    renderTable();
};

// Inicializamos la carga de datos
async function init() {
    data = await obtenerDatos();
    renderTable();
}

function closePage() {
    window.location.href = '/menu';
}

function filterTable(columnIndex) {
    data = funciones.filterTable("tablaCatalogo", columnIndex, allTableData);
    renderTable();
}

// Inicializar tabla
await init();

window.editMember = editMember;
window.deleteMember = deleteMember;
window.changePage = changePage;
window.closePage = closePage;
window.filterTable = filterTable;
