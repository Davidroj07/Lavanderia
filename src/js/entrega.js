import constantes from "../constantes/constantes.js";
import crudService from "./crudService.js";
import * as funciones from './funciones.js';
import * as redireccionar from './redireccionar.js';

let tableBody = document.getElementById('team-member-rows');
let itemsPerPageSelect = document.getElementById('items-per-page');

let data = []; // Inicializamos data como un array vacío
let allTableData = [];
let itemsPerPage = 10;
let currentPage = 1;

// Obtenemos los datos de manera asincrónica
async function obtenerDatos() {
    let ano = funciones.obtenerAnoActual();
    const res = await fetch(`api/entregas/${ano}`);
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
            <td>${dato.numero}</td>
            <td>${dato.requisicion}</td>
            <td>${dato.nombre}</td>
            <td>${funciones.formatearFecha(dato.fecha_entrega)}</td>
            <td>${dato.total_peso}</td>
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
        <li><a href="#requisicion" class="${i + 1 === currentPage ? 'active' : ''}" onclick="changePage(${i + 1})">${i + 1}</a></li>
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
    const ano = 2025;
    const numero = dato.numero;

    if (confirm(`¿Estás seguro de que deseas borrar la requisición ${numero}?`)) {

        const apiUrl = `/api/entregas/${ano}/${numero}`;
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
    const ano = 2025;
    const numero = dato.numero;

    localStorage.setItem('ano', ano);
    localStorage.setItem('numero', numero);
    localStorage.setItem('accion', "Editar");
    redireccionar.cargarContenido('/entregaD', 'entregaForm', () => {
    });

}

// Evento para redirigir al formulario "Nuevo Registro"
document.getElementById('new-record-btn').onclick = () => {
    const ano = 2025;

    // Guardar datos en localStorage si es necesario
    localStorage.setItem('ano', ano);
    localStorage.setItem('accion', "Nuevo");

    // Llama a la función para cargar contenido dinámico
    redireccionar.cargarContenido('/entregaD', 'entregaForm', () => {
    });
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
    data = funciones.filterTable("tablaEntregas", columnIndex, allTableData);
    renderTable();
}

// Inicializar tabla
init();

window.editMember = editMember;
window.deleteMember = deleteMember;
window.changePage = changePage;
window.closePage = closePage;
window.filterTable = filterTable;
