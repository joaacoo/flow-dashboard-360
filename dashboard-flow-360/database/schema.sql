-- Core Tables
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reglas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    condicion TEXT NOT NULL, -- JSON or structured text describing the condition
    accion VARCHAR(100) NOT NULL, -- e.g., 'EMAIL', 'WEBHOOK', 'NOTIFICATION'
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notificaciones (
    id SERIAL PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL, -- 'EMAIL', 'WEBHOOK', 'INTERNAL'
    mensaje TEXT NOT NULL,
    destino VARCHAR(255), -- Email address or Webhook URL
    leido BOOLEAN DEFAULT FALSE,
    enviado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS log_reglas (
    id SERIAL PRIMARY KEY,
    regla_id INTEGER REFERENCES reglas(id),
    resultado TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tango Mirror Tables (Simulated for Integration)

CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE,
    razon_social VARCHAR(200),
    email VARCHAR(100),
    telefono VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS productos (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE,
    descripcion VARCHAR(200),
    precio NUMERIC(12, 2),
    costo NUMERIC(12, 2)
);

CREATE TABLE IF NOT EXISTS stock (
    id SERIAL PRIMARY KEY,
    producto_id INTEGER REFERENCES productos(id),
    deposito VARCHAR(50),
    cantidad NUMERIC(12, 2),
    punto_pedido NUMERIC(12, 2)
);

CREATE TABLE IF NOT EXISTS ventas (
    id SERIAL PRIMARY KEY,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cliente_id INTEGER REFERENCES clientes(id),
    total NUMERIC(12, 2),
    estado VARCHAR(20) -- 'PENDIENTE', 'FACTURADO', 'CANCELADO'
);

CREATE TABLE IF NOT EXISTS pedidos (
    id SERIAL PRIMARY KEY,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cliente_id INTEGER REFERENCES clientes(id),
    total NUMERIC(12, 2),
    estado VARCHAR(20) -- 'PENDIENTE', 'APROBADO', 'EN_PROCESO', 'ENTREGADO'
);

CREATE TABLE IF NOT EXISTS cuentas_cobrar (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER REFERENCES clientes(id),
    venta_id INTEGER REFERENCES ventas(id),
    monto NUMERIC(12, 2),
    vencimiento DATE,
    pagado BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS produccion (
    id SERIAL PRIMARY KEY,
    producto_id INTEGER REFERENCES productos(id),
    cantidad NUMERIC(12, 2),
    fecha_inicio DATE,
    fecha_fin_estimada DATE,
    estado VARCHAR(20), -- 'PLANIFICADO', 'EN_PROCESO', 'FINALIZADO'
    avance_porcentaje INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS crm_oportunidades (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER REFERENCES clientes(id),
    titulo VARCHAR(200),
    valor NUMERIC(12, 2),
    etapa VARCHAR(50), -- 'PROSPECTO', 'NEGOCIACION', 'CERRADO_GANADO', 'CERRADO_PERDIDO'
    fecha_cierre_estimada DATE
);

CREATE TABLE IF NOT EXISTS crm_casos (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER REFERENCES clientes(id),
    asunto VARCHAR(200),
    descripcion TEXT,
    estado VARCHAR(20), -- 'ABIERTO', 'EN_PROCESO', 'RESUELTO'
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Data (Optional, for testing)
INSERT INTO usuarios (nombre, email, password) VALUES ('Admin', 'admin@flow360.com', '$2a$10$X.y.z...hashed_password_placeholder'); 
-- Note: In a real scenario, use a proper bcrypt hash. For 'admin123': $2a$10$EpIxT98h.k.z.x.y... (example)
