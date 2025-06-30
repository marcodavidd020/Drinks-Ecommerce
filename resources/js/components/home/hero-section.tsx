import { Link } from '@inertiajs/react';
import { useAppMode } from '@/contexts/AppModeContext';

interface HeroSectionProps {
    totalProductos: number;
    totalCategorias: number;
    totalPromociones: number;
}

export default function HeroSection({ totalProductos, totalCategorias, totalPromociones }: HeroSectionProps) {
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

    const getModeBackgroundClasses = () => {
        switch (settings.ageMode) {
            case 'niños':
                return 'bg-gradient-to-br from-cyan-400 via-blue-500 to-emerald-500';
            case 'jóvenes':
                return 'bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600';
            default:
                return 'bg-gradient-to-br from-cyan-700 via-blue-700 to-emerald-700';
        }
    };

    return (
        <section className={`py-20 md:py-32 relative overflow-hidden ${getModeBackgroundClasses()}`}>
            {/* Elementos decorativos de fondo */}
            <div className="absolute inset-0">
                {settings.ageMode === 'niños' && (
                    <>
                        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full animate-bounce opacity-70"></div>
                        <div className="absolute bottom-20 right-10 w-24 h-24 bg-white/10 rounded-full animate-bounce opacity-70" style={{ animationDelay: '1s' }}></div>
                        <div className="absolute top-1/2 left-1/3 text-8xl animate-pulse opacity-20">🧃</div>
                        <div className="absolute top-1/4 right-1/4 text-6xl animate-pulse opacity-20" style={{ animationDelay: '1.5s' }}>🥤</div>
                        <div className="absolute bottom-1/4 left-1/4 text-7xl animate-pulse opacity-20" style={{ animationDelay: '2s' }}>💧</div>
                    </>
                )}
                {settings.ageMode === 'jóvenes' && (
                    <>
                        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
                        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-white rounded-full animate-ping"></div>
                        <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-white rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                    </>
                )}
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-5xl mx-auto">
                    {/* Título principal */}
                    <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight ${getModeClasses()}`}>
                        {getTextByMode({
                            niños: '🧃 ¡Bienvenido a BebiFresh! 🥤',
                            jóvenes: '🔥 BebiFresh - Your Hydration Station',
                            adultos: 'BebiFresh - Tu Tienda de Bebidas de Confianza'
                        })}
                    </h1>

                    {/* Subtítulo */}
                    <p className={`text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed ${getModeClasses()}`}>
                        {getTextByMode({
                            niños: 'Las bebidas más deliciosas y refrescantes para todos los momentos súper especiales. ¡Jugos, sodas, aguas y mucho más!',
                            jóvenes: 'Discover the perfect drink for every vibe - from energizing smoothies to refreshing sodas that keep you going.',
                            adultos: 'Descubre nuestra selección premium de bebidas refrescantes: jugos naturales, sodas artesanales, aguas saborizadas y bebidas especiales para cada ocasión.'
                        })}
                    </p>

                    {/* Estadísticas destacadas */}
                    <div className="grid grid-cols-3 gap-8 mb-12 max-w-2xl mx-auto">
                        <div className="text-center">
                            <div className={`text-3xl md:text-4xl font-bold text-white mb-2 ${getModeClasses()}`}>
                                {settings.ageMode === 'niños' && '🧃 '}
                                {totalProductos}+
                            </div>
                            <div className={`text-white/80 text-sm md:text-base ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: 'Bebidas Ricas',
                                    jóvenes: 'Bebidas Cool',
                                    adultos: 'Tipos de Bebidas'
                                })}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className={`text-3xl md:text-4xl font-bold text-white mb-2 ${getModeClasses()}`}>
                                {settings.ageMode === 'niños' && '🥤 '}
                                {totalCategorias}+
                            </div>
                            <div className={`text-white/80 text-sm md:text-base ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: 'Tipos Geniales',
                                    jóvenes: 'Categorías',
                                    adultos: 'Categorías'
                                })}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className={`text-3xl md:text-4xl font-bold text-white mb-2 ${getModeClasses()}`}>
                                {settings.ageMode === 'niños' && '🎉 '}
                                {totalPromociones > 0 ? `${totalPromociones}` : '¡Siempre!'}
                            </div>
                            <div className={`text-white/80 text-sm md:text-base ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: 'Ofertas Súper',
                                    jóvenes: 'Ofertas Cool',
                                    adultos: 'Promociones'
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <Link
                            href="/productos"
                            className={`bg-white text-cyan-700 hover:bg-gray-100 font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-xl ${getModeClasses()}`}
                        >
                            {getTextByMode({
                                niños: '🧃 ¡Ver Bebidas Geniales!',
                                jóvenes: '🥤 Explore Drinks',
                                adultos: 'Explorar Bebidas'
                            })}
                        </Link>

                        <Link
                            href="/promociones"
                            className={`border-2 border-white text-white hover:bg-white hover:text-cyan-700 font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 ${getModeClasses()}`}
                        >
                            {getTextByMode({
                                niños: '🎁 ¡Ver Ofertas!',
                                jóvenes: '🔥 Hot Deals',
                                adultos: 'Ver Promociones'
                            })}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
