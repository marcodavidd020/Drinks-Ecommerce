import { Head, Link } from '@inertiajs/react';
import { useAppModeText } from '@/hooks/useAppModeText';
import DashboardLayout from '@/layouts/DashboardLayout';
import { formatCurrency } from '@/lib/currency';

interface Cliente {
    id: number;
    nit: string;
    nombre: string;
    email: string;
    celular?: string;
}

interface Estadisticas {
    total_compras: number;
    total_gastado: number;
    productos_en_carrito: number;
    valor_carrito: number;
}

interface ProductoPreview {
    nombre: string;
    cantidad: number;
    precio: number;
}

interface CarritoActivo {
    id: number;
    total: number;
    total_productos: number;
    productos_preview: ProductoPreview[];
}

interface CompraPreview {
    id: number;
    fecha: string;
    total: number;
    estado: string;
    productos_count: number;
    productos: { nombre: string; cantidad: number; }[];
}

interface ClienteDashboardProps {
    cliente: Cliente;
    estadisticas: Estadisticas;
    carrito_activo: CarritoActivo | null;
    ultimas_compras: CompraPreview[];
}

export default function ClienteDashboard({ 
    cliente, 
    estadisticas, 
    carrito_activo, 
    ultimas_compras 
}: ClienteDashboardProps) {
    const { getTextByMode } = useAppModeText();

    return (
        <DashboardLayout>
            <Head title={getTextByMode({
                niños: '🏠 Mi BebiFresh',
                jóvenes: 'Mi Dashboard - BebiFresh',
                adultos: 'Dashboard Cliente - BebiFresh'
            })} />

            <div className="space-y-6">
                {/* Bienvenida */}
                <div className="bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-600 dark:to-blue-700 rounded-lg shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold mb-2">
                                {getTextByMode({
                                    niños: `🧃 ¡Hola ${cliente.nombre}!`,
                                    jóvenes: `¡Bienvenido ${cliente.nombre}! 💧`,
                                    adultos: `Bienvenido, ${cliente.nombre}`
                                })}
                            </h1>
                            <p className="text-cyan-100 dark:text-cyan-200">
                                {getTextByMode({
                                    niños: '¡Descubre las bebidas más refrescantes! 🌟',
                                    jóvenes: 'Tu tienda de bebidas favorita te espera',
                                    adultos: 'Gestiona tu cuenta y descubre nuevos productos'
                                })}
                            </p>
                        </div>
                        <div className="text-6xl opacity-20">
                            🧃
                        </div>
                    </div>
                </div>

                {/* Estadísticas principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-cyan-500 dark:border-cyan-400">
                        <div className="flex items-center">
                            <div className="text-3xl mr-3">🛒</div>
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    {getTextByMode({
                                        niños: 'En mi carrito',
                                        jóvenes: 'Productos en carrito',
                                        adultos: 'Productos en carrito'
                                    })}
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {estadisticas.productos_en_carrito}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-green-500 dark:border-green-400">
                        <div className="flex items-center">
                            <div className="text-3xl mr-3">💰</div>
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    {getTextByMode({
                                        niños: 'Valor del carrito',
                                        jóvenes: 'Total carrito',
                                        adultos: 'Valor total carrito'
                                    })}
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {formatCurrency(estadisticas.valor_carrito)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-blue-500 dark:border-blue-400">
                        <div className="flex items-center">
                            <div className="text-3xl mr-3">📦</div>
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    {getTextByMode({
                                        niños: 'Mis compras',
                                        jóvenes: 'Total compras',
                                        adultos: 'Compras realizadas'
                                    })}
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {estadisticas.total_compras}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-purple-500 dark:border-purple-400">
                        <div className="flex items-center">
                            <div className="text-3xl mr-3">🌟</div>
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    {getTextByMode({
                                        niños: 'Total gastado',
                                        jóvenes: 'Dinero gastado',
                                        adultos: 'Total invertido'
                                    })}
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {formatCurrency(estadisticas.total_gastado)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Carrito actual */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    {getTextByMode({
                                        niños: '🛒 Mi Carrito Actual',
                                        jóvenes: 'Carrito Actual',
                                        adultos: 'Carrito de Compras'
                                    })}
                                </h2>
                                <Link
                                    href="/carrito"
                                    className="text-cyan-600 hover:text-cyan-800 dark:text-cyan-400 dark:hover:text-cyan-200 text-sm font-medium"
                                >
                                    {getTextByMode({
                                        niños: 'Ver todo',
                                        jóvenes: 'Ver carrito',
                                        adultos: 'Ver carrito completo'
                                    })}
                                </Link>
                            </div>
                        </div>

                        <div className="p-6">
                            {carrito_activo && carrito_activo.productos_preview.length > 0 ? (
                                <div className="space-y-4">
                                    {carrito_activo.productos_preview.map((producto, index) => (
                                        <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                                            <div className="flex items-center">
                                                <div className="text-2xl mr-3">🧃</div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                                        {producto.nombre}
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        Cantidad: {producto.cantidad}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-gray-900 dark:text-gray-100">
                                                    {formatCurrency(producto.precio * producto.cantidad)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold text-gray-900 dark:text-gray-100">
                                                Total: {formatCurrency(carrito_activo.total)}
                                            </span>
                                            <Link
                                                href="/carrito"
                                                className="bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-md hover:shadow-lg"
                                            >
                                                {getTextByMode({
                                                    niños: '🛒 Ir al carrito',
                                                    jóvenes: 'Ver carrito',
                                                    adultos: 'Gestionar carrito'
                                                })}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="text-6xl mb-4 opacity-50">🛒</div>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        {getTextByMode({
                                            niños: '¡Tu carrito está vacío! Vamos a llenarlo de bebidas ricas 🧃',
                                            jóvenes: 'Tu carrito está vacío. ¡Descubre nuevos productos!',
                                            adultos: 'No tienes productos en el carrito'
                                        })}
                                    </p>
                                    <Link
                                        href="/"
                                        className="mt-4 inline-flex items-center px-4 py-2 bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-600 text-white rounded-md transition-colors shadow-md hover:shadow-lg"
                                    >
                                        {getTextByMode({
                                            niños: '🧃 Explorar bebidas',
                                            jóvenes: 'Explorar productos',
                                            adultos: 'Explorar productos'
                                        })}
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Últimas compras */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    {getTextByMode({
                                        niños: '📦 Mis Últimas Compras',
                                        jóvenes: 'Últimas Compras',
                                        adultos: 'Historial Reciente'
                                    })}
                                </h2>
                                <Link
                                    href="/cliente/compras"
                                    className="text-cyan-600 hover:text-cyan-800 dark:text-cyan-400 dark:hover:text-cyan-200 text-sm font-medium"
                                >
                                    {getTextByMode({
                                        niños: 'Ver todas',
                                        jóvenes: 'Ver historial',
                                        adultos: 'Ver historial completo'
                                    })}
                                </Link>
                            </div>
                        </div>

                        <div className="p-6">
                            {ultimas_compras.length > 0 ? (
                                <div className="space-y-4">
                                    {ultimas_compras.map((compra) => (
                                        <div key={compra.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center">
                                                    <div className="text-2xl mr-3">📦</div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-gray-100">
                                                            Compra #{compra.id}
                                                        </p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            {new Date(compra.fecha).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                                                        {formatCurrency(compra.total)}
                                                    </p>
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        compra.estado === 'completada'
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                                    }`}>
                                                        {compra.estado}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                {compra.productos.slice(0, 2).map((producto, index) => (
                                                    <span key={index}>
                                                        {producto.nombre} (x{producto.cantidad})
                                                        {index < Math.min(compra.productos.length, 2) - 1 && ', '}
                                                    </span>
                                                ))}
                                                {compra.productos.length > 2 && (
                                                    <span> y {compra.productos.length - 2} más...</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="text-6xl mb-4 opacity-50">📦</div>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        {getTextByMode({
                                            niños: 'Aún no has hecho compras. ¡Es hora de probar bebidas deliciosas! 🌟',
                                            jóvenes: 'No tienes compras aún. ¡Explora nuestros productos!',
                                            adultos: 'No tienes historial de compras'
                                        })}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Acciones rápidas */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                        {getTextByMode({
                            niños: '⚡ Acciones Rápidas',
                            jóvenes: 'Acciones Rápidas',
                            adultos: 'Acciones Disponibles'
                        })}
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link
                            href="/"
                            className="flex items-center p-4 border-2 border-cyan-200 dark:border-cyan-700 rounded-lg hover:bg-cyan-50 dark:hover:bg-cyan-900/20 hover:border-cyan-300 dark:hover:border-cyan-600 transition-all duration-200"
                        >
                            <div className="text-3xl mr-4">🧃</div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                    {getTextByMode({
                                        niños: 'Explorar Bebidas',
                                        jóvenes: 'Ver Productos',
                                        adultos: 'Catálogo de Productos'
                                    })}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {getTextByMode({
                                        niños: 'Descubre bebidas increíbles',
                                        jóvenes: 'Encuentra tus favoritas',
                                        adultos: 'Explora nuestro catálogo'
                                    })}
                                </p>
                            </div>
                        </Link>

                        <Link
                            href="/carrito"
                            className="flex items-center p-4 border-2 border-green-200 dark:border-green-700 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-300 dark:hover:border-green-600 transition-all duration-200"
                        >
                            <div className="text-3xl mr-4">🛒</div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                    {getTextByMode({
                                        niños: 'Ver Mi Carrito',
                                        jóvenes: 'Gestionar Carrito',
                                        adultos: 'Revisar Carrito'
                                    })}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {getTextByMode({
                                        niños: 'Revisa tus bebidas elegidas',
                                        jóvenes: 'Finaliza tu compra',
                                        adultos: 'Gestiona tus productos'
                                    })}
                                </p>
                            </div>
                        </Link>

                        <Link
                            href="/cliente/compras"
                            className="flex items-center p-4 border-2 border-blue-200 dark:border-blue-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200"
                        >
                            <div className="text-3xl mr-4">📦</div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                    {getTextByMode({
                                        niños: 'Mis Compras',
                                        jóvenes: 'Historial',
                                        adultos: 'Historial de Compras'
                                    })}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {getTextByMode({
                                        niños: 'Ve todas tus compras',
                                        jóvenes: 'Revisa tus pedidos',
                                        adultos: 'Consulta tu historial'
                                    })}
                                </p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}