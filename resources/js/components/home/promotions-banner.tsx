import { useAppMode } from '@/contexts/AppModeContext';

interface Promocion {
    id: number;
    nombre: string;
    fecha_inicio: string;
    fecha_fin: string;
    descuento?: string;
    productos?: Array<{
        id: number;
        nombre: string;
        descuento_porcentaje?: number;
        descuento_fijo?: number;
    }>;
}

interface PromotionsBannerProps {
    promociones: Promocion[];
}

export default function PromotionsBanner({ promociones }: PromotionsBannerProps) {
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-CO', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const isActivePromotion = (fechaFin: string) => {
        return new Date(fechaFin) > new Date();
    };

    const getDaysRemaining = (fechaFin: string) => {
        const today = new Date();
        const endDate = new Date(fechaFin);
        const diffTime = endDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    const activePromotions = promociones.filter(promo => isActivePromotion(promo.fecha_fin));

    if (activePromotions.length === 0) {
        return null;
    }

    return (
        <section className="py-8 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600">
            <div className="container mx-auto px-4">
                <div className="text-center mb-6">
                    <h2 className={`text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg ${getModeClasses()}`}>
                        {getTextByMode({
                            niños: '🎉 ¡Ofertas Súper Especiales! 🎉',
                            jóvenes: '🔥 Promociones Exclusivas',
                            adultos: 'Promociones Vigentes'
                        })}
                    </h2>
                    <p className={`text-white/90 drop-shadow-md ${getModeClasses()}`}>
                        {getTextByMode({
                            niños: '¡No te pierdas estas increíbles ofertas!',
                            jóvenes: 'Ofertas por tiempo limitado',
                            adultos: 'Aprovecha estas ofertas por tiempo limitado'
                        })}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activePromotions.map((promocion, index) => {
                        const daysRemaining = getDaysRemaining(promocion.fecha_fin);
                        const gradients = [
                            'from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700',
                            'from-green-500 to-teal-600 dark:from-green-600 dark:to-teal-700',
                            'from-yellow-500 to-orange-600 dark:from-yellow-600 dark:to-orange-700',
                            'from-pink-500 to-red-600 dark:from-pink-600 dark:to-red-700',
                        ];
                        const gradient = gradients[index % gradients.length];

                        return (
                            <div 
                                key={promocion.id}
                                className={`bg-gradient-to-br ${gradient} rounded-xl p-6 text-white relative overflow-hidden group cursor-pointer hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
                            >
                                {/* Background decorations */}
                                {settings.ageMode === 'niños' && (
                                    <>
                                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 dark:bg-white/5 rounded-full animate-bounce"></div>
                                        <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/10 dark:bg-white/5 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
                                    </>
                                )}
                                
                                {/* Glassmorphism effect for teen mode */}
                                {settings.ageMode === 'jóvenes' && (
                                    <div className="absolute inset-0 bg-white/10 dark:bg-white/5 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                                )}

                                <div className="relative z-10">
                                    {/* Header */}
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className={`text-xl font-bold drop-shadow-md ${getModeClasses()}`}>
                                            {promocion.nombre}
                                        </h3>
                                        <div className="bg-white/20 dark:bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                                            <span className={`text-sm font-medium ${getModeClasses()}`}>
                                                {getTextByMode({
                                                    niños: `🕐 ${daysRemaining} días`,
                                                    jóvenes: `${daysRemaining}d`,
                                                    adultos: `${daysRemaining} días`
                                                })}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    {promocion.descuento && (
                                        <p className={`text-white/90 mb-4 drop-shadow-sm ${getModeClasses()}`}>
                                            {promocion.descuento}
                                        </p>
                                    )}

                                    {/* Products count */}
                                    {promocion.productos && promocion.productos.length > 0 && (
                                        <div className="mb-4">
                                            <p className={`text-sm text-white/80 ${getModeClasses()}`}>
                                                {getTextByMode({
                                                    niños: `¡${promocion.productos.length} productos en oferta! 🎁`,
                                                    jóvenes: `${promocion.productos.length} productos incluidos`,
                                                    adultos: `${promocion.productos.length} productos incluidos`
                                                })}
                                            </p>
                                        </div>
                                    )}

                                    {/* Dates */}
                                    <div className={`text-xs text-white/70 mb-4 ${getModeClasses()}`}>
                                        <p>Válido hasta: {formatDate(promocion.fecha_fin)}</p>
                                    </div>

                                    {/* Action Button */}
                                    <button className={`w-full bg-white/20 dark:bg-white/10 hover:bg-white/30 dark:hover:bg-white/20 backdrop-blur-sm text-white font-medium py-3 px-6 rounded-full transition-all border border-white/30 hover:border-white/50 shadow-sm hover:shadow-md ${getModeClasses()}`}>
                                        {getTextByMode({
                                            niños: '🛍️ ¡Ver Ofertas!',
                                            jóvenes: 'Ver Productos',
                                            adultos: 'Ver Productos en Promoción'
                                        })}
                                    </button>

                                    {/* Urgency indicator for low days */}
                                    {daysRemaining <= 3 && daysRemaining > 0 && (
                                        <div className="absolute top-2 left-2 bg-red-500 dark:bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse shadow-md">
                                            {getTextByMode({
                                                niños: '¡ÚLTIMOS DÍAS!',
                                                jóvenes: '¡PRISA!',
                                                adultos: 'ÚLTIMOS DÍAS'
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Special effects */}
                                {settings.ageMode === 'niños' && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/0 via-yellow-300/10 to-yellow-300/0 dark:from-yellow-400/0 dark:via-yellow-400/5 dark:to-yellow-400/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                )}
                                {settings.ageMode === 'jóvenes' && (
                                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-white/30 dark:bg-white/20 rounded-full group-hover:scale-150 transition-transform"></div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Global CTA - Mejorado para dark/light mode */}
                <div className="text-center mt-8">
                    <button className={`bg-white text-purple-800 hover:bg-purple-50 dark:bg-purple-900 dark:text-white dark:hover:bg-purple-800 font-bold py-4 px-8 rounded-full text-lg transition-all hover:scale-105 shadow-lg hover:shadow-xl ${getModeClasses()}`}>
                        {getTextByMode({
                            niños: '🔍 ¡Ver Todas las Ofertas!',
                            jóvenes: 'Explorar Todas las Promociones',
                            adultos: 'Ver Todas las Promociones'
                        })}
                    </button>
                </div>
            </div>
        </section>
    );
}
