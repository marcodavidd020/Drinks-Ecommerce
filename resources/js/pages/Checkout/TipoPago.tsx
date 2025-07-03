import { Head, router } from '@inertiajs/react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useAppMode } from '@/contexts/AppModeContext';
import { formatCurrency } from '@/lib/currency';
import { useState } from 'react';

interface TipoPago {
    id: number;
    tipo_pago: string;
}

interface Direccion {
    id: number;
    nombre: string;
    referencia: string;
}

interface Carrito {
    id: number;
    total: number;
}

interface CheckoutTipoPagoProps {
    carrito: Carrito;
    direccion: Direccion;
    tiposPago: TipoPago[];
    total: number;
}

export default function CheckoutTipoPago({ carrito, direccion, tiposPago, total }: CheckoutTipoPagoProps) {
    const { settings } = useAppMode();
    const [tipoPagoSeleccionado, setTipoPagoSeleccionado] = useState<number | null>(null);
    const [processing, setProcessing] = useState(false);

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

    const getTipoPagoIcon = (tipoPago: string) => {
        const tipo = tipoPago.toLowerCase();
        if (tipo.includes('tarjeta')) return '💳';
        if (tipo.includes('qr')) return '📱';
        if (tipo.includes('tigo')) return '📱';
        return '💰';
    };

    const continuarAConfirmacion = () => {
        if (!tipoPagoSeleccionado) {
            alert(getTextByMode({
                niños: '¡Oops! Debes elegir cómo pagar',
                jóvenes: 'Por favor selecciona un método de pago',
                adultos: 'Debe seleccionar un tipo de pago'
            }));
            return;
        }

        setProcessing(true);
        
        // Buscar el tipo de pago seleccionado
        const tipoPagoInfo = tiposPago.find(tp => tp.id === tipoPagoSeleccionado);
        const tipoPagoNombre = tipoPagoInfo?.tipo_pago.toLowerCase() || '';

        // Si es tarjeta, ir a la página de datos de tarjeta
        if (tipoPagoNombre.includes('tarjeta')) {
            router.get('/checkout/datos-tarjeta', {
                direccion_id: direccion.id,
                tipo_pago_id: tipoPagoSeleccionado
            });
        }
        // Si es QR, ir directo a confirmación (se simulará el QR ahí)
        else if (tipoPagoNombre.includes('qr')) {
            router.post('/checkout/confirmar', {
                direccion_id: direccion.id,
                tipo_pago_id: tipoPagoSeleccionado
            });
        }
        // Para otros tipos de pago, continuar con el flujo normal
        else {
            router.post('/checkout/confirmar', {
                direccion_id: direccion.id,
                tipo_pago_id: tipoPagoSeleccionado
            });
        }
    };

    return (
        <DashboardLayout>
            <Head title={getTextByMode({
                niños: '💳 ¿Cómo quieres pagar?',
                jóvenes: 'Método de Pago',
                adultos: 'Seleccionar Tipo de Pago'
            })} />

            <div className={`min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 py-6 ${getModeClasses()}`}>
                <div className="max-w-4xl mx-auto px-4">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className={`text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: '💳 ¡Elige cómo quieres pagar!',
                                jóvenes: '💰 Método de Pago',
                                adultos: 'Seleccionar Tipo de Pago'
                            })}
                        </h1>
                        <p className={`text-gray-600 dark:text-gray-300 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: 'Selecciona la forma más fácil para ti',
                                jóvenes: 'Elige tu método de pago preferido',
                                adultos: 'Seleccione su método de pago preferido'
                            })}
                        </p>
                    </div>

                    {/* Progress Indicator */}
                    <div className="mb-8">
                        <div className="flex items-center justify-center space-x-4">
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                    ✓
                                </div>
                                <span className={`ml-2 text-green-600 dark:text-green-400 font-medium ${getModeClasses()}`}>
                                    {getTextByMode({ niños: 'Revisar', jóvenes: 'Resumen', adultos: 'Resumen' })}
                                </span>
                            </div>
                            <div className="w-8 h-1 bg-green-600"></div>
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                    ✓
                                </div>
                                <span className={`ml-2 text-green-600 dark:text-green-400 font-medium ${getModeClasses()}`}>
                                    {getTextByMode({ niños: 'Dirección', jóvenes: 'Entrega', adultos: 'Dirección' })}
                                </span>
                            </div>
                            <div className="w-8 h-1 bg-green-600"></div>
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                    3
                                </div>
                                <span className={`ml-2 text-purple-600 dark:text-purple-400 font-medium ${getModeClasses()}`}>
                                    {getTextByMode({ niños: 'Pagar', jóvenes: 'Pago', adultos: 'Pago' })}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Tipos de pago disponibles */}
                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <h2 className={`text-xl font-bold text-gray-900 dark:text-white ${getModeClasses()}`}>
                                        {getTextByMode({
                                            niños: '💰 Formas de Pago',
                                            jóvenes: 'Métodos de Pago',
                                            adultos: 'Tipos de Pago Disponibles'
                                        })}
                                    </h2>
                                </div>

                                <div className="p-6 space-y-4">
                                    {tiposPago.map((tipoPago) => (
                                        <div 
                                            key={tipoPago.id}
                                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                                                tipoPagoSeleccionado === tipoPago.id
                                                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900 dark:border-purple-400'
                                                    : 'border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500'
                                            }`}
                                            onClick={() => setTipoPagoSeleccionado(tipoPago.id)}
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                                    tipoPagoSeleccionado === tipoPago.id
                                                        ? 'border-purple-500 bg-purple-500'
                                                        : 'border-gray-300 dark:border-gray-600'
                                                }`}>
                                                    {tipoPagoSeleccionado === tipoPago.id && (
                                                        <div className="w-3 h-3 bg-white rounded-full"></div>
                                                    )}
                                                </div>
                                                
                                                <div className="flex items-center space-x-3">
                                                    <span className="text-3xl">
                                                        {getTipoPagoIcon(tipoPago.tipo_pago)}
                                                    </span>
                                                    <div>
                                                        <h3 className={`font-semibold text-gray-900 dark:text-white ${getModeClasses()}`}>
                                                            {tipoPago.tipo_pago}
                                                        </h3>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Resumen del pedido */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 sticky top-6">
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <h2 className={`text-xl font-bold text-gray-900 dark:text-white ${getModeClasses()}`}>
                                        {getTextByMode({
                                            niños: '📋 Tu Pedido',
                                            jóvenes: 'Resumen Final',
                                            adultos: 'Resumen del Pedido'
                                        })}
                                    </h2>
                                </div>

                                <div className="p-6 space-y-4">
                                    {/* Dirección seleccionada */}
                                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                        <h3 className={`font-semibold text-gray-900 dark:text-white text-sm ${getModeClasses()}`}>
                                            {getTextByMode({ niños: '🏠 Entrega', jóvenes: 'Entregar en', adultos: 'Dirección de Entrega' })}
                                        </h3>
                                        <p className={`text-gray-600 dark:text-gray-400 text-sm ${getModeClasses()}`}>
                                            {direccion.nombre}
                                        </p>
                                        <p className={`text-gray-500 dark:text-gray-500 text-xs ${getModeClasses()}`}>
                                            {direccion.referencia}
                                        </p>
                                    </div>

                                    <hr className="border-gray-200 dark:border-gray-700" />

                                    {/* Total */}
                                    <div className="flex justify-between items-center">
                                        <span className={`text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>
                                            {getTextByMode({ niños: '🧾 Total', jóvenes: 'Total', adultos: 'Total' })}
                                        </span>
                                        <span className={`text-xl font-bold text-purple-600 dark:text-purple-400 ${getModeClasses()}`}>
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

                                    <div className="space-y-3">
                                        <button
                                            onClick={continuarAConfirmacion}
                                            disabled={!tipoPagoSeleccionado || processing}
                                            className={`w-full font-bold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-[1.02] text-center ${
                                                tipoPagoSeleccionado && !processing
                                                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white'
                                                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                            } ${getModeClasses()}`}
                                        >
                                            {processing ? (
                                                getTextByMode({
                                                    niños: '⏳ Procesando...',
                                                    jóvenes: 'Procesando...',
                                                    adultos: 'Procesando...'
                                                })
                                            ) : (
                                                getTextByMode({
                                                    niños: '✅ ¡Confirmar Pedido!',
                                                    jóvenes: 'Confirmar Pedido',
                                                    adultos: 'Confirmar Pedido'
                                                })
                                            )}
                                        </button>

                                        <button
                                            onClick={() => router.get('/checkout/direccion')}
                                            className={`w-full border-2 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 font-medium py-3 px-6 rounded-lg transition-all text-center ${getModeClasses()}`}
                                        >
                                            {getTextByMode({
                                                niños: '⬅️ Cambiar Dirección',
                                                jóvenes: 'Volver a Dirección',
                                                adultos: 'Volver a Dirección'
                                            })}
                                        </button>
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