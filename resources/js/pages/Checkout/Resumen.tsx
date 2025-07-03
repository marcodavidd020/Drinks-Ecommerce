import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useAppMode } from '@/contexts/AppModeContext';
import { formatCurrency } from '@/lib/currency';

interface DetalleCarrito {
    id: number;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
    productoAlmacen: {
        id: number;
        stock: number;
        producto: {
            id: number;
            nombre: string;
            cod_producto: string;
            imagen?: string;
            categoria: {
                id: number;
                nombre: string;
            };
        };
    };
}

interface Carrito {
    id: number;
    total: number;
    detalles: DetalleCarrito[];
}

interface Cliente {
    id: number;
    nombre: string;
    email: string;
    nit: string;
}

interface CheckoutResumenProps {
    carrito: Carrito;
    detalles: DetalleCarrito[];
    total: number;
    cliente: Cliente;
}

export default function CheckoutResumen({ carrito, detalles, total, cliente }: CheckoutResumenProps) {
    const { settings } = useAppMode();

    const getTextByMode = (textos: { niños: string; jóvenes: string; adultos: string }) => {
        return textos[settings.ageMode as keyof typeof textos] || textos.adultos;
    };

    const getModeClasses = () => {
        switch (settings.ageMode) {
            case 'niños':
                return 'font-comic text-adaptive-kids';
            case 'jóvenes':
                return 'font-modern text-adaptive-teen';
            default:
                return 'font-classic text-adaptive-adult';
        }
    };

    return (
        <DashboardLayout>
            <Head title={getTextByMode({
                niños: '🧃 ¡Revisemos tu Carrito!',
                jóvenes: 'Checkout - Resumen',
                adultos: 'Checkout - Resumen de Compra'
            })} />

            <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 py-6 ${getModeClasses()}`}>
                <div className="max-w-6xl mx-auto px-4">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className={`text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: '🛒 ¡Revisemos tu Carrito de Bebidas!',
                                jóvenes: '🛍️ Checkout - Resumen de Compra',
                                adultos: 'Checkout - Resumen de su Pedido'
                            })}
                        </h1>
                        <p className={`text-gray-600 dark:text-gray-300 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: 'Revisa que todo esté bien antes de continuar',
                                jóvenes: 'Verifica tu pedido antes de proceder al pago',
                                adultos: 'Revise los detalles de su pedido antes de continuar'
                            })}
                        </p>
                    </div>

                    {/* Progress Indicator */}
                    <div className="mb-8">
                        <div className="flex items-center justify-center space-x-4">
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                    1
                                </div>
                                <span className={`ml-2 text-blue-600 dark:text-blue-400 font-medium ${getModeClasses()}`}>
                                    {getTextByMode({ niños: 'Revisar', jóvenes: 'Resumen', adultos: 'Resumen' })}
                                </span>
                            </div>
                            <div className="w-8 h-1 bg-gray-300 dark:bg-gray-600"></div>
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 rounded-full flex items-center justify-center text-sm font-bold">
                                    2
                                </div>
                                <span className={`ml-2 text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>
                                    {getTextByMode({ niños: 'Dirección', jóvenes: 'Entrega', adultos: 'Dirección' })}
                                </span>
                            </div>
                            <div className="w-8 h-1 bg-gray-300 dark:bg-gray-600"></div>
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 rounded-full flex items-center justify-center text-sm font-bold">
                                    3
                                </div>
                                <span className={`ml-2 text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>
                                    {getTextByMode({ niños: 'Pagar', jóvenes: 'Pago', adultos: 'Pago' })}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Productos del carrito */}
                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <h2 className={`text-xl font-bold text-gray-900 dark:text-white ${getModeClasses()}`}>
                                        {getTextByMode({
                                            niños: '🧃 Tus Bebidas Seleccionadas',
                                            jóvenes: 'Productos Seleccionados',
                                            adultos: 'Productos en su Carrito'
                                        })}
                                    </h2>
                                </div>

                                <div className="p-6 space-y-4">
                                    {detalles && detalles.length > 0 ? detalles.map((detalle) => {
                                        // Verificar que los datos necesarios existen
                                        if (!detalle || !detalle.productoAlmacen || !detalle.productoAlmacen.producto) {
                                            return (
                                                <div key={detalle?.id || Math.random()} className="flex items-center space-x-4 p-4 bg-red-50 dark:bg-red-900 rounded-lg">
                                                    <div className="text-red-600 dark:text-red-400">
                                                        ⚠️ Error: Datos del producto no disponibles
                                                    </div>
                                                </div>
                                            );
                                        }
                                        
                                        return (
                                            <div key={detalle.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                {/* Imagen del producto */}
                                                <div className="flex-shrink-0">
                                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900 dark:to-cyan-900 rounded-lg flex items-center justify-center">
                                                        {detalle.productoAlmacen.producto.imagen ? (
                                                            <img 
                                                                src={detalle.productoAlmacen.producto.imagen} 
                                                                alt={detalle.productoAlmacen.producto.nombre}
                                                                className="w-12 h-12 object-cover rounded"
                                                            />
                                                        ) : (
                                                            <span className="text-2xl">
                                                                {settings.ageMode === 'niños' ? '🧃' : '🥤'}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Información del producto */}
                                                <div className="flex-1">
                                                    <h3 className={`font-semibold text-gray-900 dark:text-white ${getModeClasses()}`}>
                                                        {detalle.productoAlmacen.producto.nombre}
                                                    </h3>
                                                    <p className={`text-sm text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>
                                                        {getTextByMode({ niños: '📂', jóvenes: 'Cat:', adultos: 'Categoría:' })} {detalle.productoAlmacen.producto.categoria?.nombre || 'Sin categoría'}
                                                    </p>
                                                    <p className={`text-sm text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>
                                                        {getTextByMode({ niños: '🏷️', jóvenes: 'SKU:', adultos: 'Código:' })} {detalle.productoAlmacen.producto.cod_producto}
                                                    </p>
                                                </div>

                                                {/* Cantidad y precio */}
                                                <div className="text-right">
                                                    <p className={`font-medium text-gray-900 dark:text-white ${getModeClasses()}`}>
                                                        {getTextByMode({ niños: '🔢', jóvenes: 'x', adultos: 'Cantidad:' })} {detalle.cantidad}
                                                    </p>
                                                    <p className={`text-lg font-bold text-blue-600 dark:text-blue-400 ${getModeClasses()}`}>
                                                        {formatCurrency(detalle.subtotal)}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    }) : (
                                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                            {getTextByMode({
                                                niños: '🤔 No hay productos en el carrito',
                                                jóvenes: 'Carrito vacío',
                                                adultos: 'No hay productos en el carrito'
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Resumen del pedido */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 sticky top-6">
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <h2 className={`text-xl font-bold text-gray-900 dark:text-white ${getModeClasses()}`}>
                                        {getTextByMode({
                                            niños: '💰 Resumen de tu Compra',
                                            jóvenes: 'Resumen del Pedido',
                                            adultos: 'Resumen del Pedido'
                                        })}
                                    </h2>
                                </div>

                                <div className="p-6 space-y-4">
                                    {/* Información del cliente */}
                                    <div className="space-y-2">
                                        <h3 className={`font-semibold text-gray-900 dark:text-white ${getModeClasses()}`}>
                                            {getTextByMode({ niños: '👤 Tu Info', jóvenes: 'Cliente', adultos: 'Información del Cliente' })}
                                        </h3>
                                        <p className={`text-sm text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>
                                            {cliente.nombre}
                                        </p>
                                        <p className={`text-sm text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>
                                            {cliente.email}
                                        </p>
                                        {cliente.nit && (
                                            <p className={`text-sm text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>
                                                NIT: {cliente.nit}
                                            </p>
                                        )}
                                    </div>

                                    <hr className="border-gray-200 dark:border-gray-700" />

                                    {/* Detalles del total */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className={`text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>
                                                {getTextByMode({ niños: '🧾 Subtotal', jóvenes: 'Subtotal', adultos: 'Subtotal' })}
                                            </span>
                                            <span className={`font-medium text-gray-900 dark:text-white ${getModeClasses()}`}>
                                                {formatCurrency(total)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className={`text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>
                                                {getTextByMode({ niños: '🚚 Envío', jóvenes: 'Envío', adultos: 'Costo de Envío' })}
                                            </span>
                                            <span className={`font-medium text-green-600 dark:text-green-400 ${getModeClasses()}`}>
                                                {getTextByMode({ niños: '¡Gratis!', jóvenes: 'Gratis', adultos: 'Gratuito' })}
                                            </span>
                                        </div>
                                        <hr className="border-gray-200 dark:border-gray-700" />
                                        <div className="flex justify-between items-center">
                                            <span className={`text-lg font-bold text-gray-900 dark:text-white ${getModeClasses()}`}>
                                                {getTextByMode({ niños: '💰 Total', jóvenes: 'Total', adultos: 'Total' })}
                                            </span>
                                            <span className={`text-xl font-bold text-blue-600 dark:text-blue-400 ${getModeClasses()}`}>
                                                {formatCurrency(total)}
                                            </span>
                                        </div>
                                    </div>

                                    <hr className="border-gray-200 dark:border-gray-700" />

                                    {/* Botones de acción */}
                                    <div className="space-y-3">
                                        <Link
                                            href="/checkout/direccion"
                                            className={`w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-[1.02] text-center block ${getModeClasses()}`}
                                        >
                                            {getTextByMode({
                                                niños: '🚀 ¡Continuar con la Compra!',
                                                jóvenes: 'Continuar al Checkout',
                                                adultos: 'Continuar con la Compra'
                                            })}
                                        </Link>

                                        <Link
                                            href="/carrito"
                                            className={`w-full border-2 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 font-medium py-3 px-6 rounded-lg transition-all text-center block ${getModeClasses()}`}
                                        >
                                            {getTextByMode({
                                                niños: '⬅️ Regresar al Carrito',
                                                jóvenes: 'Volver al Carrito',
                                                adultos: 'Volver al Carrito'
                                            })}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
} 