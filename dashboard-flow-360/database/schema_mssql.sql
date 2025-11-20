-- Create Database
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'flow360')
BEGIN
    CREATE DATABASE flow360;
END
GO

USE flow360;
GO

-- Core Tables
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'usuarios')
BEGIN
    CREATE TABLE usuarios (
        id INT IDENTITY(1,1) PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at DATETIME DEFAULT GETDATE()
    );
END

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'reglas')
BEGIN
    CREATE TABLE reglas (
        id INT IDENTITY(1,1) PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        condicion NVARCHAR(MAX) NOT NULL, -- JSON or structured text describing the condition
        accion VARCHAR(100) NOT NULL, -- e.g., 'EMAIL', 'WEBHOOK', 'NOTIFICATION'
        activo BIT DEFAULT 1,
        creado_en DATETIME DEFAULT GETDATE()
    );
END

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'notificaciones')
BEGIN
    CREATE TABLE notificaciones (
        id INT IDENTITY(1,1) PRIMARY KEY,
        tipo VARCHAR(50) NOT NULL, -- 'EMAIL', 'WEBHOOK', 'INTERNAL'
        mensaje NVARCHAR(MAX) NOT NULL,
        destino VARCHAR(255), -- Email address or Webhook URL
        leido BIT DEFAULT 0,
        enviado_en DATETIME DEFAULT GETDATE()
    );
END

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'log_reglas')
BEGIN
    CREATE TABLE log_reglas (
        id INT IDENTITY(1,1) PRIMARY KEY,
        regla_id INT FOREIGN KEY REFERENCES reglas(id),
        resultado NVARCHAR(MAX),
        fecha DATETIME DEFAULT GETDATE()
    );
END

-- Tango Mirror Tables (Simulated for Integration)

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'clientes')
BEGIN
    CREATE TABLE clientes (
        id INT IDENTITY(1,1) PRIMARY KEY,
        codigo VARCHAR(20) UNIQUE,
        razon_social VARCHAR(200),
        email VARCHAR(100),
        telefono VARCHAR(50)
    );
END

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'productos')
BEGIN
    CREATE TABLE productos (
        id INT IDENTITY(1,1) PRIMARY KEY,
        codigo VARCHAR(20) UNIQUE,
        descripcion VARCHAR(200),
        precio NUMERIC(12, 2),
        costo NUMERIC(12, 2)
    );
END

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'stock')
BEGIN
    CREATE TABLE stock (
        id INT IDENTITY(1,1) PRIMARY KEY,
        producto_id INT FOREIGN KEY REFERENCES productos(id),
        deposito VARCHAR(50),
        cantidad NUMERIC(12, 2),
        punto_pedido NUMERIC(12, 2)
    );
END

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ventas')
BEGIN
    CREATE TABLE ventas (
        id INT IDENTITY(1,1) PRIMARY KEY,
        fecha DATETIME DEFAULT GETDATE(),
        cliente_id INT FOREIGN KEY REFERENCES clientes(id),
        total NUMERIC(12, 2),
        estado VARCHAR(20) -- 'PENDIENTE', 'FACTURADO', 'CANCELADO'
    );
END

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'pedidos')
BEGIN
    CREATE TABLE pedidos (
        id INT IDENTITY(1,1) PRIMARY KEY,
        fecha DATETIME DEFAULT GETDATE(),
        cliente_id INT FOREIGN KEY REFERENCES clientes(id),
        total NUMERIC(12, 2),
        estado VARCHAR(20) -- 'PENDIENTE', 'APROBADO', 'EN_PROCESO', 'ENTREGADO'
    );
END

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'cuentas_cobrar')
BEGIN
    CREATE TABLE cuentas_cobrar (
        id INT IDENTITY(1,1) PRIMARY KEY,
        cliente_id INT FOREIGN KEY REFERENCES clientes(id),
        venta_id INT FOREIGN KEY REFERENCES ventas(id),
        monto NUMERIC(12, 2),
        vencimiento DATE,
        pagado BIT DEFAULT 0
    );
END

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'produccion')
BEGIN
    CREATE TABLE produccion (
        id INT IDENTITY(1,1) PRIMARY KEY,
        producto_id INT FOREIGN KEY REFERENCES productos(id),
        cantidad NUMERIC(12, 2),
        fecha_inicio DATE,
        fecha_fin_estimada DATE,
        estado VARCHAR(20), -- 'PLANIFICADO', 'EN_PROCESO', 'FINALIZADO'
        avance_porcentaje INT DEFAULT 0
    );
END

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'crm_oportunidades')
BEGIN
    CREATE TABLE crm_oportunidades (
        id INT IDENTITY(1,1) PRIMARY KEY,
        cliente_id INT FOREIGN KEY REFERENCES clientes(id),
        titulo VARCHAR(200),
        valor NUMERIC(12, 2),
        etapa VARCHAR(50), -- 'PROSPECTO', 'NEGOCIACION', 'CERRADO_GANADO', 'CERRADO_PERDIDO'
        fecha_cierre_estimada DATE
    );
END

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'crm_casos')
BEGIN
    CREATE TABLE crm_casos (
        id INT IDENTITY(1,1) PRIMARY KEY,
        cliente_id INT FOREIGN KEY REFERENCES clientes(id),
        asunto VARCHAR(200),
        descripcion NVARCHAR(MAX),
        estado VARCHAR(20), -- 'ABIERTO', 'EN_PROCESO', 'RESUELTO'
        fecha_creacion DATETIME DEFAULT GETDATE()
    );
END

-- Seed Data (Optional, for testing)
-- IF NOT EXISTS (SELECT * FROM usuarios WHERE email = 'admin@flow360.com')
-- BEGIN
--    INSERT INTO usuarios (nombre, email, password) VALUES ('Admin', 'admin@flow360.com', '$2a$10$X.y.z...hashed_password_placeholder'); 
-- END
