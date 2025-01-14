document.addEventListener('DOMContentLoaded', function() {
    // Función para mostrar contenido dinámico en el contenedor principal
    function mostrarFormulario() {
        const currentHash = window.location.hash.replace('#', ''); // Obtener la parte después de #
        const mainContainer = document.getElementById('contenido-principal');

        if (!currentHash) {
            mainContainer.innerHTML = '<h1>Bienvenido a Lavaindux</h1>'; // Contenido inicial por defecto
            return;
        }

        mainContainer.innerHTML = '<p>Cargando...</p>'; // Loader temporal

        fetch(`/${currentHash}`) // El servidor devolverá la vista parcial (HTML)
            .then(response => {
                if (!response.ok) throw new Error(response.statusText);
                return response.text(); // Obtener el HTML
            })
            .then(html => {
                mainContainer.innerHTML = html; // Inyectar contenido dinámico
                cargarScript(currentHash); // Asignar script dinámico (si es necesario)
            })
            .catch(err => {
                mainContainer.innerHTML = '<p>Error al cargar contenido</p>';
                console.error(err);
            });
    }

    // Carga un script adicional asociado con el hash actual
    function cargarScript(formulario) {
        const scriptId = `script-${formulario}`;
        if (document.getElementById(scriptId)) {
            return; // Evitar cargar el mismo script si ya está incluido
        }

        const script = document.createElement('script');
        script.type = 'module';
        script.src = `/js/${formulario}.js`; // Los scripts deben estar en /js/nombredelformulario.js
        script.id = scriptId;
        document.body.appendChild(script);
    }

    // Ejecutar cuando cambie el hash en la URL
    window.addEventListener('hashchange', mostrarFormulario);

    // Cargar el contenido inicial (si hay hash en la URL al cargar)
    mostrarFormulario();
});