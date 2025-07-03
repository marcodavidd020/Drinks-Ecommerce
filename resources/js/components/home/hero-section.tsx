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
                return 'bg-gradient-to-br from-cyan-400 via-blue-500 to-emerald-500 dark:from-cyan-600 dark:via-blue-700 dark:to-emerald-700';
            case 'jóvenes':
                return 'bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 dark:from-blue-800 dark:via-cyan-800 dark:to-teal-800';
            default:
                return 'bg-gradient-to-br from-cyan-700 via-blue-700 to-emerald-700 dark:from-cyan-900 dark:via-blue-900 dark:to-emerald-900';
        }
    };

    return (
        <section className={`py-20 md:py-32 relative overflow-hidden transition-all duration-300 ${getModeBackgroundClasses()}`}>
            {/* Elementos decorativos de fondo */}
            <div className="absolute inset-0">
                {settings.ageMode === 'niños' && (
                    <>
                        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 dark:bg-white/5 rounded-full animate-bounce opacity-70"></div>
                        <div className="absolute bottom-20 right-10 w-24 h-24 bg-white/10 dark:bg-white/5 rounded-full animate-bounce opacity-70" style={{ animationDelay: '1s' }}></div>
                        <div className="absolute top-1/2 left-1/3 text-8xl animate-pulse opacity-20">🧃</div>
                        <div className="absolute top-1/4 right-1/4 text-6xl animate-pulse opacity-20" style={{ animationDelay: '1.5s' }}>🥤</div>
                        <div className="absolute bottom-1/4 left-1/4 text-7xl animate-pulse opacity-20" style={{ animationDelay: '2s' }}>💧</div>
                    </>
                )}
                {settings.ageMode === 'jóvenes' && (
                    <>
                        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 dark:bg-white/3 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 dark:bg-white/3 rounded-full blur-3xl"></div>
                        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-white rounded-full animate-ping"></div>
                        <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-white rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                    </>
                )}
                {settings.ageMode === 'adultos' && (
                    <>
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/3 dark:bg-white/2 rounded-full blur-2xl"></div>
                        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/3 dark:bg-white/2 rounded-full blur-2xl"></div>
                    </>
                )}
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-5xl mx-auto">
                    {/* Título principal */}
                    <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight drop-shadow-lg ${getModeClasses()}`}>
                        {getTextByMode({
                            niños: '🧃 ¡Bienvenido a Arturo! 🥤',
                            jóvenes: '🔥 Arturo - Your Hydration Station',
                            adultos: 'Arturo - Tu Tienda de Bebidas de Confianza'
                        })}
                    </h1>

                    {/* Subtítulo */}
                    <p className={`text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-md ${getModeClasses()}`}>
                        {getTextByMode({
                            niños: 'Las bebidas más deliciosas y refrescantes para todos los momentos súper especiales. ¡Jugos, sodas, aguas y mucho más!',
                            jóvenes: 'Discover the perfect drink for every vibe - from energizing smoothies to refreshing sodas that keep you going.',
                            adultos: 'Descubre nuestra selección premium de bebidas refrescantes: jugos naturales, sodas artesanales, aguas saborizadas y bebidas especiales para cada ocasión.'
                        })}
                    </p>

                    {/* Estadísticas destacadas - Mejoradas para dark/light mode */}
                    <div className="grid grid-cols-3 gap-4 md:gap-8 mb-12 max-w-2xl mx-auto">
                        <div className="text-center bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/20 transition-all duration-300 hover:bg-white/20 dark:hover:bg-white/10">
                            <div className={`text-2xl md:text-4xl font-bold text-white mb-2 ${getModeClasses()}`}>
                                {settings.ageMode === 'niños' && '🧃 '}
                                {totalProductos}+
                            </div>
                            <div className={`text-white/80 text-xs md:text-base ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: 'Bebidas Ricas',
                                    jóvenes: 'Bebidas Cool',
                                    adultos: 'Tipos de Bebidas'
                                })}
                            </div>
                        </div>
                        <div className="text-center bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/20 transition-all duration-300 hover:bg-white/20 dark:hover:bg-white/10">
                            <div className={`text-2xl md:text-4xl font-bold text-white mb-2 ${getModeClasses()}`}>
                                {settings.ageMode === 'niños' && '🥤 '}
                                {totalCategorias}+
                            </div>
                            <div className={`text-white/80 text-xs md:text-base ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: 'Tipos Geniales',
                                    jóvenes: 'Categorías',
                                    adultos: 'Categorías'
                                })}
                            </div>
                        </div>
                        <div className="text-center bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/20 transition-all duration-300 hover:bg-white/20 dark:hover:bg-white/10">
                            <div className={`text-2xl md:text-4xl font-bold text-white mb-2 ${getModeClasses()}`}>
                                {settings.ageMode === 'niños' && '🎉 '}
                                {totalPromociones > 0 ? `${totalPromociones}` : '¡Siempre!'}
                            </div>
                            <div className={`text-white/80 text-xs md:text-base ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: 'Ofertas Súper',
                                    jóvenes: 'Ofertas Cool',
                                    adultos: 'Promociones'
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Botones de acción - Mejorados para dark/light mode */}
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <Link
                            href="/catalogo/productos"
                            className={`bg-white text-cyan-800 hover:bg-cyan-50 dark:bg-cyan-900 dark:text-white dark:hover:bg-cyan-800 font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl ${getModeClasses()}`}
                        >
                            {getTextByMode({
                                niños: '🧃 ¡Ver Bebidas Geniales!',
                                jóvenes: '🥤 Explore Drinks',
                                adultos: 'Explorar Bebidas'
                            })}
                        </Link>

                        <Link
                            href="/catalogo/promociones"
                            className={`border-2 border-white text-white hover:bg-white hover:text-cyan-800 dark:hover:bg-gray-800 dark:hover:text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 backdrop-blur-sm ${getModeClasses()}`}
                        >
                            {getTextByMode({
                                niños: '🎁 ¡Ver Ofertas!',
                                jóvenes: '🔥 Hot Deals',
                                adultos: 'Ver Promociones'
                            })}
                        </Link>
                    </div>

                    {/* Indicador de scroll - sutil para todos los modos */}
                    <div className="mt-12 animate-bounce">
                        <div className="w-6 h-10 border-2 border-white/50 rounded-full mx-auto flex justify-center">
                            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
