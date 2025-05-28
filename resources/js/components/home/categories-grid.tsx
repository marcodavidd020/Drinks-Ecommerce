import { useAppMode } from '@/contexts/AppModeContext';
import { Link } from '@inertiajs/react';

interface Categoria {
    id: number;
    nombre: string;
    descripcion?: string;
    productos_count: number;
}

interface CategoriesGridProps {
    categorias: Categoria[];
}

export default function CategoriesGrid({ categorias }: CategoriesGridProps) {
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

    // Obtener iconos emoji dinámicos según la categoría y el modo
    const getCategoryIcon = (categoria: string) => {
        const iconMap: { [key: string]: { niños: string; jóvenes: string; adultos: string } } = {
            'tecnología': { niños: '🤖', jóvenes: '💻', adultos: '⚙️' },
            'electrónicos': { niños: '📱', jóvenes: '🎮', adultos: '🔌' },
            'deportes': { niños: '⚽', jóvenes: '🏀', adultos: '🏋️' },
            'música': { niños: '🎵', jóvenes: '🎧', adultos: '🎼' },
            'libros': { niños: '📚', jóvenes: '📖', adultos: '📰' },
            'ropa': { niños: '👕', jóvenes: '👟', adultos: '👔' },
            'hogar': { niños: '🏠', jóvenes: '🛏️', adultos: '🛋️' },
            'juguetes': { niños: '🧸', jóvenes: '🎯', adultos: '🎲' },
            'cocina': { niños: '🍰', jóvenes: '🍕', adultos: '🍽️' },
            'automóviles': { niños: '🚗', jóvenes: '🏎️', adultos: '🚙' },
            'default': { niños: '🎁', jóvenes: '📦', adultos: '📋' }
        };

        const nombreLower = categoria.toLowerCase();
        for (const [key, icons] of Object.entries(iconMap)) {
            if (nombreLower.includes(key)) {
                return icons[settings.ageMode as keyof typeof icons] || icons.adultos;
            }
        }
        return iconMap.default[settings.ageMode as keyof typeof iconMap.default] || iconMap.default.adultos;
    };

    // Obtener colores según el modo
    const getModeColors = (index: number) => {
        const colors = {
            niños: [
                'from-pink-400 to-purple-500',
                'from-blue-400 to-cyan-500', 
                'from-green-400 to-teal-500',
                'from-yellow-400 to-orange-500',
                'from-purple-400 to-pink-500',
                'from-red-400 to-pink-500'
            ],
            jóvenes: [
                'from-indigo-500 to-purple-600',
                'from-purple-500 to-pink-600',
                'from-blue-500 to-indigo-600',
                'from-green-500 to-teal-600',
                'from-red-500 to-pink-600',
                'from-yellow-500 to-orange-600'
            ],
            adultos: [
                'from-gray-600 to-gray-800',
                'from-blue-600 to-indigo-800',
                'from-green-600 to-teal-800',
                'from-purple-600 to-indigo-800',
                'from-red-600 to-pink-800',
                'from-yellow-600 to-orange-800'
            ]
        };

        const modeColors = colors[settings.ageMode as keyof typeof colors] || colors.adultos;
        return modeColors[index % modeColors.length];
    };

    // Efectos hover por modo
    const getHoverEffect = () => {
        switch (settings.ageMode) {
            case 'niños':
                return 'hover:scale-110 hover:rotate-2 hover:shadow-2xl';
            case 'jóvenes':
                return 'hover:scale-105 hover:-translate-y-2 hover:shadow-2xl';
            default:
                return 'hover:scale-102 hover:shadow-lg';
        }
    };

    if (!categorias || categorias.length === 0) {
        return (
            <div className={`text-center py-12 ${getModeClasses()}`}>
                <div className="text-6xl mb-4">
                    {settings.ageMode === 'niños' ? '😔' : '📦'}
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    {getTextByMode({
                        niños: '¡No hay categorías todavía!',
                        jóvenes: 'No hay categorías disponibles',
                        adultos: 'No se encontraron categorías'
                    })}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                    {getTextByMode({
                        niños: 'Las categorías aparecerán aquí cuando estén listas',
                        jóvenes: 'Las categorías se mostrarán cuando estén disponibles',
                        adultos: 'Las categorías aparecerán una vez que sean agregadas al sistema'
                    })}
                </p>
            </div>
        );
    }

    return (
        <div className={`w-full ${getModeClasses()}`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categorias.map((categoria, index) => (
                    <Link
                        key={categoria.id}
                        href={`/productos?categoria=${categoria.id}`}
                        className={`group relative overflow-hidden rounded-2xl transition-all duration-300 ${getHoverEffect()}`}
                    >
                        <div className={`bg-gradient-to-br ${getModeColors(index)} p-6 h-40 flex flex-col justify-between relative`}>
                            {/* Efecto de fondo específico por modo */}
                            {settings.ageMode === 'niños' && (
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-30 transition-opacity rounded-2xl"></div>
                            )}
                            {settings.ageMode === 'jóvenes' && (
                                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            )}
                            {settings.ageMode === 'adultos' && (
                                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                            )}

                            {/* Contenido */}
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-4xl">
                                        {getCategoryIcon(categoria.nombre)}
                                    </span>
                                    <span className={`px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium text-white ${getModeClasses()}`}>
                                        {categoria.productos_count} {getTextByMode({
                                            niños: categoria.productos_count === 1 ? 'cosa' : 'cosas',
                                            jóvenes: categoria.productos_count === 1 ? 'item' : 'items',
                                            adultos: categoria.productos_count === 1 ? 'producto' : 'productos'
                                        })}
                                    </span>
                                </div>

                                <h3 className={`text-white font-bold text-lg mb-2 group-hover:text-yellow-100 transition-colors ${getModeClasses()}`}>
                                    {categoria.nombre}
                                </h3>

                                {categoria.descripcion && (
                                    <p className={`text-white/80 text-sm line-clamp-2 ${getModeClasses()}`}>
                                        {categoria.descripcion}
                                    </p>
                                )}
                            </div>

                            {/* Indicador de acción */}
                            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                                <div className="w-8 h-8 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>

                            {/* Elementos decorativos por modo */}
                            {settings.ageMode === 'niños' && (
                                <>
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-300/30 rounded-full animate-pulse"></div>
                                    <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-pink-300/30 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
                                </>
                            )}

                            {settings.ageMode === 'jóvenes' && (
                                <div className="absolute top-2 right-2 w-3 h-3 bg-white/40 rounded-full group-hover:scale-150 transition-transform"></div>
                            )}
                        </div>
                    </Link>
                ))}
            </div>

            {/* Mensaje motivacional según el modo */}
            <div className={`text-center mt-12 ${getModeClasses()}`}>
                <p className="text-gray-600 dark:text-gray-400">
                    {getTextByMode({
                        niños: '¡Haz clic en cualquier categoría para ver cosas súper geniales! 🎉',
                        jóvenes: 'Explora cada categoría para descubrir productos únicos ✨',
                        adultos: 'Seleccione una categoría para explorar nuestros productos especializados'
                    })}
                </p>
            </div>
        </div>
    );
} 