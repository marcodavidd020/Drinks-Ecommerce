<?php

declare(strict_types=1);

namespace App\Enums;

enum PermissionEnum: string
{
    // Permisos de usuarios
    case CREAR_USUARIOS = 'crear-usuarios';
    case EDITAR_USUARIOS = 'editar-usuarios';
    case ELIMINAR_USUARIOS = 'eliminar-usuarios';
    case VER_USUARIOS = 'ver-usuarios';

    // Permisos de clientes
    case CREAR_CLIENTES = 'crear-clientes';
    case EDITAR_CLIENTES = 'editar-clientes';
    case ELIMINAR_CLIENTES = 'eliminar-clientes';
    case VER_CLIENTES = 'ver-clientes';

    // Permisos de administrativos
    case CREAR_ADMINISTRATIVOS = 'crear-administrativos';
    case EDITAR_ADMINISTRATIVOS = 'editar-administrativos';
    case ELIMINAR_ADMINISTRATIVOS = 'eliminar-administrativos';
    case VER_ADMINISTRATIVOS = 'ver-administrativos';

    // Permisos de gestión de roles y permisos
    case GESTIONAR_ROLES = 'gestionar-roles';
    case GESTIONAR_PERMISOS = 'gestionar-permisos';

    // Permisos de productos
    case CREAR_PRODUCTOS = 'crear-productos';
    case EDITAR_PRODUCTOS = 'editar-productos';
    case ELIMINAR_PRODUCTOS = 'eliminar-productos';
    case VER_PRODUCTOS = 'ver-productos';
    case GESTIONAR_INVENTARIO = 'gestionar-inventario';

    // Permisos de categorías
    case CREAR_CATEGORIAS = 'crear-categorias';
    case EDITAR_CATEGORIAS = 'editar-categorias';
    case ELIMINAR_CATEGORIAS = 'eliminar-categorias';
    case VER_CATEGORIAS = 'ver-categorias';

    // Permisos de proveedores
    case CREAR_PROVEEDORES = 'crear-proveedores';
    case EDITAR_PROVEEDORES = 'editar-proveedores';
    case ELIMINAR_PROVEEDORES = 'eliminar-proveedores';
    case VER_PROVEEDORES = 'ver-proveedores';

    // Permisos de ventas
    case CREAR_VENTAS = 'crear-ventas';
    case EDITAR_VENTAS = 'editar-ventas';
    case ELIMINAR_VENTAS = 'eliminar-ventas';
    case VER_VENTAS = 'ver-ventas';

    // Permisos de compras
    case CREAR_COMPRAS = 'crear-compras';
    case EDITAR_COMPRAS = 'editar-compras';
    case ELIMINAR_COMPRAS = 'eliminar-compras';
    case VER_COMPRAS = 'ver-compras';

    // Permisos de carrito de compras
    case GESTIONAR_CARRITO = 'gestionar-carrito';
    case REALIZAR_COMPRAS = 'realizar-compras';

    // Permisos de PQRS
    case CREAR_PQRS = 'crear-pqrs';
    case RESPONDER_PQRS = 'responder-pqrs';
    case VER_PQRS = 'ver-pqrs';

    // Permisos de promociones
    case CREAR_PROMOCIONES = 'crear-promociones';
    case EDITAR_PROMOCIONES = 'editar-promociones';
    case ELIMINAR_PROMOCIONES = 'eliminar-promociones';
    case VER_PROMOCIONES = 'ver-promociones';

    // Permisos de ajustes de inventario
    case CREAR_AJUSTES_INVENTARIO = 'crear-ajustes-inventario';
    case APROBAR_AJUSTES_INVENTARIO = 'aprobar-ajustes-inventario';
    case VER_AJUSTES_INVENTARIO = 'ver-ajustes-inventario';

    // Permisos generales del sistema
    case ACCESO_DASHBOARD = 'acceso-dashboard';
    case VER_REPORTES = 'ver-reportes';
    case ACCESO_ECOMMERCE = 'acceso-ecommerce';

    /**
     * Obtiene todos los valores de los permisos
     *
     * @return array<string>
     */
    public static function values(): array
    {
        return array_map(fn(self $permission) => $permission->value, self::cases());
    }

    /**
     * Obtiene permisos agrupados por categoría
     *
     * @return array<string, array<string>>
     */
    public static function groupedPermissions(): array
    {
        return [
            'Usuarios' => [
                self::CREAR_USUARIOS->value,
                self::EDITAR_USUARIOS->value,
                self::ELIMINAR_USUARIOS->value,
                self::VER_USUARIOS->value,
            ],
            'Clientes' => [
                self::CREAR_CLIENTES->value,
                self::EDITAR_CLIENTES->value,
                self::ELIMINAR_CLIENTES->value,
                self::VER_CLIENTES->value,
            ],
            'Administrativos' => [
                self::CREAR_ADMINISTRATIVOS->value,
                self::EDITAR_ADMINISTRATIVOS->value,
                self::ELIMINAR_ADMINISTRATIVOS->value,
                self::VER_ADMINISTRATIVOS->value,
            ],
            'Productos' => [
                self::CREAR_PRODUCTOS->value,
                self::EDITAR_PRODUCTOS->value,
                self::ELIMINAR_PRODUCTOS->value,
                self::VER_PRODUCTOS->value,
                self::GESTIONAR_INVENTARIO->value,
            ],
            'Categorías' => [
                self::CREAR_CATEGORIAS->value,
                self::EDITAR_CATEGORIAS->value,
                self::ELIMINAR_CATEGORIAS->value,
                self::VER_CATEGORIAS->value,
            ],
            'Proveedores' => [
                self::CREAR_PROVEEDORES->value,
                self::EDITAR_PROVEEDORES->value,
                self::ELIMINAR_PROVEEDORES->value,
                self::VER_PROVEEDORES->value,
            ],
            'Ventas' => [
                self::CREAR_VENTAS->value,
                self::EDITAR_VENTAS->value,
                self::ELIMINAR_VENTAS->value,
                self::VER_VENTAS->value,
            ],
            'Compras' => [
                self::CREAR_COMPRAS->value,
                self::EDITAR_COMPRAS->value,
                self::ELIMINAR_COMPRAS->value,
                self::VER_COMPRAS->value,
            ],
            'Promociones' => [
                self::CREAR_PROMOCIONES->value,
                self::EDITAR_PROMOCIONES->value,
                self::ELIMINAR_PROMOCIONES->value,
                self::VER_PROMOCIONES->value,
            ],
            'Sistema' => [
                self::GESTIONAR_ROLES->value,
                self::GESTIONAR_PERMISOS->value,
                self::ACCESO_DASHBOARD->value,
                self::VER_REPORTES->value,
                self::ACCESO_ECOMMERCE->value,
            ],
        ];
    }

    /**
     * Obtiene la etiqueta legible del permiso
     */
    public function label(): string
    {
        return match ($this) {
            // Usuarios
            self::CREAR_USUARIOS => 'Crear Usuarios',
            self::EDITAR_USUARIOS => 'Editar Usuarios',
            self::ELIMINAR_USUARIOS => 'Eliminar Usuarios',
            self::VER_USUARIOS => 'Ver Usuarios',
            
            // Clientes
            self::CREAR_CLIENTES => 'Crear Clientes',
            self::EDITAR_CLIENTES => 'Editar Clientes',
            self::ELIMINAR_CLIENTES => 'Eliminar Clientes',
            self::VER_CLIENTES => 'Ver Clientes',
            
            // Administrativos
            self::CREAR_ADMINISTRATIVOS => 'Crear Administrativos',
            self::EDITAR_ADMINISTRATIVOS => 'Editar Administrativos',
            self::ELIMINAR_ADMINISTRATIVOS => 'Eliminar Administrativos',
            self::VER_ADMINISTRATIVOS => 'Ver Administrativos',
            
            // Productos
            self::CREAR_PRODUCTOS => 'Crear Productos',
            self::EDITAR_PRODUCTOS => 'Editar Productos',
            self::ELIMINAR_PRODUCTOS => 'Eliminar Productos',
            self::VER_PRODUCTOS => 'Ver Productos',
            self::GESTIONAR_INVENTARIO => 'Gestionar Inventario',
            
            // Categorías
            self::CREAR_CATEGORIAS => 'Crear Categorías',
            self::EDITAR_CATEGORIAS => 'Editar Categorías',
            self::ELIMINAR_CATEGORIAS => 'Eliminar Categorías',
            self::VER_CATEGORIAS => 'Ver Categorías',
            
            // Proveedores
            self::CREAR_PROVEEDORES => 'Crear Proveedores',
            self::EDITAR_PROVEEDORES => 'Editar Proveedores',
            self::ELIMINAR_PROVEEDORES => 'Eliminar Proveedores',
            self::VER_PROVEEDORES => 'Ver Proveedores',
            
            // Ventas
            self::CREAR_VENTAS => 'Crear Ventas',
            self::EDITAR_VENTAS => 'Editar Ventas',
            self::ELIMINAR_VENTAS => 'Eliminar Ventas',
            self::VER_VENTAS => 'Ver Ventas',
            
            // Compras
            self::CREAR_COMPRAS => 'Crear Compras',
            self::EDITAR_COMPRAS => 'Editar Compras',
            self::ELIMINAR_COMPRAS => 'Eliminar Compras',
            self::VER_COMPRAS => 'Ver Compras',
            
            // Otros
            self::GESTIONAR_CARRITO => 'Gestionar Carrito',
            self::REALIZAR_COMPRAS => 'Realizar Compras',
            self::CREAR_PQRS => 'Crear PQRS',
            self::RESPONDER_PQRS => 'Responder PQRS',
            self::VER_PQRS => 'Ver PQRS',
            self::CREAR_PROMOCIONES => 'Crear Promociones',
            self::EDITAR_PROMOCIONES => 'Editar Promociones',
            self::ELIMINAR_PROMOCIONES => 'Eliminar Promociones',
            self::VER_PROMOCIONES => 'Ver Promociones',
            self::CREAR_AJUSTES_INVENTARIO => 'Crear Ajustes de Inventario',
            self::APROBAR_AJUSTES_INVENTARIO => 'Aprobar Ajustes de Inventario',
            self::VER_AJUSTES_INVENTARIO => 'Ver Ajustes de Inventario',
            self::GESTIONAR_ROLES => 'Gestionar Roles',
            self::GESTIONAR_PERMISOS => 'Gestionar Permisos',
            self::ACCESO_DASHBOARD => 'Acceso al Dashboard',
            self::VER_REPORTES => 'Ver Reportes',
            self::ACCESO_ECOMMERCE => 'Acceso al E-commerce',
        };
    }
} 