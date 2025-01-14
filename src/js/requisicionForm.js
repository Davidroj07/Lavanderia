import constantes from "../constantes/constantes.js";
import crudService from "./crudService.js";
import * as funciones from './funciones.js';
import * as mensajes from './mensajesUtil.js';
import * as generarReportes from './generarReportes.js';
import * as transactionUtils from './transactionUtils.js';

//variables globales
let ano;
let accion;
let numero;
let usuario;


    //const agregarDetalleBtn = document.getElementById("agregarDetalleBtn");
    const guardarDetalleBtn = document.getElementById("guardarDetalleBtn");
    const modalDetalle = document.getElementById("modalDetalle");
    const formRequisicion = document.getElementById("formRequisicion");
    const formVolver = document.getElementById("formVolver");
    let form = document.getElementById('member-form');
    const detallesTabla = document.querySelector("#detallesTabla tbody");
    ano = localStorage.getItem('ano');
    accion = localStorage.getItem('accion');

    await cargarListaClientes();

    if (accion === constantes.EDITAR) {
        numero = localStorage.getItem('numero');
        await cargarRegistro(numero);
    } else {
        document.querySelector("#fecha_recibido").value = funciones.formatearFechaAno(new Date());
        document.querySelector("#total_peso").value = 0;
        document.querySelector("#valor_total").value = 0;
    }

    formRequisicion.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (accion === constantes.NUEVO) {
            await insertarAntes(e);
        } else {
            await actualizarAntes(e);
        }

    });

    formVolver.addEventListener("click",  (e) => {
        e.preventDefault();
        location.reload();
    });

// Abrir el modal al hacer clic en "Agregar Detalle"
    document.getElementById('agregarDetalleBtn').onclick = async () => {
        numero = document.getElementById("numero").value;
        if (numero === "") {
            mensajes.registroConAlerta(constantes.GUARDAR_ANTES);
            return;
        }
        form.reset();
        await cargarListaProductos();
        modalDetalle.classList.remove('hidden');

    }

    // Guardar detalle
    guardarDetalleBtn.addEventListener("click", async () => {

        let consecutivo = await funciones.obtenerMaximoConsecutivo("requisicion_detalles", ano, numero);
        const detalle = {
            ano: ano,
            numero: numero,
            consecutivo: consecutivo, // document.getElementById("consecutivo").value,
            id_producto: document.getElementById("idProducto").value,
            cantidad_recibida: document.getElementById("cantidadRecibida").value,
            saldo: document.getElementById("cantidadRecibida").value,
            peso: document.getElementById("peso").value,
            reproceso: 0, //document.getElementById("reproceso").value === "true",
            observacion: document.getElementById("observacion").value
        };

        const apiUrl = '/api/requisicionDet';
        const method = constantes.INSERT;
        const nuevoDato = await crudService.ejecutarOperacion(apiUrl, method, detalle);

        if (nuevoDato) {
            modalDetalle.classList.add('hidden');
            const params = { ano: ano, numero: numero };
            const url = "/api/actualizarPesoRequisicion";
            await transactionUtils.postTransaction(url, params);
            await cargarRegistro(numero);
        }

    });

    document.getElementById('cancelModal').onclick = () => {
        modalDetalle.classList.add('hidden');
    };

    document.getElementById('closeModal').onclick = () => {
        modalDetalle.classList.add('hidden');
    };

    async function cargarRegistro(numero) {
        let ano = funciones.obtenerAnoActual();
        const res = await fetch(`api/requisiciones/${ano}/${numero}`);
        let data = await res.json();
        let fecha_recibido = data[0].fecha_recibido.split('T')[0];

        // Rellenar los campos con la requisición seleccionada
        document.querySelector("#numero").value = data[0].numero;
        document.querySelector("#cliente_id").value = data[0].cliente_id; // Asigna el cliente seleccionado
        //$("#cliente_id").val(data[0].cliente_id).trigger('change'); // Asegura que Select2 lo refleje
        document.querySelector("#fecha_recibido").value = fecha_recibido;
        document.querySelector("#descripcion").value = data[0].descripcion;
        document.querySelector("#total_peso").value = data[0].total_peso;
        document.querySelector("#valor_total").value = data[0].valor_total;

        await cargarDetalle(numero);
    }

    async function cargarDetalle(numero) {
        let ano = funciones.obtenerAnoActual();
        const res = await fetch(`api/requisicionDet/${ano}/${numero}`);
        let data = await res.json();

        const detallesTabla = document.querySelector("#detallesTabla tbody");
        detallesTabla.innerHTML = ""; // Limpiar tabla

        data.forEach((dato) => {
            const fila = document.createElement("tr");

            // Validar reproceso (si es null o undefined, asignar 'false')
            let reproceso = dato.reproceso === null || dato.reproceso === undefined ? "false" : dato.reproceso === 0 ? "false" : "true";

            // Validar observacion (si es null o undefined, asignar un string vacío)
            let observacion = dato.observacion === null || dato.observacion === undefined ? "" : dato.observacion;

            // Validar los campos numéricos para evitar valores inválidos
            let cantidadRecibida = dato.cantidad_recibida || 0;
            let peso = dato.peso || 0; // Y para este

            fila.innerHTML = `
                <td><input type="text" class="form-control" value="${dato.consecutivo}" disabled></td>
                <td><input type="text" class="form-control" value="${dato.id_producto}" disabled></td>
                <td><input type="text" class="form-control" value="${dato.producto}" disabled></td>
                <td><input type="number" class="form-control" value="${cantidadRecibida}" disabled></td>
                <td><input type="number" class="form-control" value="${peso}" disabled></td>
                <td>
                    <select class="form-select" disabled>
                        <option value="false" ${reproceso === "false" ? "selected" : ""}>No</option>
                        <option value="true" ${reproceso === "true" ? "selected" : ""}>Sí</option>
                    </select>
                </td>
                <td><input type="text" class="form-control" value="${observacion}" disabled></td>
                <td class="acciones">
                    <button type="button" class="btn btn-success btn-sm ActivarEdicion">
                        <i class="fas fa-pencil-alt"></i> <!-- Ícono de lápiz para editar -->
                    </button>
                    <button type="button" class="btn btn-primary btn-sm EditarDetalle" style="display: none;">
                        <i class="fas fa-check"></i> <!-- Ícono de check para guardar -->
                    </button>
                    <button type="button" class="btn btn-warning btn-sm CancelarEdicion" style="display: none;">
                        <i class="fas fa-times"></i> <!-- Ícono de X para cancelar -->
                    </button>
                    <button type="button" class="btn btn-danger btn-sm eliminarDetalle">
                        <i class="fas fa-trash"></i> <!-- Ícono de basura para eliminar -->
                    </button>
                </td>
            `;
            detallesTabla.appendChild(fila);
        });

    }

    async function insertarAntes(e) {
        const formData = new FormData(e.target);
        numero = await funciones.obtenerMaximoNumero("requisiciones", ano);
        usuario = sessionStorage.getItem("usuario");

        formData.set("numero", numero);
        formData.append("ano", ano);
        formData.append("usuario", usuario);

        const apiUrl = '/api/requisiciones';
        const method = constantes.INSERT;
        const formDataObj = Object.fromEntries(formData.entries());
        const nuevoDato = await crudService.ejecutarOperacion(apiUrl, method, formDataObj);

        if (nuevoDato) {
            insertarDespues();
            accion = "Editar";

        }
    }

    function insertarDespues() {
        document.getElementById("numero").value = numero;
    }

    async function actualizarAntes(e) {
        const formData = new FormData(e.target);
        const formDataObj = Object.fromEntries(formData.entries());
        numero = formDataObj.numero;
        delete formDataObj.numero;

        const apiUrl = `/api/requisiciones/${ano}/${numero}`;
        const method = constantes.UPDATE;
        const nuevoDato = await crudService.ejecutarOperacion(apiUrl, method, formDataObj);

        if (nuevoDato) {
            ActualizarDespues();
        }

    }

    function ActualizarDespues() {

    }

    async function eliminarAntesDetalle(fila) {
        const consecutivo = fila.querySelector("td:first-child input").value;
        if (confirm(`¿Estás seguro de que deseas borrar el ${consecutivo}?`)) {
            const apiUrl = `/api/requisicionDet/${ano}/${numero}/${consecutivo}`;
            const method = constantes.DELETE;
            const eliminaDato = await crudService.ejecutarOperacion(apiUrl, method, '');
            if (eliminaDato) {
                const params = { ano: ano, numero: numero };
                const url = "/api/actualizarPesoRequisicion";
                await transactionUtils.postTransaction(url, params);
                await cargarRegistro(numero);
            }
        }
    }

    async function editarDetalle(fila) {
        const valores = {};

        // Recorrer todas las celdas de la fila
        fila.querySelectorAll("td").forEach((celda, index) => {
            const input = celda.querySelector("input, select");
            if (input) {
                valores[`dato${index}`] = input.value;
            }
        });

        const res = await fetch(`api/generales/entragasxrequisicion?ano=${ano}&numero=${numero}&consecutivo=${valores.dato0}`);
        let entregas = await res.json();

        if(entregas.length > 0){
            mensajes.registroConAlerta("La requisicion ya tiene entregas asociadas, no se puede editar");
            return;
        }

        const data = {
            id_producto: valores.dato1,
            cantidad_recibida: valores.dato3,
            saldo: valores.dato3,
            peso: valores.dato4,
            reproceso: valores.dato5 === "false" ? 0 : -1,
            observacion: valores.dato6
        };

        const apiUrl = `/api/requisicionDet/${ano}/${numero}/${valores.dato0}`;
        const method = constantes.UPDATE;
        const nuevoDato = await crudService.ejecutarOperacion(apiUrl, method, data);

        if (nuevoDato) {
            const params = { ano: ano, numero: numero };
            const url = "/api/actualizarPesoRequisicion";
            await transactionUtils.postTransaction(url, params);
            await cargarRegistro(numero);
        }

        fila.querySelectorAll("input, select").forEach((campo) => {
            campo.setAttribute("readonly", "readonly");
            campo.setAttribute("disabled", "disabled");
        });
        fila.querySelector(".EditarDetalle").style.display = "none";
        fila.querySelector(".CancelarEdicion").style.display = "none";
        fila.querySelector(".ActivarEdicion").style.display = "inline-block";
        fila.querySelector(".eliminarDetalle").style.display = "inline-block";
    }

    function cargarListaClientes() {
        fetch(`api/sucursales`)
            .then((res) => res.json())
            .then((datos) => {
                const clienteSelect = document.querySelector("#cliente_id");
                datos.forEach((dato) => {
                    const option = document.createElement("option");
                    option.value = dato.id;
                    option.textContent = dato.nombre;
                    clienteSelect.appendChild(option);
                });

            });
    }

    function cargarListaProductos() {
        fetch(`api/catalogos`)  // Suponiendo que la URL de tu API es /api/productos
            .then((res) => res.json())
            .then((productos) => {
                const productoSelect = document.querySelector("#idProducto");

                // Limpiar las opciones existentes antes de cargar nuevas
                productoSelect.innerHTML = '<option value="">Seleccione un producto</option>';

                // Agregar opciones dinámicamente
                productos.forEach((producto) => {
                    const option = document.createElement("option");
                    option.value = producto.id;  // El ID del producto se usa como valor
                    option.textContent = producto.producto;  // El nombre del producto se muestra
                    productoSelect.appendChild(option);
                });


            })
    }

    document.getElementById("generarPdfBtn").addEventListener("click", async () => {
        // Datos que se van a enviar al servidor (puedes capturarlos desde un formulario o usarlos estáticos)
        let reporte = "0001Requisicion";
        let reemplazar = [ano, numero]
        let consulta = await generarReportes.obtenerConsulta(reporte);
        let query = generarReportes.reemplazarParametros(consulta[0].consulta, consulta[0].parametros, reemplazar);
        let datos = await generarReportes.obtenerDatos(query);
        let result = generarReportes.prepararDatos(reporte, datos);
        generarReportes.generarPdf(reporte, result);
    });

    detallesTabla.addEventListener("click", async (e) => {
        const fila = e.target.closest("tr");
        if (e.target.closest(".ActivarEdicion")) {
            const columnasABloquear = [1, 2, 3];
            funciones.habilitarEdicion(fila, columnasABloquear);
        } else if (e.target.closest(".CancelarEdicion")) {
            funciones.cancelarEdicion(fila);
        } else if (e.target.closest(".EditarDetalle")) {
            await editarDetalle(fila)
        } else if (e.target.closest(".eliminarDetalle")) {
            await eliminarAntesDetalle(fila);
        }
    });

