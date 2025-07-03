import { Head, router } from '@inertiajs/react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useAppMode } from '@/contexts/AppModeContext';
import { formatCurrency } from '@/lib/currency';

interface TipoPago {
    id: number;
    tipo_pago: string;
}

interface Direccion {
    id: number;
    nombre: string;
    referencia: string;
}

interface NotaVenta {
    id: number;
    fecha_venta: string;
    total: number;
    observaciones?: string;
}

interface CheckoutExitoProps {
    notaVenta: NotaVenta;
    direccion: Direccion;
    tipoPago: TipoPago;
    total: number;
}

export default function CheckoutExito({ notaVenta, direccion, tipoPago, total }: CheckoutExitoProps) {
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

    const getTipoPagoIcon = (tipoPago: string) => {
        const tipo = tipoPago.toLowerCase();
        if (tipo.includes('tarjeta')) return '💳';
        if (tipo.includes('qr')) return '📱';
        if (tipo.includes('tigo')) return '📱';
        return '💰';
    };

    return (
        <DashboardLayout>
            <Head title={getTextByMode({
                niños: '🎉 ¡Tu pedido está listo!',
                jóvenes: 'Pedido Confirmado',
                adultos: 'Pedido Confirmado Exitosamente'
            })} />

            <div className={`min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 py-6 ${getModeClasses()}`}>
                <div className="max-w-4xl mx-auto px-4">
                    {/* Success Animation */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 dark:bg-green-900 rounded-full mb-6">
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-4xl animate-bounce">
                                ✓
                            </div>
                        </div>
                        
                        <h1 className={`text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: '🎉 ¡Súper! Tu pedido está listo',
                                jóvenes: '🎯 ¡Pedido Confirmado!',
                                adultos: '✅ Pedido Confirmado Exitosamente'
                            })}
                        </h1>
                        
                        <p className={`text-xl text-gray-600 dark:text-gray-300 mb-6 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: 'Ya estamos preparando tus bebidas favoritas',
                                jóvenes: 'Tu pedido está siendo procesado',
                                adultos: 'Su pedido ha sido recibido y está siendo procesado'
                            })}
                        </p>

                        <div className="inline-flex items-center bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-6 py-3 rounded-full">
                            <span className="text-2xl mr-2">
                                {settings.ageMode === 'niños' ? '🎁' : '📦'}
                            </span>
                            <span className={`font-semibold ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: `Pedido #${notaVenta.id} - ¡Ya casi llega!`,
                                    jóvenes: `Pedido #${notaVenta.id} en proceso`,
                                    adultos: `Número de Pedido: #${notaVenta.id}`
                                })}
                            </span>
                        </div>
                    </div>

                    {/* Order Details Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Delivery Info */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 text-2xl mr-4">
                                    🚚
                                </div>
                                <h2 className={`text-xl font-bold text-gray-900 dark:text-white ${getModeClasses()}`}>
                                    {getTextByMode({
                                        niños: 'Dónde llegarán',
                                        jóvenes: 'Información de Entrega',
                                        adultos: 'Información de Entrega'
                                    })}
                                </h2>
                            </div>
                            
                            <div className="space-y-3">
                                <div>
                                    <h3 className={`font-semibold text-gray-900 dark:text-white ${getModeClasses()}`}>
                                        {direccion.nombre}
                                    </h3>
                                    <p className={`text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>
                                        {direccion.referencia}
                                    </p>
                                </div>
                                
                                <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg">
                                    <p className={`text-blue-800 dark:text-blue-200 font-medium text-sm ${getModeClasses()}`}>
                                        {getTextByMode({
                                            niños: '⏰ Tiempo estimado: 30-45 minutos',
                                            jóvenes: '⏰ Entrega estimada: 30-45 min',
                                            adultos: '⏰ Tiempo estimado de entrega: 30-45 minutos'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 text-2xl mr-4">
                                    {getTipoPagoIcon(tipoPago.tipo_pago)}
                                </div>
                                <h2 className={`text-xl font-bold text-gray-900 dark:text-white ${getModeClasses()}`}>
                                    {getTextByMode({
                                        niños: 'Cómo pagaste',
                                        jóvenes: 'Información de Pago',
                                        adultos: 'Información de Pago'
                                    })}
                                </h2>
                            </div>
                            
                            <div className="space-y-3">
                                <div>
                                    <h3 className={`font-semibold text-gray-900 dark:text-white ${getModeClasses()}`}>
                                        {tipoPago.tipo_pago}
                                    </h3>
                                    <p className={`text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>
                                        {getTextByMode({
                                            niños: 'Método de pago seleccionado',
                                            jóvenes: 'Método de pago',
                                            adultos: 'Método de pago seleccionado'
                                        })}
                                    </p>
                                </div>
                                
                                <div className="bg-purple-50 dark:bg-purple-900 p-3 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <span className={`text-purple-800 dark:text-purple-200 font-medium ${getModeClasses()}`}>
                                            {getTextByMode({ niños: 'Total pagado', jóvenes: 'Total', adultos: 'Total' })}
                                        </span>
                                        <span className={`text-xl font-bold text-purple-800 dark:text-purple-200 ${getModeClasses()}`}>
                                            {formatCurrency(total)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Observaciones */}
                    {notaVenta.observaciones && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
                            <h2 className={`text-xl font-bold text-gray-900 dark:text-white mb-4 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '📝 Notas Especiales',
                                    jóvenes: 'Observaciones',
                                    adultos: 'Observaciones del Pedido'
                                })}
                            </h2>
                            <p className={`text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg ${getModeClasses()}`}>
                                {notaVenta.observaciones}
                            </p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => router.get('/cliente/compras')}
                            className={`bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-200 hover:scale-[1.02] ${getModeClasses()}`}
                        >
                            {getTextByMode({
                                niños: '📱 Ver Mis Pedidos',
                                jóvenes: 'Ver Historial',
                                adultos: 'Ver Historial de Pedidos'
                            })}
                        </button>

                        <button
                            onClick={() => router.get('/home')}
                            className={`border-2 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 font-bold py-4 px-8 rounded-lg transition-all duration-200 hover:scale-[1.02] ${getModeClasses()}`}
                        >
                            {getTextByMode({
                                niños: '🏠 Volver al Inicio',
                                jóvenes: 'Seguir Comprando',
                                adultos: 'Continuar Comprando'
                            })}
                        </button>
                    </div>

                    {/* Thank You Message */}
                    <div className="text-center mt-12">
                        <div className="text-6xl mb-4">
                            {settings.ageMode === 'niños' ? '🌟' : settings.ageMode === 'jóvenes' ? '🎉' : '🙏'}
                        </div>
                        <h3 className={`text-2xl font-bold text-gray-900 dark:text-white mb-2 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: '¡Gracias por elegirnos!',
                                jóvenes: '¡Gracias por tu pedido!',
                                adultos: '¡Gracias por su confianza!'
                            })}
                        </h3>
                        <p className={`text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: 'Esperamos que disfrutes mucho tus bebidas',
                                jóvenes: 'Esperamos que disfrutes tu pedido',
                                adultos: 'Esperamos que disfrute de sus productos'
                            })}
                        </p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
} 