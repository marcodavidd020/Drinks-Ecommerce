import { Head, router } from '@inertiajs/react';
import { useAppModeText } from '@/hooks/useAppModeText';
import DashboardLayout from '@/layouts/DashboardLayout';
import { formatCurrency } from '@/lib/currency';
import { useState } from 'react';

interface Producto {
    id: number;
    nombre: string;
    descripcion?: string;
    imagen?: string;
    precio_venta: number;
    categoria?: {
        id: number;
        nombre: string;
    };
}

interface Almacen {
    id: number;
    nombre: string;
    stock_disponible: number;
}

interface DetalleCarrito {
    id: number;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
    producto_almacen_id: number;
    producto: Producto;
    almacen: Almacen;
}

// interface Carrito {
//     id: number;
//     total: number;
//     fecha: string;
//     total_productos: number;
// }

interface ClienteCarritoProps {
    detalles: DetalleCarrito[];
    total: number;
}

export default function ClienteCarrito({ detalles, total }: ClienteCarritoProps) {
    const { getTextByMode } = useAppModeText();
    const [processingItems, setProcessingItems] = useState<number[]>([]);

    const actualizarCantidad = async (detalleId: number, nuevaCantidad: number) => {
        if (nuevaCantidad < 1) return;
        
        setProcessingItems(prev => [...prev, detalleId]);

        try {
            await fetch(`/carrito/actualizar/${detalleId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify({ cantidad: nuevaCantidad })
            });

            // Recargar la página para mostrar los cambios
            router.reload();
        } catch (error) {
            console.error('Error actualizando cantidad:', error);
        } finally {
            setProcessingItems(prev => prev.filter(id => id !== detalleId));
        }
    };

    const eliminarProducto = async (detalleId: number) => {
        if (!confirm(getTextByMode({
            niños: '¿Seguro que quieres quitar esta bebida del carrito?',
            jóvenes: '¿Eliminar este producto del carrito?',
            adultos: '¿Está seguro de eliminar este producto?'
        }))) return;

        setProcessingItems(prev => [...prev, detalleId]);

        try {
            await fetch(`/carrito/eliminar/${detalleId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                }
            });

            router.reload();
        } catch (error) {
            console.error('Error eliminando producto:', error);
        } finally {
            setProcessingItems(prev => prev.filter(id => id !== detalleId));
        }
    };

    const vaciarCarrito = async () => {
        if (!confirm(getTextByMode({
            niños: '¿Seguro que quieres vaciar todo tu carrito? 😱',
            jóvenes: '¿Vaciar todo el carrito?',
            adultos: '¿Está seguro de vaciar el carrito completo?'
        }))) return;

        try {
            await fetch('/carrito/vaciar', {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                }
            });

            router.reload();
        } catch (error) {
            console.error('Error vaciando carrito:', error);
        }
    };

    const realizarCheckout = () => {
        // Redirigir al nuevo flujo de checkout
        router.visit('/checkout');
    };

    return (
        <DashboardLayout>
            <Head title={getTextByMode({
                niños: '🛒 Mi Carrito Arturo',
                jóvenes: 'Carrito - Arturo',
                adultos: 'Carrito de Compras - Arturo'
            })} />

            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold mb-2">
                                {getTextByMode({
                                    niños: '🛒 Mi Carrito de Bebidas',
                                    jóvenes: 'Mi Carrito de Compras',
                                    adultos: 'Carrito de Compras'
                                })}
                            </h1>
                            <p className="text-cyan-100">
                                {detalles.length > 0 
                                    ? getTextByMode({
                                        niños: `${detalles.length} bebidas esperándote 🧃`,
                                        jóvenes: `${detalles.length} productos seleccionados`,
                                        adultos: `${detalles.length} productos en el carrito`
                                    })
                                    : getTextByMode({
                                        niños: 'Tu carrito está vacío 😢',
                                        jóvenes: 'Carrito vacío',
                                        adultos: 'No hay productos en el carrito'
                                    })
                                }
                            </p>
                        </div>
                        <div className="text-6xl opacity-20">
                            🛒
                        </div>
                    </div>
                </div>

                {detalles.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Lista de productos */}
                        <div className="lg:col-span-2 space-y-4">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                            {getTextByMode({
                                                niños: '🧃 Mis Bebidas Elegidas',
                                                jóvenes: 'Productos Seleccionados',
                                                adultos: 'Productos en el Carrito'
                                            })}
                                        </h2>
                                        <button
                                            onClick={vaciarCarrito}
                                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
                                        >
                                            {getTextByMode({
                                                niños: 'Vaciar todo',
                                                jóvenes: 'Vaciar carrito',
                                                adultos: 'Vaciar carrito'
                                            })}
                                        </button>
                                    </div>
                                </div>

                                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {detalles.map((detalle) => (
                                        <div key={detalle.id} className="p-6">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex-shrink-0">
                                                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center">
                                                        {detalle.producto.imagen ? (
                                                            <img 
                                                                src={detalle.producto.imagen} 
                                                                alt={detalle.producto.nombre}
                                                                className="w-12 h-12 object-cover rounded-lg"
                                                            />
                                                        ) : (
                                                            <span className="text-2xl">🧃</span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                                        {detalle.producto.nombre}
                                                    </h3>
                                                    {detalle.producto.categoria && (
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            {detalle.producto.categoria.nombre}
                                                        </p>
                                                    )}
                                                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                                        {getTextByMode({
                                                            niños: `Almacén: ${detalle.almacen.nombre}`,
                                                            jóvenes: `Disponible: ${detalle.almacen.stock_disponible}`,
                                                            adultos: `Stock disponible: ${detalle.almacen.stock_disponible}`
                                                        })}
                                                    </p>
                                                </div>

                                                <div className="flex items-center space-x-4">
                                                    {/* Controles de cantidad */}
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={() => actualizarCantidad(detalle.id, detalle.cantidad - 1)}
                                                            disabled={detalle.cantidad <= 1 || processingItems.includes(detalle.id)}
                                                            className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            -
                                                        </button>
                                                        
                                                        <span className="w-8 text-center font-medium text-gray-900 dark:text-gray-100">
                                                            {detalle.cantidad}
                                                        </span>
                                                        
                                                        <button
                                                            onClick={() => actualizarCantidad(detalle.id, detalle.cantidad + 1)}
                                                            disabled={detalle.cantidad >= detalle.almacen.stock_disponible || processingItems.includes(detalle.id)}
                                                            className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            +
                                                        </button>
                                                    </div>

                                                    {/* Precio */}
                                                    <div className="text-right">
                                                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                            {formatCurrency(detalle.subtotal)}
                                                        </p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            {formatCurrency(detalle.precio_unitario)} c/u
                                                        </p>
                                                    </div>

                                                    {/* Botón eliminar */}
                                                    <button
                                                        onClick={() => eliminarProducto(detalle.id)}
                                                        disabled={processingItems.includes(detalle.id)}
                                                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-2 disabled:opacity-50"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Resumen y checkout */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow sticky top-6">
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        {getTextByMode({
                                            niños: '💰 Resumen de mi Pedido',
                                            jóvenes: 'Resumen del Pedido',
                                            adultos: 'Resumen de Compra'
                                        })}
                                    </h2>
                                </div>

                                <div className="p-6 space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">
                                            {getTextByMode({
                                                niños: 'Productos',
                                                jóvenes: 'Subtotal',
                                                adultos: 'Subtotal'
                                            })}
                                        </span>
                                        <span className="font-medium text-gray-900 dark:text-gray-100">
                                            {formatCurrency(total)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">
                                            {getTextByMode({
                                                niños: 'Envío',
                                                jóvenes: 'Envío',
                                                adultos: 'Costo de envío'
                                            })}
                                        </span>
                                        <span className="font-medium text-green-600 dark:text-green-400">
                                            {getTextByMode({
                                                niños: '¡Gratis! 🎉',
                                                jóvenes: 'Gratis',
                                                adultos: 'Gratis'
                                            })}
                                        </span>
                                    </div>

                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                        <div className="flex justify-between">
                                            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                {getTextByMode({
                                                    niños: 'Total a pagar',
                                                    jóvenes: 'Total',
                                                    adultos: 'Total a pagar'
                                                })}
                                            </span>
                                            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                                {formatCurrency(total)}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={realizarCheckout}
                                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processingItems.length > 0 ? (
                                            getTextByMode({
                                                niños: '🔄 Procesando...',
                                                jóvenes: 'Procesando pedido...',
                                                adultos: 'Procesando pedido...'
                                            })
                                        ) : (
                                            getTextByMode({
                                                niños: '🧃 ¡Confirmar Pedido!',
                                                jóvenes: 'Confirmar Pedido',
                                                adultos: 'Realizar Pedido'
                                            })
                                        )}
                                    </button>

                                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                        {getTextByMode({
                                            niños: 'Al confirmar, recibirás tus bebidas pronto 🚚',
                                            jóvenes: 'Confirma tu pedido para proceder con el envío',
                                            adultos: 'Al confirmar acepta los términos y condiciones'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Carrito vacío */
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
                        <div className="text-8xl mb-6 opacity-50">🛒</div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                            {getTextByMode({
                                niños: '¡Tu carrito está vacío!',
                                jóvenes: 'Carrito vacío',
                                adultos: 'Tu carrito está vacío'
                            })}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-8">
                            {getTextByMode({
                                niños: 'Vamos a llenarlo con las bebidas más deliciosas de Arturo 🧃✨',
                                jóvenes: 'Descubre nuestros productos y encuentra tus bebidas favoritas',
                                adultos: 'Explore nuestro catálogo y agregue productos a su carrito'
                            })}
                        </p>
                        <div className="space-y-4">
                            <a
                                href="/"
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 hover:scale-[1.02]"
                            >
                                {getTextByMode({
                                    niños: '🧃 Explorar Bebidas',
                                    jóvenes: 'Explorar Productos',
                                    adultos: 'Ver Catálogo'
                                })}
                            </a>
                            <div>
                                <a
                                    href="/cliente/dashboard"
                                    className="inline-flex items-center px-4 py-2 text-cyan-600 hover:text-cyan-800 dark:text-cyan-400 dark:hover:text-cyan-200 text-sm font-medium"
                                >
                                    {getTextByMode({
                                        niños: '🏠 Volver a mi dashboard',
                                        jóvenes: 'Volver al dashboard',
                                        adultos: 'Regresar al dashboard'
                                    })}
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}