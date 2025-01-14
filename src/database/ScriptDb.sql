CREATE TABLE users (
  compania VARCHAR(11) NOT NULL,
  usuario VARCHAR(45) NOT NULL,
  nombre VARCHAR(45) NOT NULL,
  password VARCHAR(45) NOT NULL,
  estado INT NULL DEFAULT 1,
  nivel INT NULL DEFAULT 1,
  PRIMARY KEY (compania, usuario));

INSERT INTO `lavanderia`.`users` (`compania`, `usuario`, `nombre`, `password`) VALUES ('001', 'drojas', 'David Rojas', '123');

CREATE TABLE menu_blocks (
    block_id INT PRIMARY KEY,
    block_name VARCHAR(50) NOT NULL,
    block_order INT NOT NULL
);

CREATE TABLE menu_items (
    item_id INT PRIMARY KEY,
    block_id INT NOT NULL,
    item_name VARCHAR(50) NOT NULL,
    item_icon VARCHAR(100),
    item_link VARCHAR(100),
    item_order INT NOT NULL,
    FOREIGN KEY (block_id) REFERENCES menu_blocks(block_id)
);

CREATE TABLE submenu_items (
    submenu_id INT PRIMARY KEY,
    item_id INT NOT NULL,
    submenu_name VARCHAR(50) NOT NULL,
    submenu_link VARCHAR(100),
    submenu_order INT NOT NULL,
    FOREIGN KEY (item_id) REFERENCES menu_items(item_id)
);

INSERT INTO menu_blocks (block_id, block_name, block_order) VALUES
(1, 'Main', 1),
(2, 'Settings', 2);

INSERT INTO menu_items (item_id, block_id, item_name, item_icon, item_link, item_order) VALUES
(1, 1, 'Configuración', 'configuracion.svg', '#sucursal', 1),
(2, 1, 'Procesos', 'procesos.svg', '#projects', 2),
(3, 1, 'Informes', 'informes.svg', '#calendar', 3),
(4, 1, 'Facturación', 'facturar.svg', '#messages', 4),
(5, 2, 'Help', 'help.svg', '#help', 1),
(6, 2, 'Settings', 'settings.svg', '#settings', 2);

INSERT INTO submenu_items (submenu_id, item_id, submenu_name, submenu_link, submenu_order) VALUES
(1101, 1, 'Sucursales', '#sucursal', 1),
(1102, 1, 'Catalogo', '#catalogo', 1),
(1201, 2, 'Subproject 1', '#subproject1', 1),
(1202, 2, 'Subproject 2', '#subproject2', 2),
(1203, 2, 'Subproject 3', '#subproject3', 3),
(2401, 6, 'Contraseña', '#inbox', 1);

CREATE TABLE sucursal (
    id INT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    nombre_completo VARCHAR(100) NOT NULL,
    nit VARCHAR(50) NOT NULL,
    direccion VARCHAR(100),
    telefono VARCHAR(50) NOT NULL,
    ciudad VARCHAR(50)
);

CREATE TABLE catalogo (
    id INT PRIMARY KEY,
    producto VARCHAR(50) NOT NULL,
    descripcion VARCHAR(255) NOT NULL
);

INSERT INTO catalogo (id, producto, descripcion) VALUES
(1, 'Toalla Cuerpo', 'Toalla Cuerpo'),
(2, 'Sabanas Camilla', 'Sabanas Camilla'),
(3, 'Almohadas', 'Almohadas'),
(4, 'Batas', 'Batas'),
(5, 'Manteles', 'Manteles'),
(6, 'Vidrios', 'Vidrios'),
(7, 'Cobijas', 'Cobijas'),
(8, 'Sabanas', 'Sabanas'),
(9, 'Sobresabanas', 'Sobresabanas'),
(10, 'Fundas', 'Fundas'),
(11, 'Toallas Vidrios', 'Toallas Vidrios'),
(12, 'Forro Cojin', 'Forro Cojin'),
(13, 'Toallas Manos', 'Toallas Manos'),
(14, 'Aseo', 'Aseo'),
(15, 'Toalla Mano', 'Toalla Mano'),
(16, 'Tapete de Baño', 'Tapete de Baño'),
(17, 'Duvet', 'Duvet'),
(18, 'Protector Almohada', 'Protector Almohada'),
(19, 'Toallones', 'Toallones'),
(20, 'Tapas Doradas', 'Tapas Doradas'),
(21, 'Batas de Baño', 'Batas de Baño'),
(22, 'Faldones', 'Faldones'),
(23, 'Deshilacha', 'Deshilacha'),
(24, 'Tapas Caminos', 'Tapas Caminos'),
(25, 'Protector de colchon', 'Protector de colchon');

CREATE TABLE requisiciones (
    ano INT NOT NULL,                        -- Año de la requisición
    numero INT NOT NULL,                     -- Número de la requisición
    cliente_id INT NOT NULL,                 -- ID del cliente (viene de la tabla 'sucursal')
    fecha_recibido DATE,                     -- Fecha de recibido
    fecha_entrega DATE,                      -- Fecha de entrega
    descripcion TEXT,                        -- Descripción de la requisición
    total_peso DECIMAL(10, 2) DEFAULT 0,     -- Peso total de la requisición
    valor_total DECIMAL(15, 2) DEFAULT 0,    -- Valor total de la requisición
    usuario VARCHAR(255),                    -- Usuario que crea la requisición
    PRIMARY KEY (ano, numero),               -- Clave primaria compuesta por año y número
    FOREIGN KEY (cliente_id) REFERENCES sucursal(id) -- Relación con la tabla sucursal
);

CREATE TABLE requisicion_detalles1 (
    ano INT NOT NULL,                           -- Año de la requisición (relacionado con la tabla 'requisiciones')
    numero INT NOT NULL,                        -- Número de la requisición (relacionado con la tabla 'requisiciones')
    consecutivo INT NOT NULL,                   -- Consecutivo del detalle dentro de la requisición
    id_producto INT NOT NULL,                   -- ID del producto (viene de la tabla 'catalogo')
    cantidad_recibida INT NOT NULL DEFAULT 0,   -- Cantidad recibida del producto
    cantidad_entregada INT NOT NULL DEFAULT 0,  -- Cantidad entregada del producto
    peso DECIMAL(10, 2) DEFAULT 0,              -- Peso del producto
    valor DECIMAL(15, 2) DEFAULT 0,             -- Valor del producto
    reproceso BOOLEAN DEFAULT FALSE,            -- Indica si es un producto en reproceso
    observacion TEXT,                           -- Observación del detalle
    PRIMARY KEY (ano, numero, consecutivo),     -- Clave primaria compuesta por año, número y consecutivo
    FOREIGN KEY (ano, numero) REFERENCES requisiciones(ano, numero),  -- Relación con la tabla requisiciones
    FOREIGN KEY (id_producto) REFERENCES catalogo(id)  -- Relación con la tabla catalogo
);

CREATE TABLE consultas (
    codigo VARCHAR(50) PRIMARY KEY, -- Identificador único de la consulta
    descripcion VARCHAR(255),       -- Breve descripción de la consulta
    consulta TEXT,                  -- La consulta SQL parametrizada
    parametros VARCHAR(255)         -- Lista de parámetros esperados (ej.: ":ano,:mes")
);

CREATE TABLE entregas (
                       ano INT NOT NULL,
                       numero INT NOT NULL,
                       requisicion INT NOT NULL,
                       cliente_id INT NOT NULL,
                       fecha_entrega DATE NOT NULL,
                       total_peso DECIMAL(10,2),
                       total_valor DECIMAL(10,2),
                       descripcion TEXT,
                       usuario_c VARCHAR(50) NOT NULL,
                       usuario_m VARCHAR(50),

                       PRIMARY KEY (ano, numero),
                       FOREIGN KEY (ano, requisicion) REFERENCES requisiciones(ano, numero),
                       FOREIGN KEY (cliente_id) REFERENCES sucursal(id)
);

CREATE TABLE entregas_detalle (
                                  ano INT NOT NULL,
                                  numero INT NOT NULL,
                                  consecutivo INT NOT NULL,
                                  id_producto INT NOT NULL,
                                  saldo_req INT NOT NULL,
                                  peso_req DECIMAL(10,2) NOT NULL,
                                  cant_entregada INT NOT NULL,
                                  peso_entregado DECIMAL(10,2) NOT NULL,
                                  consecutivo_afect INT NOT NULL,
                                  observacion TEXT,
                                  usuario_c VARCHAR(50) NOT NULL,
                                  usuario_m VARCHAR(50),

                                  PRIMARY KEY (ano, numero, consecutivo),
                                  FOREIGN KEY (ano, numero) REFERENCES entregas(ano, numero),
                                  FOREIGN KEY (id_producto) REFERENCES catalogo(id)
);









