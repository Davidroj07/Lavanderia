import * as generarReportes from "./generarReportes.js";
import * as funciones from "./funciones.js";

let fechainicial = '';
let fechafinal = '';
let reporte = "0002Entregasxfecha";

function closePage() {
    window.location.href = '/menu';
}

document.getElementById("generarPdfBtn").addEventListener("click", async () => {
    //let data = await obtenerDatos();

    // let result = generarReportes.prepararDatos(reporte, datos);

});

document.getElementById("generarExcelBtn").addEventListener("click", async () => {
    let data = await obtenerDatos();
    let reportesPorCliente = await procesarDatosParaExcel(data);

    let hojasExcel = [];

    for (let cliente in reportesPorCliente) {
        const { filas, fechas } = reportesPorCliente[cliente];

        let columnas = [
            { header: "DETALLE", key: "detalle", width: 30 },
            ...fechas.map(fecha => ({ header: fecha, key: fecha, width: 15 })),
            { header: "TOTALES", key: "totales", width: 15 }
        ];

        // Procesar filas con totales
        const filasConTotales = filas.map(fila => {
            fila.totales = Object.entries(fila)
                .filter(([key, value]) => key !== "detalle" && typeof value === "number")
                .reduce((acc, [, value]) => acc + value, 0);
            return fila;
        });

        // Agregar hoja al reporte
        hojasExcel.push({
            name: cliente,
            columns: columnas,
            rows: filasConTotales
        });
    }

    // Enviar a la API
    await fetch('/api/generate-excel', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            fileName: "ReporteGeneral.xlsx",
            sheets: hojasExcel
        }),
    }).then(response => {
        const filename = "ReporteGeneral.xlsx";
        response.blob().then(blob => {
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = filename;
            link.click();
        });
    });
});

async function obtenerDatos() {
    fechainicial = document.getElementById("fecha_inicio").value;
    fechafinal = document.getElementById("fecha_final").value;

    let reemplazar = [fechainicial, fechafinal]
    let consulta = await generarReportes.obtenerConsulta(reporte);
    let query = generarReportes.reemplazarParametros(consulta[0].consulta, consulta[0].parametros, reemplazar);
    return await generarReportes.obtenerDatos(query);

}

async function procesarDatosParaExcel(datos) {
    // Identificar fechas únicas (serán las columnas dinámicas)
    const fechas = [...new Set(datos.map(d => funciones.formatearFecha(d.fecha_entrega)))].sort();

    // Agrupar los datos por cliente
    const clientes = [...new Set(datos.map(d => d.nombre))];

    // Estructura que mantendrá los datos organizados por cliente
    const reportesPorCliente = {};

    clientes.forEach(cliente => {
        // Filtrar datos para el cliente actual
        const datosCliente = datos.filter(d => d.nombre === cliente);

        // Crear una estructura de tabla para pivotear
        const tabla = {};

        // Agregar renglón para REMISION (Requisiciones únicas por fecha)
        fechas.forEach(fecha => {
            tabla["REMISION"] = tabla["REMISION"] || { detalle: "REMISION" };
            tabla["REMISION"][fecha] = datosCliente
                .filter(d => funciones.formatearFecha(d.fecha_entrega) === fecha)
                .map(d => d.requisicion)
                .join(", ") || ""; // Juntar requisiciones por fecha
        });

        // Agregar los datos por producto
        datosCliente.forEach(d => {
            if (!tabla[d.producto]) {
                tabla[d.producto] = { detalle: d.producto };
            }
            tabla[d.producto][funciones.formatearFecha(d.fecha_entrega)] = d.cant_entregada || 0;
        });

        // Agregar renglón para PESO TOTAL
        fechas.forEach(fecha => {
            tabla["PESO TOTAL"] = tabla["PESO TOTAL"] || { detalle: "PESO TOTAL" };
            tabla["PESO TOTAL"][fecha] = datosCliente
                .filter(d => funciones.formatearFecha(d.fecha_entrega) === fecha)
                .reduce((acc, curr) => acc + parseFloat(curr.peso_entregado), 0); // Sumar pesos por fecha
        });

        // Convertir tabla en un array para fácil exportación (formato tabular)
        const filas = Object.values(tabla).map(fila => {
            // Crear una copia completa de los datos originales de la fila
            const filaCompleta = { ...fila };

            // Asegurar que el campo "detalle" existe
            filaCompleta.detalle = fila.detalle || 0;

            // Verificar y agregar columnas dinámicas para cada fecha
            fechas.forEach(fecha => {
                filaCompleta[fecha] = fila[fecha] !== undefined ? fila[fecha] : ""; // Usar "" solo si el dato no existe
            });

            return filaCompleta; // Regresar la fila completa con los datos dinámicos
        });

        // Asociar las filas (datos tabulares) y fechas al cliente
        reportesPorCliente[cliente] = { filas, fechas };
    });

    return reportesPorCliente;
}


window.closePage = closePage;




