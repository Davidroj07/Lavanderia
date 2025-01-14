export async function obtenerMaximo(tableName) {
    try {
        const res = await fetch(`/api/maximos/id?tableName=${tableName}`);
        if (!res.ok) {
            throw new Error(`Error al obtener el máximo: ${res.statusText}`);
        }
        const data = await res.json();
        return data.next; // Extraer y devolver directamente el valor de nextID
    } catch (error) {
        console.error("Error en obtenerMaximo:", error.message);
        throw error;
    }
}

export async function obtenerMaximoNumero(tableName, ano) {
    try {
        const res = await fetch(`/api/maximos/numero?tableName=${tableName}&ano=${ano}`);
        if (!res.ok) {
            throw new Error(`Error al obtener el máximo: ${res.statusText}`);
        }
        const data = await res.json();
        return data.next; // Extraer y devolver directamente el valor de nextID
    } catch (error) {
        console.error("Error en obtenerMaximo:", error.message);
        throw error;
    }
}

export async function obtenerMaximoConsecutivo(tableName, ano, numero) {
    try {
        const res = await fetch(`/api/maximos/consecutivo?tableName=${tableName}&ano=${ano}&numero=${numero}`);
        if (!res.ok) {
            throw new Error(`Error al obtener el máximo: ${res.statusText}`);
        }
        const data = await res.json();
        return data.next; // Extraer y devolver directamente el valor de nextID
    } catch (error) {
        console.error("Error en obtenerMaximo:", error.message);
        throw error;
    }
}

export function obtenerAnoActual() {
    const fechaActual = new Date();
    return fechaActual.getFullYear();
}

export function formatearFecha(fechaISO) {
    const fecha = new Date(fechaISO); // Convertir la fecha ISO a un objeto Date
    const dia = String(fecha.getDate()).padStart(2, '0'); // Obtener el día con dos dígitos
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Obtener el mes con dos dígitos (0-indexado)
    const ano = fecha.getFullYear(); // Obtener el año
    if(dia !== "NaN" && mes !== "NaN" && ano !== "NaN") {
        return `${dia}/${mes}/${ano}`; // Formatear como DD/MM/YYYY
    }else{
        return ``;
    }
}

export function formatearFechaAno(fechaISO) {
    const fecha = new Date(fechaISO); // Convertir la fecha ISO a un objeto Date
    const dia = String(fecha.getDate()).padStart(2, '0'); // Obtener el día con dos dígitos
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Obtener el mes con dos dígitos (0-indexado)
    const ano = fecha.getFullYear(); // Obtener el año
    if(dia !== "NaN" && mes !== "NaN" && ano !== "NaN") {

        return `${ano}-${mes}-${dia}`; // Formatear como DD/MM/YYYY
    }else{
        return ``;
    }
}

export function habilitarEdicion(fila, columnasABloquear) {
    fila.querySelectorAll("input, select").forEach((campo) => {
        // Guardar el valor original en un atributo data-original-value
        if (!campo.dataset.originalValue) {
            campo.dataset.originalValue = campo.value;
        }

        campo.removeAttribute("readonly");
        campo.removeAttribute("disabled");
    });

    columnasABloquear.forEach((columnaIndex) => {
        const campo = fila.querySelector(`td:nth-child(${columnaIndex}) input`);
        if (campo) {
            campo.setAttribute("readonly", "readonly");
            campo.setAttribute("disabled", "disabled");
        }
    });

    fila.querySelector(".EditarDetalle").style.display = "inline-block";
    fila.querySelector(".CancelarEdicion").style.display = "inline-block";
    fila.querySelector(".ActivarEdicion").style.display = "none";
    fila.querySelector(".eliminarDetalle").style.display = "none";
}


export function cancelarEdicion(fila) {
    fila.querySelectorAll("input, select").forEach((campo) => {
        // Restaurar el valor original
        if (campo.dataset.originalValue) {
            campo.value = campo.dataset.originalValue;
        }

        campo.setAttribute("readonly", "readonly");
        campo.setAttribute("disabled", "disabled");
    });

    fila.querySelector(".EditarDetalle").style.display = "none";
    fila.querySelector(".CancelarEdicion").style.display = "none";
    fila.querySelector(".ActivarEdicion").style.display = "inline-block";
    fila.querySelector(".eliminarDetalle").style.display = "inline-block";
}

export function filterTable(tableId, columnIndex, data) {
    // Obtener la tabla específica
    const table = document.querySelector(`#${tableId}`);
    if (!table || !data) {
        console.error("Tabla o datos no encontrados.");
        return;
    }

    // Inputs de filtro
    const filterInputs = table.querySelectorAll("thead input");
    const filterValue = filterInputs[columnIndex].value.toLowerCase();

    // Filtra los datos originales según el filtro
    return data.filter(row => {
        const values = Object.values(row); // Obtener los valores del objeto
        if (values.length > columnIndex) {
            return values[columnIndex].toString().toLowerCase().includes(filterValue);
        }
        return false;
    });


}





