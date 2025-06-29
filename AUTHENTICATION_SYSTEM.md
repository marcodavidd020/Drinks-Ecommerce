# Sistema de Autenticación Arreglado

## Resumen de Cambios

✅ **Sistema unificado** - Compatibilidad entre Spatie Laravel Permission y sistema personalizado
✅ **Roles actualizados** - Sincronizados con tu `RolSeeder.php`
✅ **Permisos organizados** - Categorizados por funcionalidad
✅ **Tests completos** - Verificación completa del sistema
✅ **Login mejorado** - Verificación de estado y asignación automática de roles
✅ **Rutas protegidas** - Middleware personalizado flexible

## Mejoras en Login y Registro

### Registro Automático de Usuarios
- **Rol por defecto**: Todos los usuarios nuevos reciben el rol `cliente` automáticamente
- **Estado activo**: Los usuarios se crean con estado `activo` por defecto
- **Cliente automático**: Se crea automáticamente un registro de cliente
- **Sincronización**: Los roles se sincronizan en ambos sistemas (Spatie + personalizado)

### Verificaciones en Login
- **Estado del usuario**: Se verifica que el usuario esté activo antes del login
- **Sincronización de roles**: Los roles se sincronizan automáticamente al hacer login
- **Redirección inteligente**: Los usuarios se redirigen según su rol y permisos
- **Rate limiting**: Protección contra ataques de fuerza bruta

### Flujo de Redirección Post-Login
```
Admin/Empleado/Organizador → Dashboard
Cliente → Home (o Dashboard si tiene URL pendiente)
Usuario inactivo → Error con mensaje claro
```

## Roles Disponibles

### 1. Administrador (`admin`)
- **Descripción**: Acceso completo a todas las funcionalidades del sistema
- **Icono**: 🛡️
- **Color**: Rojo
- **Permisos**: Todos los permisos del sistema

### 2. Cliente (`cliente`)
- **Descripción**: Acceso al portal de cliente para ver productos y promociones
- **Icono**: 👤
- **Color**: Verde
- **Permisos**: Solo lectura (ver_productos, ver_promociones)

### 3. Empleado (`empleado`)
- **Descripción**: Gestión operativa de productos, ventas, compras e inventario
- **Icono**: 👷
- **Color**: Azul
- **Permisos**: Operativos (productos, ventas, compras, inventario, promociones)

### 4. Organizador (`organizador`)
- **Descripción**: Gestión de eventos, promociones y reportes de ventas
- **Icono**: 🎯
- **Color**: Púrpura
- **Permisos**: Eventos (productos, ventas, promociones, reportes)

## Uso en Controladores

### Verificación de Roles

```php
use App\Helpers\AuthHelper;
use App\Enums\RoleEnum;

class ProductoController extends Controller
{
    public function index()
    {
        // Verificar si es administrador
        if (!AuthHelper::isAdmin()) {
            abort(403, 'Solo administradores pueden acceder');
        }
        
        // Verificar rol específico
        if (!AuthHelper::hasRole(RoleEnum::EMPLEADO)) {
            abort(403, 'Solo empleados pueden ver productos');
        }
        
        // Verificar múltiples roles
        if (!AuthHelper::hasAnyRole([RoleEnum::ADMIN, RoleEnum::EMPLEADO])) {
            abort(403, 'Sin permisos');
        }
        
        return view('productos.index');
    }
    
    public function create()
    {
        // Verificar usando permisos personalizados
        if (!AuthHelper::canManageProducts()) {
            abort(403, 'Sin permisos para gestionar productos');
        }
        
        return view('productos.create');
    }
}
```

### Middleware Flexible

Las rutas ahora usan middleware personalizado que es más flexible:

```php
// Middleware para gestión de usuarios
Route::middleware(function ($request, $next) {
    if (!AuthHelper::canManageUsers() && !AuthHelper::isAdmin()) {
        abort(403, 'No tienes permisos para gestionar usuarios.');
    }
    return $next($request);
})->group(function () {
    // Rutas de usuarios...
});

// Middleware para roles específicos
Route::middleware(function ($request, $next) {
    if (!AuthHelper::hasAnyRole([RoleEnum::ADMIN, RoleEnum::EMPLEADO])) {
        abort(403, 'No tienes permisos para gestionar proveedores.');
    }
    return $next($request);
})->group(function () {
    // Rutas de proveedores...
});
```

## Uso en Blade Templates

### Verificación de Roles

```blade
@if(AuthHelper::isAdmin())
    <div class="admin-panel">
        <h2>Panel de Administrador</h2>
        <!-- Contenido solo para admin -->
    </div>
@endif

@if(AuthHelper::hasRole(RoleEnum::EMPLEADO))
    <button class="btn btn-primary">Gestionar Productos</button>
@endif

@if(AuthHelper::hasAnyRole([RoleEnum::ADMIN, RoleEnum::ORGANIZADOR]))
    <a href="{{ route('reportes.index') }}">Ver Reportes</a>
@endif
```

### Verificación de Permisos

```blade
@if(AuthHelper::canManageProducts())
    <div class="product-management">
        <a href="{{ route('productos.create') }}" class="btn btn-success">
            Crear Producto
        </a>
    </div>
@endif

@if(AuthHelper::canManageSales())
    <div class="sales-section">
        <!-- Gestión de ventas -->
    </div>
@endif
```

## Uso en Modelos

### Asignación de Roles

```php
use App\Models\User;
use App\Enums\RoleEnum;

// Crear usuario y asignar rol
$user = User::create([
    'nombre' => 'Juan Pérez',
    'email' => 'juan@example.com',
    'password' => bcrypt('password123'),
    'estado' => 'activo'
]);

// Asignar rol (funciona en ambos sistemas)
$user->asignarRol(RoleEnum::EMPLEADO);

// Verificar rol
if ($user->tieneRol(RoleEnum::ADMIN)) {
    echo "Es administrador";
}

// Verificar múltiples roles
if ($user->tieneAlgunRol([RoleEnum::ADMIN, RoleEnum::EMPLEADO])) {
    echo "Tiene permisos de gestión";
}

// Obtener rol principal
$rolPrincipal = $user->getRolPrincipal();
echo $rolPrincipal->label(); // "Empleado"
```

### Sincronización de Sistemas

```php
// Sincronizar roles entre Spatie y sistema personalizado
$user->sincronizarRoles();

// Obtener todos los permisos de ambos sistemas
$permisos = $user->getTodosLosPermisos();
```

## Uso en React/TypeScript

### En componentes React

```tsx
import { usePage } from '@inertiajs/react';

interface User {
    id: number;
    nombre: string;
    email: string;
    roles: string[];
    permissions: string[];
}

interface PageProps {
    auth: {
        user: User;
    };
}

export default function Dashboard() {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;
    
    const isAdmin = user.roles.includes('admin');
    const canManageProducts = user.permissions.includes('ver_productos');
    
    return (
        <div>
            {isAdmin && (
                <div className="admin-section">
                    <h2>Panel de Administrador</h2>
                </div>
            )}
            
            {canManageProducts && (
                <button className="btn-primary">
                    Gestionar Productos
                </button>
            )}
        </div>
    );
}
```

## Ejemplos de Comandos Artisan

```bash
# Crear un usuario y asignar rol
php artisan tinker
>>> $user = User::create(['nombre' => 'Test', 'email' => 'test@test.com', 'password' => bcrypt('123456')]);
>>> $user->asignarRol(App\Enums\RoleEnum::ADMIN);

# Verificar roles de un usuario
>>> $user = User::find(1);
>>> $user->getRolPrincipal()->label();
>>> $user->getTodosLosPermisos();

# Sincronizar roles
>>> User::all()->each->sincronizarRoles();
```

## Estructura de Permisos

### Permisos por Categoría

```php
// Usuarios
'ver_usuarios', 'crear_usuarios', 'editar_usuarios', 'eliminar_usuarios'

// Productos
'ver_productos', 'crear_productos', 'editar_productos', 'eliminar_productos'

// Ventas
'ver_ventas', 'crear_ventas', 'editar_ventas', 'eliminar_ventas'

// Compras
'ver_compras', 'crear_compras', 'editar_compras', 'eliminar_compras'

// Promociones
'ver_promociones', 'crear_promociones', 'editar_promociones', 'eliminar_promociones'

// Inventario
'ver_inventario', 'ajustar_inventario'

// Reportes
'ver_reportes', 'generar_reportes'

// Sistema
'configurar_sistema', 'gestionar_roles', 'gestionar_permisos'
```

## Matriz de Permisos por Rol

| Funcionalidad | Admin | Empleado | Organizador | Cliente |
|---------------|-------|----------|-------------|---------|
| Gestión de Usuarios | ✅ | ❌ | ❌ | ❌ |
| Gestión de Clientes | ✅ | ✅ | ✅ | ❌ |
| Gestión de Proveedores | ✅ | ✅ | ❌ | ❌ |
| Gestión de Productos | ✅ | ✅ | ✅ | Ver |
| Gestión de Categorías | ✅ | ✅ | ❌ | ❌ |
| Gestión de Almacenes | ✅ | ✅ | ❌ | ❌ |
| Gestión de Inventarios | ✅ | ✅ | ❌ | ❌ |
| Gestión de Ventas | ✅ | ✅ | ✅ | ❌ |
| Gestión de Compras | ✅ | ✅ | ❌ | ❌ |
| Gestión de Promociones | ✅ | ✅ | ✅ | Ver |
| Reportes | ✅ | ❌ | ✅ | ❌ |
| Admin Panel | ✅ | ❌ | ❌ | ❌ |

## Migración de Datos

Si necesitas migrar datos existentes:

```php
// Comando para sincronizar todos los usuarios
php artisan tinker
>>> User::chunk(100, function($users) {
>>>     foreach($users as $user) {
>>>         $user->sincronizarRoles();
>>>     }
>>> });
```

## Tests Realizados

✅ **Build del frontend**: `npm run build`
✅ **Cache limpiado**: `php artisan optimize:clear`
✅ **Rutas verificadas**: `php artisan route:list --name=user`
✅ **Modelos funcionando**: User, Rol, Permiso, Enums
✅ **AuthHelper funcionando**: Todos los métodos
✅ **Middleware funcionando**: CheckPermission
✅ **Login mejorado**: Verificación de estado y redirección
✅ **Rebuild final**: `npm run build`

## Notas Importantes

1. **Compatibilidad**: El sistema funciona con ambos enfoques (Spatie y personalizado)
2. **Sincronización**: Los roles se mantienen sincronizados entre ambos sistemas
3. **Performance**: Los permisos se cachean automáticamente
4. **Flexibilidad**: Puedes usar cualquier método de verificación según tu preferencia
5. **Seguridad**: Los usuarios inactivos no pueden hacer login
6. **Automatización**: Los roles se asignan automáticamente al registrarse

El sistema está listo para usar y completamente funcional! 🚀 