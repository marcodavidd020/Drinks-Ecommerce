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
                niños: 'Entrega Súper Rápida',
                jóvenes: 'Delivery Express',
                adultos: 'Entrega Rápida'
            },
            description: {
                niños: '¡Tus productos llegan súper rápido a tu casa! 🏠',
                jóvenes: 'Entrega el mismo día en áreas seleccionadas',
                adultos: 'Entrega gratuita en pedidos superiores a $50.000'
            }
        },
        {
            icon: '🏆',
            title: {
                niños: 'Calidad Premium',
                jóvenes: 'Productos de Calidad',
                adultos: 'Calidad Premium'
            },
            description: {
                niños: '¡Solo los mejores productos para ti! ⭐',
                jóvenes: 'Seleccionamos cuidadosamente cada producto',
                adultos: 'Garantizamos la más alta calidad en todos nuestros productos'
            }
        },
        {
            icon: '🔄',
            title: {
                niños: 'Cambios Fáciles',
                jóvenes: 'Devoluciones Sin Problemas',
                adultos: 'Política de Devoluciones'
            },
            description: {
                niños: '¿No te gustó? ¡No hay problema! Lo cambiamos 😊',
                jóvenes: '30 días para cambios sin preguntas',
                adultos: 'Política de devolución de 30 días sin complicaciones'
            }
        },
        {
            icon: '💬',
            title: {
                niños: 'Ayuda Siempre',
                jóvenes: 'Soporte 24/7',
                adultos: 'Atención al Cliente'
            },
            description: {
                niños: '¡Siempre estamos aquí para ayudarte! 🤗',
                jóvenes: 'Soporte disponible cuando lo necesites',
                adultos: 'Nuestro equipo está disponible 24/7 para asistirle'
            }
        },
        {
            icon: '🔒',
            title: {
                niños: 'Compra Segura',
                jóvenes: 'Pagos Seguros',
                adultos: 'Transacciones Seguras'
            },
            description: {
                niños: '¡Tu información está súper protegida! 🛡️',
                jóvenes: 'Métodos de pago completamente seguros',
                adultos: 'Transacciones protegidas con la más alta seguridad'
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
                niños: '¡Los mejores precios para ti! 💝',
                jóvenes: 'Garantizamos los mejores precios del mercado',
                adultos: 'Ofrecemos precios competitivos y promociones exclusivas'
            }
        }
    ];

    const getIconStyle = () => {
        const baseClass = "w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-3xl";
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
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-100/0 via-yellow-100/20 to-yellow-100/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
            );
        }
        
        if (settings.ageMode === 'jóvenes') {
            return (
                <>
                    <div className="absolute inset-0 w-16 h-16 mx-auto rounded-full border-2 border-purple-300 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300"></div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all"></div>
                </>
            );
        }

        return null;
    };

    return (
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-adaptive text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        {getTextByMode({
                            niños: '✨ ¿Por Qué Somos Geniales? ✨',
                            jóvenes: '🌟 Por Qué Elegirnos',
                            adultos: 'Nuestros Beneficios'
                        })}
                    </h2>
                    <p className="text-adaptive text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        {getTextByMode({
                            niños: '¡Descubre todas las cosas increíbles que hacemos por ti!',
                            jóvenes: 'Descubre las ventajas de comprar con nosotros',
                            adultos: 'Conoce las ventajas de elegir nuestra tienda para tus compras'
                        })}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {benefits.map((benefit, index) => (
                        <div 
                            key={index}
                            className="card-adaptive bg-white dark:bg-gray-800 p-6 rounded-lg text-center group hover:shadow-lg transition-all duration-300 relative"
                        >
                            {/* Icon */}
                            <div className="mb-4 relative">
                                <div className={getIconStyle()}>
                                    {benefit.icon}
                                </div>
                            </div>

                            {/* Title */}
                            <h3 className="text-adaptive text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-blue-600 transition-colors">
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

                {/* Additional trust indicators */}
                <div className="mt-16 text-center">
                    <div className="inline-flex items-center space-x-8 text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-2">
                            <span className="text-green-500">✓</span>
                            <span className="text-adaptive text-sm">
                                {getTextByMode({
                                    niños: '¡Súper Seguro!',
                                    jóvenes: '100% Seguro',
                                    adultos: 'Certificado SSL'
                                })}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-green-500">✓</span>
                            <span className="text-adaptive text-sm">
                                {getTextByMode({
                                    niños: '¡Miles de Amigos!',
                                    jóvenes: '+10K Clientes',
                                    adultos: '+10,000 Clientes Satisfechos'
                                })}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-green-500">✓</span>
                            <span className="text-adaptive text-sm">
                                {getTextByMode({
                                    niños: '¡5 Estrellitas!',
                                    jóvenes: '5★ Rating',
                                    adultos: 'Calificación 5 Estrellas'
                                })}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
} 
