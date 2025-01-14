import constantes from "../constantes/constantes.js";
import crudService from "./crudService.js";
import * as funciones from "./funciones.js";

let tableBody = document.getElementById('team-member-rows');
let modal = document.getElementById('modal');
let form = document.getElementById('member-form');
let itemsPerPageSelect = document.getElementById('items-per-page');

let data = []; // Inicializamos data como un array vacío
let itemsPerPage = 10;
let currentPage = 1;

// Obtenemos los datos de manera asincrónica
async function obtenerDatos() {
    const res = await fetch('api/Users');
    return await res.json();
}

// Renderizamos la tabla
function renderTable() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const datoToShowToShow = data.slice(startIndex, endIndex);

    tableBody.innerHTML = datoToShowToShow.map((dato, index) => `
        <tr>
            <td>${dato.usuario}</td>
            <td>${dato.nombre}</td>
            <td>${dato.estado}</td>
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
        <li><a href="#usuarios" class="${i + 1 === currentPage ? 'active' : ''}" onclick="changePage(${i + 1})">${i + 1}</a></li>
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
    // Cargar los datos en el formulario
    document.getElementById('usuario').value = dato.usuario;
    document.getElementById('nombre').value = dato.nombre;
    document.getElementById('estado').value = dato.estado;
    document.getElementById('nivel').value = 1;
    document.getElementById('password').value = "";
    modal.classList.remove('hidden');

    form.onsubmit = async (e) => {
        e.preventDefault();

        let password = document.getElementById('password').value;
        let passwordHash = await hashPassword(password);
        let userName = document.getElementById('usuario').value;

        const updatedData = {
            nombre: document.getElementById('nombre').value,
            password: passwordHash,
            estado: document.getElementById('estado').value,
            nivel: document.getElementById('nivel').value,
        }

        const apiUrl = `api/users/${userName}`;
        const method = constantes.UPDATE;
        const actualizaDato = await crudService.ejecutarOperacion(apiUrl, method, updatedData);

        if (actualizaDato) {
            Object.assign(dato, updatedData);
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
        const compania = "001";
        const usuario = document.getElementById('usuario').value;
        const nombre = document.getElementById('nombre').value;
        const password = document.getElementById('password').value;
        const estado = document.getElementById('estado').value;
        const nivel = document.getElementById('nivel').value;

        const passwordHash = await hashPassword(password);

        // Crear el objeto con los datos
        const sucursalData = {
            compania: compania,
            usuario: usuario,
            nombre: nombre,
            password: passwordHash,
            estado: estado,
            nivel: nivel
        };

        const apiUrl = '/api/users';
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
    funciones.filterTable(columnIndex);
}

// Función para hacer el hash SHA-256
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
}

// Inicializar tabla
await init();

window.editMember = editMember;
window.deleteMember = deleteMember;
window.changePage = changePage;
window.closePage = closePage;
window.filterTable = filterTable;
