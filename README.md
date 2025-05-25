# Sistema de Gestión de Inventario - Laravel TALL Stack

Sistema completo de gestión de inventario y ecommerce desarrollado con Laravel utilizando el stack TALL (Tailwind, Alpine.js, Laravel, Livewire) con autenticación basada en roles y permisos granulares.

## 🚀 Características Principales

- ✅ **Autenticación completa** con roles y permisos granulares
- ✅ **Sistema de herencia de usuarios** (Cliente/Administrativo)
- ✅ **Gestión completa de inventario** con múltiples almacenes
- ✅ **Sistema de ventas y compras** con detalles
- ✅ **Sistema de carrito de compras** para ecommerce
- ✅ **Sistema PQRS** (Peticiones, Quejas, Reclamos, Sugerencias)
- ✅ **Gestión de proveedores** (personas y empresas)
- ✅ **Gestión de promociones** y descuentos
- ✅ **Ajustes de inventario** con trazabilidad
- ✅ **Tests unitarios y de feature** comprehensivos
- ✅ **Seeders con datos realistas** para desarrollo

## 🏗️ Arquitectura del Sistema

### 🗄️ Base de Datos (25 Tablas Implementadas)

**Sistema de Usuarios:**
- `users` - Usuarios base del sistema
- `clientes` - Información específica de clientes (NIT)
- `administrativos` - Información específica de empleados (salario, cargo)

**Gestión de Proveedores:**
- `pqrsonas` - Personas físicas (para PQRS y proveedores)
- `pempresas` - Empresas (para proveedores)
- `proveedores` - Proveedores con relación polimórfica (persona/empresa)

**Gestión de Inventario:**
- `direcciones` - Ubicaciones geográficas con coordenadas
- `categorias` - Categorías de productos
- `productos` - Catálogo completo de productos
- `almacenes` - Almacenes de inventario
- `producto_inventarios` - Stock por almacén (tabla pivot)

**Sistema de Ventas:**
- `tipos_pago` - Métodos de pago disponibles
- `notas_venta` - Ventas realizadas
- `detalle_ventas` - Detalles de cada venta

**Sistema de Compras:**
- `notas_compra` - Compras a proveedores
- `detalle_compras` - Detalles de cada compra

**Sistema de Promociones:**
- `promociones` - Promociones y descuentos
- `promocion_productos` - Tabla pivot promociones-productos

**Gestión de Inventario:**
- `ajuste_inventarios` - Ajustes de inventario
- `detalle_ajustes` - Detalles de cada ajuste

**Sistema de Carrito de Compras:**
- `carritos` - Carritos de compra de clientes
- `detalle_carritos` - Productos en cada carrito

**Sistema de Permisos:**
- `permissions` - Permisos del sistema
- `roles` - Roles de usuario
- `model_has_permissions` - Permisos por modelo
- `model_has_roles` - Roles por modelo
- `role_has_permissions` - Permisos por rol

### 🔐 Sistema de Autenticación

**Roles del Sistema:**
- `super-admin` - Acceso total al sistema
- `admin` - Gestión de usuarios y operaciones administrativas
- `cliente` - Acceso al ecommerce y carrito de compras
- `empleado` - Operaciones básicas del sistema
- `vendedor` - Gestión de ventas y carrito
- `almacenista` - Gestión de inventario y compras

**Permisos Granulares:**
- **Usuarios:** crear, editar, eliminar, ver usuarios
- **Clientes:** gestión completa de clientes
- **Administrativos:** gestión de personal
- **Productos:** CRUD completo de productos
- **Inventario:** gestión de stock y almacenes
- **Categorías:** gestión de categorías
- **Proveedores:** gestión de proveedores
- **Ventas:** gestión de ventas
- **Compras:** gestión de compras
- **Carrito:** gestión de carrito de compras
- **PQRS:** crear y responder PQRS
- **Promociones:** gestión de promociones
- **Ajustes:** ajustes de inventario
- **Sistema:** acceso dashboard, reportes, ecommerce

## 🛠️ Tecnologías Utilizadas

- **Laravel 11** - Framework PHP
- **Spatie Laravel Permission** - Sistema de roles y permisos
- **PostgreSQL** - Base de datos
- **PHPUnit** - Testing framework
- **Livewire** - Componentes reactivos
- **Alpine.js** - JavaScript framework
- **Tailwind CSS** - Framework CSS

## 📦 Instalación

### Prerrequisitos
- PHP 8.1+
- Composer
- PostgreSQL
- Node.js (para assets front-end)

### Pasos de Instalación

1. **Clonar el repositorio:**
```bash
git clone https://github.com/marcodavidd020/Drinks-Ecommerce.git
cd Drinks-Ecommerce
```

2. **Instalar dependencias:**
```bash
composer install
npm install
```

3. **Configurar variables de entorno:**
```bash
cp .env.example .env
php artisan key:generate
```

4. **Configurar base de datos en `.env`:**
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=example_app
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

5. **Ejecutar migraciones y seeders:**
```bash
php artisan migrate:fresh --seed
```

6. **Compilar assets:**
```bash
npm run dev
```

## 🎯 Usuarios de Prueba

El sistema se instala con usuarios predefinidos:

- **Super Administrador:**
  - Email: `super@admin.com`
  - Password: `password`

- **Clientes de ejemplo:**
  - Email: `juan.perez@example.com`
  - Email: `maria.gonzalez@example.com`
  - Password: `password123`

- **Personal Administrativo:**
  - Email: `roberto.sanchez@empresa.com` (Gerente)
  - Email: `carmen.jimenez@empresa.com` (Gerente)
  - Password: `admin123`

## 🧪 Testing

### Ejecutar Tests

```bash
# Todos los tests
php artisan test

# Solo tests unitarios
php artisan test --testsuite=Unit

# Solo tests de feature
php artisan test --testsuite=Feature

# Tests con coverage
php artisan test --coverage

# Tests específicos
php artisan test tests/Unit/ProveedorTest.php
php artisan test tests/Unit/PempresaTest.php
```

### Tests Implementados

**Tests Unitarios:**
- `UserTest` - 10 tests para el modelo User
  - Creación y validación de usuarios
  - Relaciones con Cliente y Administrativo
  - Métodos helper (esCliente, esAdministrativo)
  - Validación de roles y permisos

- `CarritoTest` - 8 tests para el modelo Carrito
  - Creación y gestión de carritos
  - Relaciones con Cliente y DetalleCarrito
  - Cálculo de totales y cantidades
  - Estados del carrito (activo, procesado, abandonado)

- `PqrsonaTest` - 8 tests para el modelo Pqrsona
  - Sistema PQRS completo
  - Relación con Administrativo
  - Estados (pendiente, resuelto)
  - Gestión de respuestas

- `ProveedorTest` - 8 tests para el modelo Proveedor
  - Relaciones polimórficas con Pqrsona y Pempresa
  - Creación de proveedores persona y empresa
  - Validación de tipos y métodos helper
  - Relaciones con NotaCompra

- `PempresaTest` - 7 tests para el modelo Pempresa
  - Creación de empresas
  - Validación de campos únicos (NIT, email)
  - Relación polimórfica con Proveedor
  - Campos opcionales y obligatorios

- `NotaVentaTest` - 8 tests para el modelo NotaVenta
  - Creación de notas de venta
  - Relaciones con DetalleVenta
  - Cálculo de totales y productos
  - Estados y completado de ventas

**Tests de Feature:**
- `UserControllerTest` - 12 tests para el controlador
  - Autenticación y autorización
  - CRUD completo de usuarios
  - Validación de permisos específicos
  - Protección de rutas

## 📊 Estructura de Datos

### Modelos Principales

```php
// Herencia de usuarios
User -> Cliente (NIT, fecha_nacimiento)
User -> Administrativo (salario, cargo, fecha_contratacion)

// Sistema de proveedores polimórfico
Proveedor -> Pqrsona (persona física)
Proveedor -> Pempresa (empresa)

// Sistema de inventario
Producto -> ProductoInventario -> Almacen
Categoria -> Producto
Proveedor -> NotaCompra -> DetalleCompra

// Sistema de ventas
Cliente -> NotaVenta -> DetalleVenta -> Producto
Cliente -> Carrito -> DetalleCarrito -> Producto

// Sistema PQRS
Pqrsona -> Administrativo (respuesta)
```

### Relaciones Clave

- **Polimórficas:** Proveedor puede ser Pqrsona o Pempresa
- **Herencia:** User se especializa en Cliente o Administrativo
- **Inventario:** Productos tienen stock en múltiples almacenes
- **Carrito:** Clientes pueden tener múltiples carritos
- **PQRS:** Sistema completo de atención al cliente

## 🎨 Factories y Seeders

### Factories Implementados
- `UserFactory` - Usuarios con roles aleatorios
- `ClienteFactory` - Clientes con datos realistas
- `AdministrativoFactory` - Personal con cargos y salarios
- `CarritoFactory` - Carritos con estados variados
- `PqrsonaFactory` - PQRS con tipos y estados
- `PempresaFactory` - Empresas con NITs únicos
- `ProveedorFactory` - Proveedores persona/empresa

### Seeders Principales
- `RoleAndPermissionSeeder` - Roles y permisos completos
- `ClienteSeeder` - 10 clientes de ejemplo
- `AdministrativoSeeder` - Personal administrativo
- `PqrsonaSeeder` - PQRS de ejemplo
- `PempresaSeeder` - Empresas proveedoras
- `ProveedorSeeder` - Proveedores mixtos
- `InventarioSeeder` - Productos y stock

## 🚀 Comandos Útiles

```bash
# Limpiar y recargar base de datos
php artisan migrate:fresh --seed

# Ejecutar seeders específicos
php artisan db:seed --class=ProveedorSeeder
php artisan db:seed --class=PempresaSeeder

# Limpiar caché de permisos
php artisan permission:cache-reset

# Crear nuevos modelos con factory y tests
php artisan make:model NuevoModelo -mfs
php artisan make:test NuevoModeloTest --unit

# Verificar rutas y permisos
php artisan route:list
php artisan permission:show
```

## 📈 Estadísticas del Proyecto

- **25 tablas** de base de datos
- **19 modelos** Eloquent
- **27 tests unitarios** exitosos
- **6 factories** para datos de prueba
- **4 seeders** principales
- **60+ permisos** granulares
- **6 roles** de usuario
- **Sistema completo** de ecommerce

## 🔧 Desarrollo

### Estructura de Directorios
```
app/
├── Models/           # Modelos Eloquent
├── Http/Controllers/ # Controladores
├── Policies/         # Políticas de autorización
└── Providers/        # Proveedores de servicios

database/
├── migrations/       # Migraciones de BD
├── seeders/         # Seeders de datos
└── factories/       # Factories para testing

tests/
├── Unit/            # Tests unitarios
└── Feature/         # Tests de integración
```

### Convenciones
- Strict typing en todos los archivos PHP
- Documentación completa en métodos públicos
- Tests para cada modelo y controlador
- Seeders con datos realistas
- Validación exhaustiva de datos

## 📝 Licencia

Este proyecto es de código abierto bajo la licencia MIT.

---

**Desarrollado con ❤️ usando Laravel TALL Stack** 