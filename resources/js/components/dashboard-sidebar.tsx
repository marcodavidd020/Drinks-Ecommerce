import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface User {
    id: number;
    nombre: string;
    email: string;
    permissions?: string[];
    roles?: { name: string }[];
}

interface AuthProps {
    user?: User;
}

export default function DashboardSidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { url, props } = usePage();
    
    // Obtener el usuario de las props de Inertia
    const user = (props.auth as AuthProps)?.user;

    // Verificar si el usuario tiene un permiso específico
    const hasPermission = (permission: string): boolean => {
        return user?.permissions?.includes(permission) || false;
    };

    // Verificar si el usuario tiene un rol específico
    const hasRole = (role: string): boolean => {
        return user?.roles?.some(r => r.name === role) || false;
    };

    // Verificar si tiene alguno de los roles especificados
    const hasAnyRole = (roles: string[]): boolean => {
        return roles.some(role => hasRole(role));
    };

    // Si es cliente solo, mostrar sidebar especial
    if (hasRole('cliente') && !hasAnyRole(['admin', 'empleado', 'organizador', 'vendedor', 'almacenista'])) {
        return (
            <div className={`bg-gradient-to-b from-cyan-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 shadow-lg transition-all duration-300 ${
                isCollapsed ? 'w-16' : 'w-64'
            }`}>
                <div className="flex flex-col h-full">
                    {/* Header del Sidebar Cliente */}
                    <div className="flex items-center justify-between p-4 border-b border-cyan-200 dark:border-gray-700">
                        {!isCollapsed && (
                            <h2 className="text-lg font-semibold text-cyan-900 dark:text-cyan-100">
                                🧃 BebiFresh
                            </h2>
                        )}
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="p-2 rounded-md text-cyan-600 hover:bg-cyan-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <svg 
                                className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                            </svg>
                        </button>
                    </div>

                    {/* Navegación del Cliente */}
                    <nav className="flex-1 overflow-y-auto p-4 space-y-4">
                        <div>
                            {!isCollapsed && (
                                <h3 className="text-xs font-medium text-cyan-600 dark:text-cyan-400 uppercase tracking-wider mb-3">
                                    MI CUENTA
                                </h3>
                            )}
                            <div className="space-y-1">
                                <Link
                                    href="/cliente/dashboard"
                                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                                        url === '/cliente/dashboard'
                                            ? 'bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-cyan-50 dark:hover:bg-gray-700 hover:text-cyan-900 dark:hover:text-cyan-100'
                                    }`}
                                    title={isCollapsed ? 'Mi Dashboard' : undefined}
                                >
                                    <span className="text-lg mr-3 flex-shrink-0">🏠</span>
                                    {!isCollapsed && <span className="truncate">Mi Dashboard</span>}
                                </Link>

                                <Link
                                    href="/carrito"
                                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                                        url.startsWith('/carrito')
                                            ? 'bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-cyan-50 dark:hover:bg-gray-700 hover:text-cyan-900 dark:hover:text-cyan-100'
                                    }`}
                                    title={isCollapsed ? 'Mi Carrito' : undefined}
                                >
                                    <span className="text-lg mr-3 flex-shrink-0">🛒</span>
                                    {!isCollapsed && <span className="truncate">Mi Carrito</span>}
                                </Link>

                                <Link
                                    href="/cliente/compras"
                                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                                        url.startsWith('/cliente/compras')
                                            ? 'bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-cyan-50 dark:hover:bg-gray-700 hover:text-cyan-900 dark:hover:text-cyan-100'
                                    }`}
                                    title={isCollapsed ? 'Mis Compras' : undefined}
                                >
                                    <span className="text-lg mr-3 flex-shrink-0">📦</span>
                                    {!isCollapsed && <span className="truncate">Mis Compras</span>}
                                </Link>
                            </div>
                        </div>

                        <div>
                            {!isCollapsed && (
                                <h3 className="text-xs font-medium text-cyan-600 dark:text-cyan-400 uppercase tracking-wider mb-3">
                                    TIENDA
                                </h3>
                            )}
                            <div className="space-y-1">
                                <Link
                                    href="/"
                                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-cyan-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                                    title={isCollapsed ? 'Explorar Productos' : undefined}
                                >
                                    <span className="text-lg mr-3">🧃</span>
                                    {!isCollapsed && <span className="truncate">Explorar Bebidas</span>}
                                </Link>
                            </div>
                        </div>
                    </nav>

                    {/* Footer del Sidebar Cliente */}
                    <div className="p-4 border-t border-cyan-200 dark:border-gray-700">
                        <Link
                            href="/"
                            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-cyan-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                            title={isCollapsed ? 'Inicio BebiFresh' : undefined}
                        >
                            <span className="text-lg mr-3">🌿</span>
                            {!isCollapsed && <span className="truncate">Inicio BebiFresh</span>}
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Sidebar para usuarios administrativos con permisos
    const menuItems = [
        {
            group: 'DASHBOARD',
            condition: () => hasAnyRole(['admin', 'empleado', 'organizador', 'vendedor', 'almacenista']),
            items: [
                { 
                    name: 'Inicio', 
                    href: '/dashboard', 
                    icon: '📊',
                    condition: () => hasAnyRole(['admin', 'empleado', 'organizador', 'vendedor', 'almacenista'])
                },
            ]
        },
        {
            group: 'GESTIÓN',
            condition: () => hasPermission('gestionar usuarios') || hasAnyRole(['admin', 'empleado', 'organizador']),
            items: [
                { 
                    name: 'Usuarios', 
                    href: '/users', 
                    icon: '👥',
                    condition: () => hasPermission('gestionar usuarios')
                },
                { 
                    name: 'Clientes', 
                    href: '/clientes', 
                    icon: '👨‍💼',
                    condition: () => hasAnyRole(['admin', 'empleado', 'organizador'])
                },
                { 
                    name: 'Proveedores', 
                    href: '/proveedores', 
                    icon: '🏭',
                    condition: () => hasAnyRole(['admin', 'empleado'])
                },
            ]
        },
        {
            group: 'INVENTARIO',
            condition: () => hasPermission('gestionar productos') || hasAnyRole(['admin', 'empleado', 'almacenista']),
            items: [
                { 
                    name: 'Productos', 
                    href: '/productos', 
                    icon: '🧃',
                    condition: () => hasPermission('gestionar productos')
                },
                { 
                    name: 'Categorías', 
                    href: '/categorias', 
                    icon: '📋',
                    condition: () => hasAnyRole(['admin', 'empleado'])
                },
                { 
                    name: 'Almacenes', 
                    href: '/almacenes', 
                    icon: '🏪',
                    condition: () => hasAnyRole(['admin', 'empleado', 'almacenista'])
                },
                { 
                    name: 'Inventarios', 
                    href: '/inventarios', 
                    icon: '📊',
                    condition: () => hasAnyRole(['admin', 'empleado', 'almacenista'])
                },
            ]
        },
        {
            group: 'VENTAS',
            condition: () => hasPermission('gestionar ventas') || hasPermission('gestionar promociones') || hasAnyRole(['admin', 'empleado', 'organizador', 'vendedor']),
            items: [
                { 
                    name: 'Ventas', 
                    href: '/ventas', 
                    icon: '💰',
                    condition: () => hasPermission('gestionar ventas')
                },
                { 
                    name: 'Promociones', 
                    href: '/promociones', 
                    icon: '🎉',
                    condition: () => hasPermission('gestionar promociones')
                },
            ]
        },
        {
            group: 'COMPRAS',
            condition: () => hasAnyRole(['admin', 'empleado']),
            items: [
                { 
                    name: 'Compras', 
                    href: '/compras', 
                    icon: '📋',
                    condition: () => hasAnyRole(['admin', 'empleado'])
                },
            ]
        },
        {
            group: 'REPORTES',
            condition: () => hasAnyRole(['admin', 'organizador']),
            items: [
                { 
                    name: 'Reportes', 
                    href: '/reports', 
                    icon: '📈',
                    condition: () => hasAnyRole(['admin', 'organizador'])
                },
            ]
        },
        {
            group: 'CONFIGURACIÓN',
            condition: () => hasRole('admin'),
            items: [
                { 
                    name: 'Roles', 
                    href: '/admin/roles', 
                    icon: '🔐',
                    condition: () => hasRole('admin')
                },
                { 
                    name: 'Permisos', 
                    href: '/admin/permissions', 
                    icon: '🗝️',
                    condition: () => hasRole('admin')
                },
                { 
                    name: 'Configuración', 
                    href: '/settings', 
                    icon: '⚙️',
                    condition: () => hasAnyRole(['admin', 'empleado', 'organizador'])
                },
            ]
        }
    ];

    const isCurrentRoute = (href: string) => {
        if (href === '/dashboard') {
            return url === '/dashboard';
        }
        return url.startsWith(href);
    };

    // Filtrar grupos y elementos según permisos
    const filteredMenuItems = menuItems
        .filter(group => group.condition())
        .map(group => ({
            ...group,
            items: group.items.filter(item => item.condition())
        }))
        .filter(group => group.items.length > 0);

    return (
        <div className={`bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ${
            isCollapsed ? 'w-16' : 'w-64'
        }`}>
            <div className="flex flex-col h-full">
                {/* Header del Sidebar */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    {!isCollapsed && (
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            🧃 BebiFresh Admin
                        </h2>
                    )}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <svg 
                            className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                        </svg>
                    </button>
                </div>

                {/* Navegación */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-6">
                    {filteredMenuItems.map((group) => (
                        <div key={group.group}>
                            {!isCollapsed && (
                                <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                                    {group.group}
                                </h3>
                            )}
                            <div className="space-y-1">
                                {group.items.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                                            isCurrentRoute(item.href)
                                                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                                        }`}
                                        title={isCollapsed ? item.name : undefined}
                                    >
                                        <span className="text-lg mr-3 flex-shrink-0">
                                            {item.icon}
                                        </span>
                                        {!isCollapsed && (
                                            <span className="truncate">
                                                {item.name}
                                            </span>
                                        )}
                                        {isCurrentRoute(item.href) && (
                                            <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Footer del Sidebar */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <Link
                        href="/"
                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                        title={isCollapsed ? 'Volver a BebiFresh' : undefined}
                    >
                        <span className="text-lg mr-3">🌿</span>
                        {!isCollapsed && (
                            <span className="truncate">
                                Volver a BebiFresh
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </div>
    );
}