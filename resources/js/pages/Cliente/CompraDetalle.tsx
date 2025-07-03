import { Head, Link } from '@inertiajs/react';
import { useAppModeText } from '@/hooks/useAppModeText';
import DashboardLayout from '@/layouts/DashboardLayout';
import { formatCurrency } from '@/lib/currency';

interface Producto {
    id: number;
    nombre: string;
    descripcion?: string;
    categoria: string;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
    imagen?: string;
}

interface Venta {
    id: number;
    fecha: string;
    total: number;
    estado: string;
    observaciones?: string;
    productos: Producto[];
}

interface CompraDetalleProps {
    venta: Venta;
}

export default function ClienteCompraDetalle({ venta }: CompraDetalleProps) {
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
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${estadoInfo.color}`}>
                {estadoInfo.text}
            </span>
        );
    };

    const formatFecha = (fecha: string) => {
        return new Date(fecha).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const totalProductos = venta.productos.reduce((sum, producto) => sum + producto.cantidad, 0);

    return (
        <DashboardLayout>
            <Head title={getTextByMode({
                niños: `🧾 Compra #${venta.id} - BebiFresh`,
                jóvenes: `Detalle Compra #${venta.id}`,
                adultos: `Detalle de Compra #${venta.id} - BebiFresh`
            })} />

            <div className="space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold mb-2">
                                {getTextByMode({
                                    niños: `🧾 Detalle de mi Compra #${venta.id}`,
                                    jóvenes: `Compra #${venta.id}`,
                                    adultos: `Detalle de Compra #${venta.id}`
                                })}
                            </h1>
                            <div className="flex items-center space-x-4">
                                <p className="text-emerald-100">
                                    {formatFecha(venta.fecha)}
                                </p>
                                <div className="bg-white/20 rounded-full px-3 py-1">
                                    {getEstadoBadge(venta.estado)}
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-4xl font-bold mb-1">
                                {formatCurrency(venta.total)}
                            </div>
                            <p className="text-emerald-100 text-sm">
                                {totalProductos} {getTextByMode({
                                    niños: 'bebidas',
                                    jóvenes: 'productos',
                                    adultos: 'productos'
                                })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navegación */}
                <div className="flex items-center justify-between">
                    <Link
                        href="/cliente/compras"
                        className="inline-flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        {getTextByMode({
                            niños: '📦 Volver a Mis Compras',
                            jóvenes: 'Volver a Compras',
                            adultos: 'Volver al Historial'
                        })}
                    </Link>

                    <div className="flex space-x-3">
                        <Link
                            href="/cliente/dashboard"
                            className="inline-flex items-center px-4 py-2 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900 dark:hover:bg-emerald-800 text-emerald-700 dark:text-emerald-200 rounded-lg transition-colors"
                        >
                            🏠 Dashboard
                        </Link>
                        <Link
                            href="/"
                            className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            {getTextByMode({
                                niños: '🧃 Comprar Más',
                                jóvenes: 'Seguir Comprando',
                                adultos: 'Continuar Comprando'
                            })}
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Lista de productos */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    {getTextByMode({
                                        niños: '🧃 Bebidas de mi Compra',
                                        jóvenes: 'Productos Comprados',
                                        adultos: 'Detalle de Productos'
                                    })}
                                </h2>
                            </div>

                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                {venta.productos.map((producto, index) => (
                                    <div key={index} className="p-6">
                                        <div className="flex items-start space-x-4">
                                            <div className="flex-shrink-0">
                                                {producto.imagen ? (
                                                    <img 
                                                        src={producto.imagen} 
                                                        alt={producto.nombre}
                                                        className="w-20 h-20 object-cover rounded-lg"
                                                    />
                                                ) : (
                                                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center">
                                                        <span className="text-emerald-600 dark:text-emerald-300 text-2xl">🧃</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                                                            {producto.nombre}
                                                        </h3>
                                                        <p className="text-sm text-emerald-600 dark:text-emerald-400 mb-2">
                                                            {producto.categoria}
                                                        </p>
                                                        {producto.descripcion && (
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                                                {producto.descripcion}
                                                            </p>
                                                        )}
                                                        <div className="flex items-center space-x-4 text-sm">
                                                            <span className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                                                                {getTextByMode({
                                                                    niños: `${producto.cantidad} unidades`,
                                                                    jóvenes: `Cantidad: ${producto.cantidad}`,
                                                                    adultos: `Cantidad: ${producto.cantidad}`
                                                                })}
                                                            </span>
                                                            <span className="text-gray-500 dark:text-gray-400">
                                                                {formatCurrency(producto.precio_unitario)} c/u
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right ml-4">
                                                        <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                                                            {formatCurrency(producto.subtotal)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Resumen de la compra */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow sticky top-6">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    {getTextByMode({
                                        niños: '📋 Resumen de mi Compra',
                                        jóvenes: 'Resumen de Compra',
                                        adultos: 'Resumen del Pedido'
                                    })}
                                </h2>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400">
                                        {getTextByMode({
                                            niños: 'Número de compra:',
                                            jóvenes: 'N° de Pedido:',
                                            adultos: 'Número de compra:'
                                        })}
                                    </span>
                                    <span className="font-medium text-gray-900 dark:text-gray-100">
                                        #{venta.id}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400">
                                        {getTextByMode({
                                            niños: 'Fecha:',
                                            jóvenes: 'Fecha:',
                                            adultos: 'Fecha de compra:'
                                        })}
                                    </span>
                                    <span className="font-medium text-gray-900 dark:text-gray-100">
                                        {new Date(venta.fecha).toLocaleDateString('es-CO')}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400">
                                        {getTextByMode({
                                            niños: 'Estado:',
                                            jóvenes: 'Estado:',
                                            adultos: 'Estado:'
                                        })}
                                    </span>
                                    {getEstadoBadge(venta.estado)}
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400">
                                        {getTextByMode({
                                            niños: 'Total productos:',
                                            jóvenes: 'Total productos:',
                                            adultos: 'Cantidad de productos:'
                                        })}
                                    </span>
                                    <span className="font-medium text-gray-900 dark:text-gray-100">
                                        {totalProductos}
                                    </span>
                                </div>

                                <hr className="border-gray-200 dark:border-gray-700" />

                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        {getTextByMode({
                                            niños: 'Total pagado:',
                                            jóvenes: 'Total:',
                                            adultos: 'Total pagado:'
                                        })}
                                    </span>
                                    <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                                        {formatCurrency(venta.total)}
                                    </span>
                                </div>

                                {venta.observaciones && (
                                    <>
                                        <hr className="border-gray-200 dark:border-gray-700" />
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                                                {getTextByMode({
                                                    niños: '📝 Notas especiales:',
                                                    jóvenes: 'Observaciones:',
                                                    adultos: 'Observaciones:'
                                                })}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                                {venta.observaciones}
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Acciones adicionales */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                        {getTextByMode({
                            niños: '🎯 ¿Qué quieres hacer ahora?',
                            jóvenes: 'Acciones Disponibles',
                            adultos: 'Opciones Adicionales'
                        })}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link
                            href="/"
                            className="flex items-center p-4 border-2 border-emerald-200 dark:border-emerald-700 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                        >
                            <div className="text-3xl mr-4">🧃</div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                    {getTextByMode({
                                        niños: 'Comprar Más Bebidas',
                                        jóvenes: 'Seguir Comprando',
                                        adultos: 'Continuar Comprando'
                                    })}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {getTextByMode({
                                        niños: 'Descubre más sabores',
                                        jóvenes: 'Explora más productos',
                                        adultos: 'Ver catálogo completo'
                                    })}
                                </p>
                            </div>
                        </Link>

                        <Link
                            href="/carrito"
                            className="flex items-center p-4 border-2 border-cyan-200 dark:border-cyan-700 rounded-lg hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-colors"
                        >
                            <div className="text-3xl mr-4">🛒</div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                    {getTextByMode({
                                        niños: 'Ver Mi Carrito',
                                        jóvenes: 'Ir al Carrito',
                                        adultos: 'Ver Carrito'
                                    })}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {getTextByMode({
                                        niños: 'Revisar tus bebidas',
                                        jóvenes: 'Revisar productos',
                                        adultos: 'Revisar productos pendientes'
                                    })}
                                </p>
                            </div>
                        </Link>

                        <Link
                            href="/cliente/compras"
                            className="flex items-center p-4 border-2 border-purple-200 dark:border-purple-700 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                        >
                            <div className="text-3xl mr-4">📦</div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                    {getTextByMode({
                                        niños: 'Mis Otras Compras',
                                        jóvenes: 'Otras Compras',
                                        adultos: 'Historial Completo'
                                    })}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {getTextByMode({
                                        niños: 'Ver todas mis compras',
                                        jóvenes: 'Ver historial completo',
                                        adultos: 'Ver todas las compras'
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