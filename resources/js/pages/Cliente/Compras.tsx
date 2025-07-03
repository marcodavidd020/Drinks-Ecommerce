import { Head, Link } from '@inertiajs/react';
import { useAppModeText } from '@/hooks/useAppModeText';
import DashboardLayout from '@/layouts/DashboardLayout';
import { formatCurrency } from '@/lib/currency';

interface Producto {
    id: number;
    nombre: string;
    categoria: string;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
    imagen?: string;
}

interface Compra {
    id: number;
    fecha: string;
    total: number;
    estado: string;
    productos: Producto[];
}

interface ComprasProps {
    compras: {
        data: Compra[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
}

export default function ClienteCompras({ compras }: ComprasProps) {
    const { getTextByMode } = useAppModeText();

    const getEstadoBadge = (estado: string) => {
        const estadoMap = {
            'completada': {
                text: getTextByMode({
                    niños: '✅ Completa',
                    jóvenes: '✅ Completada',
                    adultos: 'Completada'
                }),
                color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            },
            'pendiente': {
                text: getTextByMode({
                    niños: '⏳ Pendiente',
                    jóvenes: '⏳ Pendiente',
                    adultos: 'Pendiente'
                }),
                color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
            },
            'cancelada': {
                text: getTextByMode({
                    niños: '❌ Cancelada',
                    jóvenes: '❌ Cancelada',
                    adultos: 'Cancelada'
                }),
                color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }
        };

        const estadoInfo = estadoMap[estado as keyof typeof estadoMap] || {
            text: estado,
            color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
        };

        return (
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${estadoInfo.color}`}>
                {estadoInfo.text}
            </span>
        );
    };

    const formatFecha = (fecha: string) => {
        return new Date(fecha).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <DashboardLayout>
            <Head title={getTextByMode({
                niños: '📦 Mis Compras BebiFresh',
                jóvenes: 'Historial de Compras',
                adultos: 'Historial de Compras - BebiFresh'
            })} />

            <div className="space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold mb-2">
                                {getTextByMode({
                                    niños: '📦 Mis Compras de Bebidas',
                                    jóvenes: 'Historial de Compras',
                                    adultos: 'Historial de Compras'
                                })}
                            </h1>
                            <p className="text-emerald-100">
                                {getTextByMode({
                                    niños: `¡Tienes ${compras.total} compras de bebidas deliciosas! 🧃`,
                                    jóvenes: `${compras.total} compras realizadas`,
                                    adultos: `${compras.total} compras en total`
                                })}
                            </p>
                        </div>
                        <div className="text-6xl opacity-20">
                            📦
                        </div>
                    </div>
                </div>

                {/* Botón de regreso */}
                <div className="flex items-center justify-between">
                    <Link
                        href="/cliente/dashboard"
                        className="inline-flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        {getTextByMode({
                            niños: '🏠 Volver al Dashboard',
                            jóvenes: 'Volver al Dashboard',
                            adultos: 'Regresar al Dashboard'
                        })}
                    </Link>

                    <Link
                        href="/"
                        className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        {getTextByMode({
                            niños: '🧃 Comprar Más Bebidas',
                            jóvenes: 'Seguir Comprando',
                            adultos: 'Continuar Comprando'
                        })}
                    </Link>
                </div>

                {/* Lista de compras */}
                {compras.data.length > 0 ? (
                    <div className="space-y-4">
                        {compras.data.map((compra) => (
                            <div key={compra.id} className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-4 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                    {getTextByMode({
                                                        niños: `🧾 Compra #${compra.id}`,
                                                        jóvenes: `Pedido #${compra.id}`,
                                                        adultos: `Compra #${compra.id}`
                                                    })}
                                                </h3>
                                                {getEstadoBadge(compra.estado)}
                                            </div>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                {formatFecha(compra.fecha)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                                {formatCurrency(compra.total)}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {compra.productos.length} {getTextByMode({
                                                    niños: 'productos',
                                                    jóvenes: 'productos',
                                                    adultos: 'productos'
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Productos preview */}
                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {compra.productos.slice(0, 3).map((producto, index) => (
                                                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                    <div className="flex-shrink-0">
                                                        {producto.imagen ? (
                                                            <img 
                                                                src={producto.imagen} 
                                                                alt={producto.nombre}
                                                                className="w-12 h-12 object-cover rounded-lg"
                                                            />
                                                        ) : (
                                                            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center">
                                                                <span className="text-emerald-600 dark:text-emerald-300 text-lg">🧃</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                                            {producto.nombre}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            {producto.cantidad}x {formatCurrency(producto.precio_unitario)}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                            {compra.productos.length > 3 && (
                                                <div className="flex items-center justify-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                                        +{compra.productos.length - 3} {getTextByMode({
                                                            niños: 'más',
                                                            jóvenes: 'más',
                                                            adultos: 'más productos'
                                                        })}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex justify-end mt-4">
                                            <Link
                                                href={`/cliente/compras/${compra.id}`}
                                                className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
                                            >
                                                {getTextByMode({
                                                    niños: '👀 Ver Detalles',
                                                    jóvenes: 'Ver Detalle',
                                                    adultos: 'Ver Detalle Completo'
                                                })}
                                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Paginación */}
                        {compras.last_page > 1 && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {getTextByMode({
                                            niños: `Mostrando ${compras.data.length} de ${compras.total} compras`,
                                            jóvenes: `${compras.data.length} de ${compras.total} compras`,
                                            adultos: `Mostrando ${compras.data.length} de ${compras.total} resultados`
                                        })}
                                    </div>
                                    
                                    <div className="flex space-x-2">
                                        {compras.links.map((link, index) => (
                                            link.url ? (
                                                <Link
                                                    key={index}
                                                    href={link.url}
                                                    className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                                                        link.active
                                                            ? 'bg-emerald-600 text-white border-emerald-600'
                                                            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                                                    }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ) : (
                                                <span
                                                    key={index}
                                                    className="px-3 py-2 text-sm text-gray-400 dark:text-gray-500 border border-gray-300 dark:border-gray-600 rounded-lg"
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            )
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Sin compras */
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
                        <div className="text-8xl mb-6 opacity-50">📦</div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                            {getTextByMode({
                                niños: '¡Aún no has hecho compras!',
                                jóvenes: 'Sin compras realizadas',
                                adultos: 'No hay compras registradas'
                            })}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-8">
                            {getTextByMode({
                                niños: 'Es hora de probar las bebidas más deliciosas de BebiFresh 🧃✨',
                                jóvenes: 'Descubre nuestras bebidas refrescantes y haz tu primera compra',
                                adultos: 'Explore nuestro catálogo y realice su primera compra'
                            })}
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 hover:scale-[1.02]"
                        >
                            {getTextByMode({
                                niños: '🧃 Explorar Bebidas',
                                jóvenes: 'Explorar Productos',
                                adultos: 'Ver Catálogo'
                            })}
                        </Link>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
} 