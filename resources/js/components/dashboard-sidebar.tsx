import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function DashboardSidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { url } = usePage();

    const menuItems = [
        {
            group: 'DASHBOARD',
            items: [
                { name: 'Inicio', href: '/dashboard', icon: '📊' },
                { name: 'Estadísticas', href: '/dashboard/stats', icon: '📈' },
            ]
        },
        {
            group: 'GESTIÓN',
            items: [
                { name: 'Usuarios', href: '/users', icon: '👥' },
                { name: 'Clientes', href: '/clientes', icon: '👨‍💼' },
                { name: 'Proveedores', href: '/proveedores', icon: '🏭' },
            ]
        },
        {
            group: 'INVENTARIO',
            items: [
                { name: 'Productos', href: '/productos', icon: '📦' },
                { name: 'Categorías', href: '/categorias', icon: '📋' },
                { name: 'Almacenes', href: '/almacenes', icon: '🏪' },
                { name: 'Inventarios', href: '/inventarios', icon: '📊' },
            ]
        },
        {
            group: 'VENTAS',
            items: [
                { name: 'Ventas', href: '/ventas', icon: '💰' },
                { name: 'Promociones', href: '/promociones', icon: '🎉' },
                { name: 'Carritos', href: '/carritos', icon: '🛒' },
            ]
        },
        {
            group: 'COMPRAS',
            items: [
                { name: 'Compras', href: '/compras', icon: '📋' },
                { name: 'Órdenes', href: '/ordenes', icon: '📄' },
            ]
        },
        {
            group: 'REPORTES',
            items: [
                { name: 'Reportes', href: '/reports', icon: '📈' },
                { name: 'PQRS', href: '/pqrs', icon: '📞' },
            ]
        },
        {
            group: 'CONFIGURACIÓN',
            items: [
                { name: 'Roles', href: '/admin/roles', icon: '🔐' },
                { name: 'Permisos', href: '/admin/permissions', icon: '🗝️' },
                { name: 'Configuración', href: '/settings', icon: '⚙️' },
            ]
        }
    ];

    const isCurrentRoute = (href: string) => {
        if (href === '/dashboard') {
            return url === '/dashboard';
        }
        return url.startsWith(href);
    };

    return (
        <div className={`bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ${
            isCollapsed ? 'w-16' : 'w-64'
        }`}>
            <div className="flex flex-col h-full">
                {/* Header del Sidebar */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    {!isCollapsed && (
                        <h2 className="text-adaptive text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Menú Principal
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
                    {menuItems.map((group) => (
                        <div key={group.group}>
                            {!isCollapsed && (
                                <h3 className="text-adaptive text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
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
                                            <span className="text-adaptive truncate">
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
                        title={isCollapsed ? 'Volver al Inicio' : undefined}
                    >
                        <span className="text-lg mr-3">🏠</span>
                        {!isCollapsed && (
                            <span className="text-adaptive">
                                Volver al Inicio
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </div>
    );
} 