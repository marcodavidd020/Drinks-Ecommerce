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
                    <h2 className="text-adaptive text-2xl md:text-3xl font-bold text-white mb-2">
                        <span className="mode-niños">🎉 ¡Ofertas Súper Especiales! 🎉</span>
                        <span className="mode-jóvenes">🔥 Promociones Exclusivas</span>
                        <span className="mode-adultos">Promociones Vigentes</span>
                    </h2>
                    <p className="text-adaptive text-white/90">
                        <span className="mode-niños">¡No te pierdas estas increíbles ofertas!</span>
                        <span className="mode-jóvenes">Ofertas por tiempo limitado</span>
                        <span className="mode-adultos">Aprovecha estas ofertas por tiempo limitado</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activePromotions.map((promocion, index) => {
                        const daysRemaining = getDaysRemaining(promocion.fecha_fin);
                        const gradients = [
                            'from-blue-500 to-purple-600',
                            'from-green-500 to-teal-600',
                            'from-yellow-500 to-orange-600',
                            'from-pink-500 to-red-600',
                        ];
                        const gradient = gradients[index % gradients.length];

                        return (
                            <div 
                                key={promocion.id}
                                className={`card-adaptive bg-gradient-to-br ${gradient} rounded-xl p-6 text-white relative overflow-hidden group cursor-pointer hover:scale-105 transition-all duration-300`}
                            >
                                {/* Background decorations */}
                                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full mode-niños animate-bounce"></div>
                                <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/10 rounded-full mode-niños animate-bounce" style={{animationDelay: '1s'}}></div>
                                
                                {/* Glassmorphism effect for teen mode */}
                                <div className="mode-jóvenes absolute inset-0 bg-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>

                                <div className="relative z-10">
                                    {/* Header */}
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-adaptive text-xl font-bold">
                                            {promocion.nombre}
                                        </h3>
                                        <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                            <span className="text-adaptive text-sm font-medium">
                                                <span className="mode-niños">🕐 {daysRemaining} días</span>
                                                <span className="mode-jóvenes">{daysRemaining}d</span>
                                                <span className="mode-adultos">{daysRemaining} días</span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    {promocion.descuento && (
                                        <p className="text-adaptive text-white/90 mb-4">
                                            {promocion.descuento}
                                        </p>
                                    )}

                                    {/* Products count */}
                                    {promocion.productos && promocion.productos.length > 0 && (
                                        <div className="mb-4">
                                            <p className="text-adaptive text-sm text-white/80">
                                                <span className="mode-niños">
                                                    ¡{promocion.productos.length} productos en oferta! 🎁
                                                </span>
                                                <span className="mode-jóvenes">
                                                    {promocion.productos.length} productos incluidos
                                                </span>
                                                <span className="mode-adultos">
                                                    {promocion.productos.length} productos incluidos
                                                </span>
                                            </p>
                                        </div>
                                    )}

                                    {/* Dates */}
                                    <div className="text-adaptive text-xs text-white/70 mb-4">
                                        <p>Válido hasta: {formatDate(promocion.fecha_fin)}</p>
                                    </div>

                                    {/* Action Button */}
                                    <button className="btn-adaptive w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-medium py-3 px-6 rounded-full transition-all border border-white/30 hover:border-white/50">
                                        <span className="mode-niños">🛍️ ¡Ver Ofertas!</span>
                                        <span className="mode-jóvenes">Ver Productos</span>
                                        <span className="mode-adultos">Ver Productos en Promoción</span>
                                    </button>

                                    {/* Urgency indicator for low days */}
                                    {daysRemaining <= 3 && daysRemaining > 0 && (
                                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                                            <span className="mode-niños">¡ÚLTIMOS DÍAS!</span>
                                            <span className="mode-jóvenes">¡PRISA!</span>
                                            <span className="mode-adultos">ÚLTIMOS DÍAS</span>
                                        </div>
                                    )}
                                </div>

                                {/* Special effects */}
                                <div className="mode-niños absolute inset-0 bg-gradient-to-r from-yellow-300/0 via-yellow-300/10 to-yellow-300/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="mode-jóvenes absolute -top-2 -right-2 w-4 h-4 bg-white/30 rounded-full group-hover:scale-150 transition-transform"></div>
                            </div>
                        );
                    })}
                </div>

                {/* Global CTA */}
                <div className="text-center mt-8">
                    <button className="btn-adaptive bg-white text-purple-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-full text-lg transition-all hover:scale-105">
                        <span className="mode-niños">🔍 ¡Ver Todas las Ofertas!</span>
                        <span className="mode-jóvenes">Explorar Todas las Promociones</span>
                        <span className="mode-adultos">Ver Todas las Promociones</span>
                    </button>
                </div>
            </div>
        </section>
    );
}
