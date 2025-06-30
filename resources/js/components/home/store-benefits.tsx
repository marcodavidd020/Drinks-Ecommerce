import { useAppMode } from '@/contexts/AppModeContext';

export default function StoreBenefits() {
    const { settings } = useAppMode();

    const getTextByMode = (textos: { niños: string; jóvenes: string; adultos: string }) => {
        return textos[settings.ageMode as keyof typeof textos] || textos.adultos;
    };

    const benefits = [
        {
            icon: '🚚',
            title: {
                niños: 'Bebidas Súper Rápidas',
                jóvenes: 'Entrega Express',
                adultos: 'Entrega Rápida'
            },
            description: {
                niños: '¡Tus bebidas favoritas llegan súper rápido y fresquitas! 🧊',
                jóvenes: 'Entrega el mismo día para que no te quedes sin tu bebida favorita',
                adultos: 'Entrega rápida con temperatura controlada para mantener frescura'
            }
        },
        {
            icon: '🥤',
            title: {
                niños: 'Bebidas de Calidad',
                jóvenes: 'Premium Quality',
                adultos: 'Calidad Premium'
            },
            description: {
                niños: '¡Solo las bebidas más ricas y frescas para ti! ⭐',
                jóvenes: 'Seleccionamos las mejores marcas y sabores',
                adultos: 'Bebidas de marcas reconocidas con fecha de vencimiento óptima'
            }
        },
        {
            icon: '🔄',
            title: {
                niños: 'Cambios Fáciles',
                jóvenes: 'Cambios Sin Problemas',
                adultos: 'Política de Cambios'
            },
            description: {
                niños: '¿No te gustó el sabor? ¡No hay problema! Lo cambiamos 😊',
                jóvenes: '30 días para cambios si no te convence el sabor',
                adultos: 'Política de cambio por sabor no satisfactorio hasta 30 días'
            }
        },
        {
            icon: '💧',
            title: {
                niños: 'Siempre Frescas',
                jóvenes: 'Cadena de Frío',
                adultos: 'Frescura Garantizada'
            },
            description: {
                niños: '¡Todas nuestras bebidas están súper fresquitas! 🧊',
                jóvenes: 'Mantenemos la cadena de frío hasta tu puerta',
                adultos: 'Sistema de refrigeración controlada desde almacén hasta entrega'
            }
        },
        {
            icon: '🌿',
            title: {
                niños: 'Bebidas Naturales',
                jóvenes: 'Ingredientes Naturales',
                adultos: 'Opciones Saludables'
            },
            description: {
                niños: '¡Tenemos jugos naturales sin cosas raras! 🍎',
                jóvenes: 'Amplia selección de bebidas con ingredientes naturales',
                adultos: 'Variedad de bebidas naturales sin conservantes artificiales'
            }
        },
        {
            icon: '💰',
            title: {
                niños: 'Precios Geniales',
                jóvenes: 'Mejores Precios',
                adultos: 'Precios Competitivos'
            },
            description: {
                niños: '¡Las bebidas más ricas a los mejores precios! 💝',
                jóvenes: 'Garantizamos los mejores precios en bebidas',
                adultos: 'Precios competitivos con promociones especiales en bebidas'
            }
        }
    ];

    const getIconStyle = () => {
        const baseClass = "w-16 h-16 mx-auto bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-3xl";
        switch (settings.ageMode) {
            case 'niños':
                return `${baseClass} group-hover:animate-bounce`;
            case 'jóvenes':
                return `${baseClass} group-hover:scale-110 transition-transform`;
            default:
                return `${baseClass} group-hover:scale-105 transition-transform`;
        }
    };

    const renderSpecialEffects = () => {
        if (settings.ageMode === 'niños') {
            return (
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-100/0 via-cyan-100/20 to-cyan-100/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
            );
        }
        
        if (settings.ageMode === 'jóvenes') {
            return (
                <>
                    <div className="absolute inset-0 w-16 h-16 mx-auto rounded-full border-2 border-cyan-300 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300"></div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all"></div>
                </>
            );
        }

        return null;
    };

    return (
        <section className="py-16 bg-gradient-to-br from-cyan-50 to-blue-50 dark:bg-gray-900">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-adaptive text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        {getTextByMode({
                            niños: '✨ ¿Por Qué BebiFresh es Genial? ✨',
                            jóvenes: '🌟 Por Qué Somos Tu Best Choice',
                            adultos: 'Beneficios de BebiFresh'
                        })}
                    </h2>
                    <p className="text-adaptive text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        {getTextByMode({
                            niños: '¡Descubre todas las cosas increíbles que hacemos para que tengas las mejores bebidas!',
                            jóvenes: 'Descubre por qué somos la mejor opción para tus bebidas favoritas',
                            adultos: 'Conoce las ventajas de elegir BebiFresh para todas tus bebidas'
                        })}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {benefits.map((benefit, index) => (
                        <div 
                            key={index}
                            className="card-adaptive bg-white dark:bg-gray-800 p-6 rounded-lg text-center group hover:shadow-lg transition-all duration-300 relative border-l-4 border-cyan-500"
                        >
                            {/* Icon */}
                            <div className="mb-4 relative">
                                <div className={getIconStyle()}>
                                    {benefit.icon}
                                </div>
                            </div>

                            {/* Title */}
                            <h3 className="text-adaptive text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-cyan-600 transition-colors">
                                {getTextByMode(benefit.title)}
                            </h3>

                            {/* Description */}
                            <p className="text-adaptive text-gray-600 dark:text-gray-400 leading-relaxed">
                                {getTextByMode(benefit.description)}
                            </p>

                            {/* Special effects */}
                            {renderSpecialEffects()}
                        </div>
                    ))}
                </div>

                {/* Additional trust indicators - temática de bebidas */}
                <div className="mt-16 text-center">
                    <div className="inline-flex items-center space-x-8 text-gray-500 dark:text-gray-400 flex-wrap justify-center gap-4">
                        <div className="flex items-center space-x-2">
                            <span className="text-cyan-500">✓</span>
                            <span className="text-adaptive text-sm">
                                {getTextByMode({
                                    niños: '¡Súper Frescas!',
                                    jóvenes: '100% Fresh',
                                    adultos: 'Frescura Garantizada'
                                })}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-cyan-500">✓</span>
                            <span className="text-adaptive text-sm">
                                {getTextByMode({
                                    niños: '¡Miles de Amigos Sedientos!',
                                    jóvenes: '+10K Hydrated Customers',
                                    adultos: '+10,000 Clientes Satisfechos'
                                })}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-cyan-500">✓</span>
                            <span className="text-adaptive text-sm">
                                {getTextByMode({
                                    niños: '¡Bebidas 5 Estrellitas!',
                                    jóvenes: '5★ Rated Beverages',
                                    adultos: 'Bebidas 5 Estrellas'
                                })}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-cyan-500">🧃</span>
                            <span className="text-adaptive text-sm">
                                {getTextByMode({
                                    niños: '¡Sin Alcohol!',
                                    jóvenes: 'Non-Alcoholic Only',
                                    adultos: 'Solo Bebidas No Alcohólicas'
                                })}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
} 
