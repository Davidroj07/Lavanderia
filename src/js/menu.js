// Función para generar el menú dinámico y manejar los submenús
async function generarMenu() {
    try {
        // Solicita los datos de la base de datos al backend
        const response = await fetch('/api/menu');
        const menus = await response.json();
        const menuData = jsonMenus(menus);

        // Mapa de contenedores según block_id
        const containerMap = {
            1: document.querySelector('.sidebar-links ul'),
            2: document.querySelector('.sidebar-links.sidebar-bottom ul'),
        };

        // Genera el HTML de cada bloque de menú
        const menuHTMLMap = {};

        menuData.forEach(menuItem => {
            const blockId = menuItem.bloque; // Suponiendo que block_id viene en los datos
            if (!menuHTMLMap[blockId]) {
                menuHTMLMap[blockId] = ''; // Inicializa el HTML del bloque si no existe
            }

            let menuHTML = `
            <li class="menu-item">
                <a href="${menuItem.url}" class="menu-link" title="${menuItem.titulo}">
                    <img src="/icons/${menuItem.icono}" alt="Configuración Icono" width="24" height="24">
                    <span class="link hide">${menuItem.nombre}</span>
                </a>
            `;

            // Si el menú tiene submenús
            if (menuItem.submenu && menuItem.submenu.length > 0) {
                menuHTML += '<ul class="submenu">';
                menuItem.submenu.forEach(submenuItem => {
                    menuHTML += `
                        <li >
                            <a href="${submenuItem.url}" title="${submenuItem.titulo}">
                            <img src="/icons/${menuItem.icono}" alt="Configuración Icono" width="24" height="24">
                                <span class="link hide">${submenuItem.nombre}</span>
                            </a>
                        </li>
                    `;
                });
                menuHTML += '</ul>';
            }

            menuHTML += '</li>';

            // Agrega el HTML generado al bloque correspondiente
            menuHTMLMap[blockId] += menuHTML;
        });

        // Inserta el HTML en los contenedores correspondientes
        for (const [blockId, html] of Object.entries(menuHTMLMap)) {
            if (containerMap[blockId]) {
                containerMap[blockId].innerHTML = html;
            } else {
                console.warn(`No se encontró un contenedor para block_id ${blockId}`);
            }
        }

        // Asigna eventos de clic a los elementos del menú después de la generación dinámica
        agregarEventosMenu();

    } catch (error) {
        console.error('Error al generar el menú:', error);
    }
}

// Función para asignar los eventos de clic a los elementos del menú
function agregarEventosMenu() {
    const menuItems = document.querySelectorAll(".menu-item");

    // Itera sobre cada elemento del menú
    menuItems.forEach((item) => {
        const link = item.querySelector(".menu-link");
        const submenu = item.querySelector(".submenu");

        // Si el ítem tiene un submenú, añade un icono de más
        if (submenu) {
            const arrowIcon = document.createElement("span");
            arrowIcon.classList.add("arrow-icon"); // Añadir clase para el icono
            arrowIcon.innerHTML = "&#43;"; // Ícono de más (+) (puedes cambiar el símbolo)
            link.appendChild(arrowIcon); // Agrega el icono al enlace del menú

            // Establecer el tamaño del icono para los menús con submenús
            arrowIcon.style.fontSize = "12px"; // Ícono más pequeño

            // Añade un evento de clic al enlace principal
            link.addEventListener("click", (e) => {
                // Si no tiene submenú, permite la navegación
                if (!submenu) {
                    return; // No se previene el comportamiento, el enlace se sigue
                }

                // Si tiene submenú, evita la navegación y maneja la apertura/cierre del submenú
                e.preventDefault(); // Evita el comportamiento por defecto del enlace

                // Verifica si el submenú ya está visible
                const isCurrentlyOpen = submenu.classList.contains("show");

                // Cierra todos los submenús
                menuItems.forEach((otherItem) => {
                    const otherSubmenu = otherItem.querySelector(".submenu");
                    if (otherSubmenu) {
                        otherSubmenu.classList.remove("show");
                    }
                });

                // Si no estaba abierto previamente, ábrelo
                if (!isCurrentlyOpen) {
                    submenu.classList.add("show");
                }

                // Cambia el icono de más a menos o viceversa
                if (isCurrentlyOpen) {
                    arrowIcon.innerHTML = "&#43;"; // Ícono de más (+)
                } else {
                    arrowIcon.innerHTML = "&#8722;"; // Ícono de menos (−)
                }
            });
        }
    });

    // Asigna el evento de clic para marcar los enlaces activos
    const allLinks = document.querySelectorAll(".sidebar-links a");

    allLinks.forEach((elem) => {
        elem.addEventListener('click', function() {
            const hrefLinkClick = elem.href;

            allLinks.forEach((link) => {
                if (link.href === hrefLinkClick){
                    link.classList.add("active");
                } else {
                    link.classList.remove('active');
                }
            });
        });
    });
}

// Función para transformar los datos del menú
function jsonMenus(data) {
    const menuMap = new Map();

    // Recorrer los resultados y construir el mapa de menús
    data.forEach(row => {
        // Verificar si el menú ya existe en el mapa
        if (!menuMap.has(row.item_id)) {
            menuMap.set(row.item_id, {
                nombre: row.item_name,
                url: row.item_link,
                titulo: row.item_name,
                icono: row.item_icon,
                bloque: row.block_id,
                submenu: []
            });
        }

        // Agregar submenú si existe
        if (row.submenu_id != null) {
            menuMap.get(row.item_id).submenu.push({
                nombre: row.submenu_name,
                url: row.submenu_link,
                titulo: row.submenu_name
            });
        }
    });

    // Convertir el mapa a un array y retornarlo
    return Array.from(menuMap.values());
}

const expand_btn = document.querySelector(".expand-btn");

expand_btn.addEventListener("click", () => {
    document.body.classList.toggle("collapsed");
});

// Recuperar el nombre del usuario desde sessionStorage
const userName = sessionStorage.getItem("usuario");

// Seleccionar el elemento donde se mostrará el nombre del usuario
const userNameElement = document.querySelector(".user-name");

// Verificar si hay un nombre de usuario almacenado y asignarlo al elemento
if (userName && userNameElement) {
    userNameElement.textContent = userName;
} else {
    userNameElement.textContent = "Usuario desconocido"; // Valor predeterminado si no hay usuario
}

// Botón de LogOut para retornar a la página de inicio, también limpia el sessionStorage
const btnLogOut = document.getElementById("btnLogOut");
btnLogOut.onclick = () => {
    sessionStorage.clear();
    location.href = "/"; // Redirige a la página de inicio
};

// Llama a la función para generar el menú cuando la página cargue
document.addEventListener('DOMContentLoaded', generarMenu);
