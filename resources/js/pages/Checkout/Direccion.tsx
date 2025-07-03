import { Head, router } from '@inertiajs/react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useAppMode } from '@/contexts/AppModeContext';
import { formatCurrency } from '@/lib/currency';
import { useState } from 'react';

interface Direccion {
    id: number;
    nombre: string;
    longitud: number;
    latitud: number;
    referencia: string;
}

interface Carrito {
    id: number;
    total: number;
}

interface CheckoutDireccionProps {
    carrito: Carrito;
    direcciones: Direccion[];
    total: number;
}

export default function CheckoutDireccion({ carrito, direcciones, total }: CheckoutDireccionProps) {
    const { settings } = useAppMode();
    const [direccionSeleccionada, setDireccionSeleccionada] = useState<number | null>(null);
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

    const continuarAlPago = () => {
        if (!direccionSeleccionada) {
            alert(getTextByMode({
                niños: '¡Oops! Debes elegir una dirección',
                jóvenes: 'Por favor selecciona una dirección',
                adultos: 'Debe seleccionar una dirección de entrega'
            }));
            return;
        }

        setProcessing(true);
        router.post('/checkout/pago', {
            direccion_id: direccionSeleccionada
        });
    };

    return (
        <DashboardLayout>
            <Head title={getTextByMode({
                niños: '🏠 ¿Dónde quieres recibir tus bebidas?',
                jóvenes: 'Dirección de Entrega',
                adultos: 'Seleccionar Dirección de Entrega'
            })} />

            <div className={`min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 py-6 ${getModeClasses()}`}>
                <div className="max-w-4xl mx-auto px-4">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className={`text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: '🏠 ¡Elige dónde quieres recibir tus bebidas!',
                                jóvenes: '📍 Dirección de Entrega',
                                adultos: 'Seleccionar Dirección de Entrega'
                            })}
                        </h1>
                        <p className={`text-gray-600 dark:text-gray-300 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: 'Selecciona el lugar más cómodo para ti',
                                jóvenes: 'Elige dónde quieres recibir tu pedido',
                                adultos: 'Seleccione la dirección donde desea recibir su pedido'
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
                                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                    2
                                </div>
                                <span className={`ml-2 text-blue-600 dark:text-blue-400 font-medium ${getModeClasses()}`}>
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
                        {/* Direcciones disponibles */}
                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <h2 className={`text-xl font-bold text-gray-900 dark:text-white ${getModeClasses()}`}>
                                        {getTextByMode({
                                            niños: '📍 Direcciones Disponibles',
                                            jóvenes: 'Zonas de Entrega',
                                            adultos: 'Direcciones de Entrega Disponibles'
                                        })}
                                    </h2>
                                </div>

                                <div className="p-6 space-y-4">
                                    {direcciones.map((direccion) => (
                                        <div 
                                            key={direccion.id}
                                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                                                direccionSeleccionada === direccion.id
                                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 dark:border-blue-400'
                                                    : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500'
                                            }`}
                                            onClick={() => setDireccionSeleccionada(direccion.id)}
                                        >
                                            <div className="flex items-start space-x-4">
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                                    direccionSeleccionada === direccion.id
                                                        ? 'border-blue-500 bg-blue-500'
                                                        : 'border-gray-300 dark:border-gray-600'
                                                }`}>
                                                    {direccionSeleccionada === direccion.id && (
                                                        <div className="w-3 h-3 bg-white rounded-full"></div>
                                                    )}
                                                </div>
                                                
                                                <div className="flex-1">
                                                    <h3 className={`font-semibold text-gray-900 dark:text-white ${getModeClasses()}`}>
                                                        {direccion.nombre}
                                                    </h3>
                                                    <p className={`text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>
                                                        {direccion.referencia}
                                                    </p>
                                                    <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                                                        <span className="text-lg mr-2">
                                                            {settings.ageMode === 'niños' ? '🗺️' : '📍'}
                                                        </span>
                                                        <span>{direccion.latitud}, {direccion.longitud}</span>
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
                                            niños: '💰 Tu Pedido',
                                            jóvenes: 'Resumen',
                                            adultos: 'Resumen del Pedido'
                                        })}
                                    </h2>
                                </div>

                                <div className="p-6 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className={`text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>
                                            {getTextByMode({ niños: '🧾 Total', jóvenes: 'Total', adultos: 'Total' })}
                                        </span>
                                        <span className={`text-xl font-bold text-blue-600 dark:text-blue-400 ${getModeClasses()}`}>
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
                                            onClick={continuarAlPago}
                                            disabled={!direccionSeleccionada || processing}
                                            className={`w-full font-bold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-[1.02] text-center ${
                                                direccionSeleccionada && !processing
                                                    ? 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white'
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
                                                    niños: '💳 ¡Continuar al Pago!',
                                                    jóvenes: 'Continuar al Pago',
                                                    adultos: 'Continuar al Pago'
                                                })
                                            )}
                                        </button>

                                        <button
                                            onClick={() => router.get('/checkout')}
                                            className={`w-full border-2 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 font-medium py-3 px-6 rounded-lg transition-all text-center ${getModeClasses()}`}
                                        >
                                            {getTextByMode({
                                                niños: '⬅️ Regresar',
                                                jóvenes: 'Volver al Resumen',
                                                adultos: 'Volver al Resumen'
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