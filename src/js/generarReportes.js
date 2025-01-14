export function generarPdf(reporte, data) {
    // Enviar la solicitud POST al servidor para generar el PDF
    fetch("/api/generate-report", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al generar el PDF");
            }
            // Recibir el archivo PDF como respuesta
            return response.blob(); // Se obtiene el archivo PDF como un Blob
        })
        .then(blob => {
            // Crear un enlace temporal para descargar el archivo PDF
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob); // Crear un objeto URL para el Blob
            link.download = `${reporte}.pdf`; // Nombre del archivo PDF
            link.click(); // Hacer clic en el enlace para iniciar la descarga
        })
        .catch(error => {
            console.error("Error:", error);
        });
}

export async function obtenerConsulta(codigo) {
    try {
        const res = await fetch(`/api/reportes/consulta?codigo=${codigo}`);
        if (!res.ok) {
            throw new Error(`Error al obtener consulta: ${res.statusText}`);
        }
        return await res.json();
    } catch (error) {
        console.error("Error en obtener Consulta:", error.message);
        throw error;
    }
}

export async function obtenerDatos(query) {
    try {
        const res = await fetch(`/api/reportes/data?query=${query}`);
        if (!res.ok) {
            throw new Error(`Error al obtener consulta: ${res.statusText}`);
        }
        return await res.json();
    } catch (error) {
        console.error("Error en obtener Consulta:", error.message);
        throw error;
    }
}

export  function reemplazarParametros(consulta, parametros, valores){
    // Divide los parámetros en un array
    const listaParametros = parametros.split(',').map((p) => p.trim());

    // Verifica que el número de parámetros coincida con los valores proporcionados
    if (listaParametros.length !== valores.length) {
        throw new Error("El número de parámetros y valores no coincide.");
    }

    // Reemplaza cada parámetro en la consulta
    listaParametros.forEach((parametro, index) => {
        const valor = valores[index];
        // Usa una expresión regular para reemplazar el parámetro con el valor
        consulta = consulta.replace(new RegExp(`\\${parametro}`, 'g'), valor);
    });

    return consulta;
}

export function prepararDatos(reporte, datos){
    let result = {
        "reportName": reporte,
        "data": {}
    }

    let firstRecord = datos[0]; // Obtener el primer objeto del arreglo
    for (let key in firstRecord) {
        if (firstRecord.hasOwnProperty(key)) {
            result.data[key] = firstRecord[key];
        }
    }

    if (datos.length > 0) {
        result.data.items = []; // Inicializar el arreglo "items"

        // Iterar sobre cada elemento del arreglo `datos`
        datos.forEach((item) => {
            let itemData = {}; // Crear un objeto vacío para cada item

            // Recorrer las claves del objeto y agregarlas al itemData
            for (let key in item) {
                if (item.hasOwnProperty(key)) {
                    itemData[key] = item[key]; // Agregar cada clave y su valor al objeto
                }
            }

            // Agregar el objeto itemData al arreglo items
            result.data.items.push(itemData);
        });
    }

    return result;
}
