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
    await cargarListaRequisicion();

    if (accion === constantes.EDITAR) {
        numero = localStorage.getItem('numero');
        await cargarRegistro(numero);
    } else {
        document.querySelector("#fecha_entrega").value = funciones.formatearFechaAno(new Date());
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

        const selectProducto = document.getElementById("idProducto").value;
        if (!selectProducto) {
            alert("Debe seleccionar un producto del listado.");
            return;
        }

        const productoSeleccionado = JSON.parse(selectProducto);

        if (!productoSeleccionado.id_producto) {
            alert("Error al obtener la información del producto seleccionado.");
            return;
        }

        let consecutivo = await funciones.obtenerMaximoConsecutivo("entregas_detalle", ano, numero);
        const cantidadEntregada = parseInt(document.getElementById("cantidadEntregada").value);
        const pesoEntregado = parseFloat(document.getElementById("pesoEntregado").value);
        const observacion = document.getElementById("observacion").value;
        const usuario = sessionStorage.getItem("usuario");

        if (cantidadEntregada > parseInt(productoSeleccionado.saldo)) {
            mensajes.registroConAlerta("La cantidad a entregar no puede ser mayor al saldo");
            return;
        }

        const detalle = {
            ano: ano,
            numero: numero,
            consecutivo: consecutivo,
            id_producto: productoSeleccionado.id_producto,
            saldo_req: productoSeleccionado.saldo,
            peso_req: productoSeleccionado.peso,
            cant_entregada: cantidadEntregada,
            peso_entregado: pesoEntregado,
            observacion: observacion,
            usuario_c: usuario,
            consecutivo_afect: productoSeleccionado.consecutivo,
        };

        const apiUrl = '/api/entregaDet';
        const method = constantes.INSERT;
        const nuevoDato = await crudService.ejecutarOperacion(apiUrl, method, detalle);

        if (nuevoDato) {
            modalDetalle.classList.add('hidden');
            const params = {
                ano: ano,
                numero: numero,
                consecutivo: consecutivo,
                requisicion: document.getElementById("requisicion").value,
                cant_entrega: cantidadEntregada,
                peso_entrega: pesoEntregado,
                observacion: observacion,
                usuario: usuario
            };

            const url = "/api/actualizarentrega";
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
        const res = await fetch(`api/entregas/${ano}/${numero}`);
        let data = await res.json();
        let fecha_entrega = data[0].fecha_entrega.split('T')[0];

        // Rellenar los campos con la entrega seleccionada
        document.querySelector("#numero").value = data[0].numero;
        document.querySelector("#requisicion").value = data[0].requisicion;
        document.querySelector("#fecha_entrega").value = fecha_entrega;
        document.querySelector("#cliente_id").value = data[0].cliente_id;
        document.querySelector("#total_peso").value = data[0].total_peso;
        document.querySelector("#valor_total").value = data[0].total_valor;
        document.querySelector("#descripcion").value = data[0].descripcion;
        document.getElementById("requisicion").setAttribute("disabled", "disabled");

        await cargarDetalle(numero);
    }

    async function cargarDetalle(numero) {
        let ano = funciones.obtenerAnoActual();
        const res = await fetch(`api/entregaDet/${ano}/${numero}`);
        let data = await res.json();

        const detallesTabla = document.querySelector("#detallesTabla tbody");
        detallesTabla.innerHTML = ""; // Limpiar tabla

        data.forEach((dato) => {
            const fila = document.createElement("tr");

            let observacion = dato.observacion === null || dato.observacion === undefined ? "" : dato.observacion;

            // Validar los campos numéricos para evitar valores inválidos
            let saldo_req = dato.saldo_req || 0;
            let peso_req = dato.peso_req || 0;
            let cant_entregada = dato.cant_entregada || 0;
            let peso_entregado = dato.peso_entregado || 0;

            fila.innerHTML = `
                <td><input type="text" class="form-control" value="${dato.consecutivo}" disabled></td>
                <td><input type="text" class="form-control" value="${dato.id_producto}" disabled></td>
                <td><input type="text" class="form-control" value="${dato.producto}" disabled></td>
                <td><input type="number" class="form-control" value="${saldo_req}" disabled></td>
                <td><input type="number" class="form-control" value="${peso_req}" disabled></td>
                <td><input type="number" class="form-control" value="${cant_entregada}" disabled></td>
                <td><input type="number" class="form-control" value="${peso_entregado}" disabled></td>
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
        numero = await funciones.obtenerMaximoNumero("entregas", ano);
        usuario = sessionStorage.getItem("usuario");

        const params = { ano: ano,
            numero: numero,
            requisicion: formData.get("requisicion"),
            fecha: formData.get("fecha_entrega"),
            usuario: usuario,
            descripcion: formData.get("descripcion"),
        };

        const url = "/api/generarentrega";
        await transactionUtils.postTransaction(url, params);
        await cargarRegistro(numero);
        accion = "Editar";

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
        const valores = {};
        fila.querySelectorAll("td").forEach((celda, index) => {
            const input = celda.querySelector("input, select");
            if (input) {
                valores[`dato${index}`] = input.value;
            }
        });

        const cant_entrega = parseInt(valores.dato5);
        const peso_entrega = parseInt(valores.dato6);

        if (cant_entrega !== 0 || peso_entrega !== 0) {
            mensajes.registroConAlerta("No se puede eliminar, los datos de cantidad entregada y peso entregado no pueden ser mayores a 0");
            return;}

        if (confirm(`¿Estás seguro de que deseas borrar el ${consecutivo}?`)) {
            const apiUrl = `/api/entregaDet/${ano}/${numero}/${consecutivo}`;
            const method = constantes.DELETE;
            const eliminaDato = await crudService.ejecutarOperacion(apiUrl, method, '');
            if (eliminaDato) {
                await cargarRegistro(numero);
            }
        }
    }

    async function editarDetalle(fila) {
        const valores = {};
        const usuario = sessionStorage.getItem("usuario");

        // Recorrer todas las celdas de la fila
        fila.querySelectorAll("td").forEach((celda, index) => {
            const input = celda.querySelector("input, select");
            if (input) {
                valores[`dato${index}`] = input.value;
            }
        });

        const params = {
            ano: ano,
            numero: numero,
            consecutivo: valores.dato0,
            requisicion: document.getElementById("requisicion").value,
            cant_entrega: valores.dato5,
            peso_entrega: valores.dato6,
            observacion: valores.dato7,
            usuario: usuario
        };

        const cant_entrega = parseInt(params.cant_entrega);
        const saldo_req = parseInt(valores.dato3);

        if (cant_entrega > saldo_req) {
            mensajes.registroConAlerta("La cantidad a entregar no puede ser mayor al saldo");
            return;
        }

        const url = "/api/actualizarentrega";
        const actualiza = await transactionUtils.postTransaction(url, params);
        if (!actualiza) {
            return;
        }
        await cargarRegistro(numero);

        fila.querySelectorAll("input, select").forEach((campo) => {
            campo.setAttribute("readonly", "readonly");
            campo.setAttribute("disabled", "disabled");
        });
        fila.querySelector(".EditarDetalle").style.display = "none";
        fila.querySelector(".CancelarEdicion").style.display = "none";
        fila.querySelector(".ActivarEdicion").style.display = "inline-block";
        fila.querySelector(".eliminarDetalle").style.display = "inline-block";
        mensajes.registroCorrecto(constantes.REGISTRO_ACTUALIZADO);
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

    async function cargarListaProductos() {
        let requisicion = document.getElementById("requisicion").value;
        try {
            // Realizar la petición al backend
            const response = await fetch(`api/requisicionDet?ano=${ano}&numero=${numero}&requisicion=${requisicion}`);
            if (!response.ok) throw new Error("Error al cargar los productos");

            const productos = await response.json();

            // Obtener el combo y limpiar opciones anteriores
            const select = document.getElementById("idProducto");
            select.innerHTML = '<option value="">Seleccione un producto</option>';

            // Iterar sobre los productos para agregarlos como opciones
            productos.forEach(producto => {
                const option = document.createElement("option");
                option.value = JSON.stringify(producto); // Guardar el objeto completo como valor
                option.text = `${producto.producto} - Saldo: ${producto.saldo} - Peso: ${producto.peso}`;
                select.appendChild(option);
            });
        } catch (error) {
            console.error("Error al cargar los productos:", error);
        }

    }

function cargarListaRequisicion() {
    fetch(`api/requisiciones?ano=${ano}`)
        .then((res) => res.json())
        .then((datos) => {
            const clienteSelect = document.querySelector("#requisicion");
            datos.forEach((dato) => {
                const option = document.createElement("option");
                option.value = dato.numero;
                option.textContent = dato.numero;
                clienteSelect.appendChild(option);
            });

        });
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
            const columnasABloquear = [1, 2, 3, 4, 5];
            funciones.habilitarEdicion(fila, columnasABloquear);
        } else if (e.target.closest(".CancelarEdicion")) {
            funciones.cancelarEdicion(fila);
        } else if (e.target.closest(".EditarDetalle")) {
            await editarDetalle(fila)
        } else if (e.target.closest(".eliminarDetalle")) {
            await eliminarAntesDetalle(fila);
        }
    });

