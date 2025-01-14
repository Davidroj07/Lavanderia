import * as mensaje from "./mensajesUtil.js";
import constantes from "../constantes/constantes.js";

const crudService = {
    async ejecutarOperacion(apiUrl, method, bodyData) {
        try {
            const response = await fetch(apiUrl, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: bodyData ? JSON.stringify(bodyData) : null,
            });

            const result = await response.json();

            if (result.success) {
                manejarRespuesta(method);
                return result.success || null; // Devuelve los datos en caso de ser necesario
            } else {
                mensaje.mensajeerror(result.message)
            }
        } catch (error) {
            mensaje.mensajeerror(error)
            return null;
        }
    },
};

// Supongamos que el método que se está ejecutando es pasado como un parámetro
function manejarRespuesta(metodo) {
    switch (metodo) {
        case constantes.INSERT:
            mensaje.registroCorrecto(constantes.REGISTRO_INSERTADO);
            break;
        case constantes.UPDATE:
            mensaje.registroCorrecto(constantes.REGISTRO_ACTUALIZADO);
            break;
        case constantes.DELETE:
            mensaje.registroCorrecto(constantes.REGISTRO_ELIMINADO);
            break;
        default:
            console.error('Método no reconocido');
    }
}

export default crudService;
