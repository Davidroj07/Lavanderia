// Función para cargar contenido dinámico en <main>
export function cargarContenido(url, scriptName, callback) {
    const main = document.getElementById('contenido-principal');
    main.innerHTML = '<p>Cargando...</p>'; // Loader temporal

    // Cargar el contenido HTML dinámicamente
    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Error al cargar el contenido');
            return response.text();
        })
        .then(html => {
            main.innerHTML = html; // Insertar contenido dinámico
            cargarScript(scriptName, callback); // Cargar el script dinámico correspondiente
        })
        .catch(err => {
            console.error('Error al cargar el contenido dinámico:', err);
            main.innerHTML = '<p>Error al cargar el contenido. Inténtalo de nuevo.</p>';
        });
}

// Función para cargar scripts dinámicamente
function cargarScript(formulario, callback) {
    const scriptId = `script-${formulario}`;

    // Verificar si el script ya está cargado
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
        console.log(`El script ${formulario}.js ya está cargado.`);
        if (callback) callback(); // Ejecutar lógica adicional si es necesario
        return;
    }

    // Crear un nuevo elemento script
    const script = document.createElement('script');
    script.src = `/${formulario}.js`;
    script.id = scriptId;
    script.type = 'module';

    // Manejar eventos después de la carga
    script.onload = function() {
        if (callback) callback(); // Ejecutar lógica adicional
    };
    script.onerror = function() {
        console.error(`Error al cargar el script ${formulario}.js`);
    };

    document.body.appendChild(script); // Agregar el script al DOM
}