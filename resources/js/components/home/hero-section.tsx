import { useAppMode } from '@/contexts/AppModeContext';
import { Link } from '@inertiajs/react';

interface HeroSectionProps {
    totalProductos?: number;
    totalCategorias?: number;
    totalPromociones?: number;
}

export default function HeroSection({ 
    totalProductos = 0, 
    totalCategorias = 0, 
    totalPromociones = 0 
}: HeroSectionProps) {
    const { settings } = useAppMode();

    const getTextByMode = (textos: { niños: string; jóvenes: string; adultos: string }) => {
        return textos[settings.ageMode as keyof typeof textos] || textos.adultos;
    };

    const renderModeSpecificElements = () => {
        if (settings.ageMode === 'niños') {
            return (
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-300 rounded-full animate-bounce"></div>
                    <div className="absolute top-32 right-20 w-16 h-16 bg-pink-300 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
                    <div className="absolute bottom-20 left-32 w-12 h-12 bg-green-300 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
                </div>
            );
        }
        
        if (settings.ageMode === 'jóvenes') {
            return (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-500/30 to-cyan-500/30 rounded-full blur-3xl"></div>
                </div>
            );
        }

        return null;
    };

    return (
        <section className="relative h-[400px] md:h-[500px] overflow-hidden">
            {/* Background with gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 opacity-90"></div>
            
            {/* Mode-specific background elements */}
            {renderModeSpecificElements()}

            {/* Content */}
            <div className="container mx-auto px-4 h-full flex items-center relative z-10">
                <div className="max-w-2xl text-white">
                    <h1 className="text-adaptive text-3xl md:text-5xl font-bold mb-4">
                        {getTextByMode({
                            niños: '🌟 ¡Bienvenido a Nuestra Tienda Mágica! 🌟',
                            jóvenes: 'Descubre Productos Increíbles',
                            adultos: 'Bienvenido a Nuestra Tienda'
                        })}
                    </h1>
                    
                    <p className="text-adaptive text-lg md:text-xl mb-6 opacity-90">
                        {getTextByMode({
                            niños: `Explora nuestros ${totalProductos} productos súper divertidos en ${totalCategorias} categorías geniales.`,
                            jóvenes: `Explora nuestra colección premium de ${totalProductos} productos únicos organizados en ${totalCategorias} categorías especializadas.`,
                            adultos: `Descubra nuestra selección profesional de ${totalProductos} productos de calidad en ${totalCategorias} categorías especializadas.`
                        })}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="card-adaptive bg-white/20 backdrop-blur-sm p-4 text-center rounded-lg">
                            <div className="text-adaptive text-2xl font-bold">{totalProductos}</div>
                            <div className="text-adaptive text-sm">Productos</div>
                        </div>
                        <div className="card-adaptive bg-white/20 backdrop-blur-sm p-4 text-center rounded-lg">
                            <div className="text-adaptive text-2xl font-bold">{totalCategorias}</div>
                            <div className="text-adaptive text-sm">Categorías</div>
                        </div>
                        <div className="card-adaptive bg-white/20 backdrop-blur-sm p-4 text-center rounded-lg">
                            <div className="text-adaptive text-2xl font-bold">{totalPromociones}</div>
                            <div className="text-adaptive text-sm">Promociones</div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link 
                            href="/productos"
                            className="btn-adaptive bg-white text-gray-800 font-medium py-3 px-8 rounded-full hover:bg-gray-100 transition-all inline-block text-center"
                        >
                            {getTextByMode({
                                niños: '🛒 ¡Explorar Productos!',
                                jóvenes: '🔥 Explorar Catálogo',
                                adultos: 'Ver Productos'
                            })}
                        </Link>
                        <Link 
                            href="/promociones"
                            className="btn-adaptive border-2 border-white text-white font-medium py-3 px-8 rounded-full hover:bg-white hover:text-gray-800 transition-all inline-block text-center"
                        >
                            {getTextByMode({
                                niños: '🎁 Ver Ofertas',
                                jóvenes: '💫 Ver Promociones',
                                adultos: 'Ver Promociones'
                            })}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
} 