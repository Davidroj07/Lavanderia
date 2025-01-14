import * as mensaje from "./mensajesUtil.js";
import constantes from "../constantes/constantes.js";

// Selección de elementos
const form = document.querySelector("form");
const userInput = document.querySelector(".field.email input");
const passwordInput = document.querySelector(".field.password input");
const userError = document.querySelector(".field.email .error-txt");
const passwordError = document.querySelector(".field.password .error-txt");

// Función de validación
async function validarYLogIn(event) {
    event.preventDefault(); // Prevenir el envío del formulario por defecto

    const userName = userInput.value.trim();
    const password = passwordInput.value.trim();
    let isValid = true;

    const passwordHash = await hashPassword(password);

    // Validar usuario
    toggleError(userError, userName === "");
    isValid = isValid && userName !== "";

    // Validar contraseña
    toggleError(passwordError, password === "");
    isValid = isValid && password !== "";

    // Si la validación básica falla, detener el proceso
    if (!isValid) return;

    // Validar con la API
    try {
        const res = await fetch(`api/users/${userName}`);
        const data = await res.json();

        if (data.length === 0) {
            mensaje.mensajeerror(constantes.USUARIO_NO_EXISTE);
        } else {
            const storedHash = data[0].password; // Hash almacenado en la base de datos

            // Hashear la contraseña ingresada
            const inputHash = await hashPassword(password);

            if (inputHash === storedHash) {
                // Contraseña válida
                sessionStorage.setItem("usuario", userName);
                sessionStorage.setItem("compania", data[0].compania);
                logIn(); // Llamar a la función de inicio de sesión
            } else {
                mensaje.mensajeerror(constantes.CONTRASENA_ERRADA);
            }
        }
    } catch (error) {
        mensaje.mensajeerror(constantes.ERROR_USUARIO);
    }
}

// Función para mostrar u ocultar mensajes de error
function toggleError(element, condition) {
    element.style.display = condition ? "block" : "none";
}

// Función para manejar el inicio de sesión exitoso
function logIn() {
    mensaje.registroCorrectoRuta(constantes.INGRESO_CORRECTO, "menu")
}

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
}

// Asociar la función al evento submit del formulario
form.addEventListener("submit", validarYLogIn);
