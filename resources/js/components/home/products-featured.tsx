import { useAppMode } from '@/contexts/AppModeContext';
import { Link } from '@inertiajs/react';
import { formatCurrency } from '@/lib/currency';

interface Producto {
    id: number;
    cod_producto: string;
    nombre: string;
    precio_compra: number;
    precio_venta: number;
    imagen?: string;
    descripcion?: string;
    categoria?: {
        id: number;
        nombre: string;
    };
    stock_total: number;
    total_vendido?: number;
    descuento?: number;
}

interface ProductsFeaturedProps {
    productos: Producto[];
    title: string;
    subtitle?: string;
}

export default function ProductsFeatured({ productos }: ProductsFeaturedProps) {
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

    // Obtener imagen por defecto según la categoría
    const getDefaultImage = (producto: Producto) => {
        const categoria = producto.categoria?.nombre.toLowerCase() || '';
        
        // Mapeo de categorías a imágenes placeholder
        const categoryImages: { [key: string]: string } = {
            'tecnología': 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=300&fit=crop',
            'electrónicos': 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=300&fit=crop',
            'deportes': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
            'música': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
            'libros': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
            'ropa': 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=300&fit=crop',
            'hogar': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
            'juguetes': 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=300&fit=crop',
            'cocina': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
            'automóviles': 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&h=300&fit=crop'
        };

        // Buscar por categoría
        for (const [key, image] of Object.entries(categoryImages)) {
            if (categoria.includes(key)) {
                return image;
            }
        }

        // Imagen por defecto genérica
        return 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop';
    };

    // Calcular descuento si aplicable
    const getDiscountPercentage = (producto: Producto) => {
        if (producto.precio_compra >= producto.precio_venta) return 0;
        return Math.round(((producto.precio_venta - producto.precio_compra) / producto.precio_venta) * 100);
    };

    const getStockStatus = (stock: number) => {
        if (stock === 0) {
            return {
                text: getTextByMode({
                    niños: '😢 Agotado',
                    jóvenes: '❌ Out of Stock',
                    adultos: 'Agotado'
                }),
                color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            };
        } else if (stock < 10) {
            return {
                text: getTextByMode({
                    niños: '⚠️ Pocas unidades',
                    jóvenes: '⚠️ Low Stock',
                    adultos: 'Stock Limitado'
                }),
                color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
            };
        } else {
            return {
                text: getTextByMode({
                    niños: '✅ Disponible',
                    jóvenes: '✅ In Stock',
                    adultos: 'Disponible'
                }),
                color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            };
        }
    };

    const getHoverEffect = () => {
        switch (settings.ageMode) {
            case 'niños':
                return 'hover:scale-105 hover:rotate-1 hover:shadow-2xl';
            case 'jóvenes':
                return 'hover:scale-102 hover:-translate-y-1 hover:shadow-xl';
            default:
                return 'hover:scale-101 hover:shadow-lg';
        }
    };

    if (!productos || productos.length === 0) {
        return (
            <div className={`text-center py-12 ${getModeClasses()}`}>
                <div className="text-6xl mb-4">
                    {settings.ageMode === 'niños' ? '😔' : '📦'}
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    {getTextByMode({
                        niños: '¡No hay productos todavía!',
                        jóvenes: 'No products available',
                        adultos: 'No hay productos disponibles'
                    })}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                    {getTextByMode({
                        niños: 'Los productos aparecerán aquí pronto',
                        jóvenes: 'Products will appear here when available',
                        adultos: 'Los productos aparecerán una vez que sean agregados'
                    })}
                </p>
            </div>
        );
    }

    return (
        <div className={`w-full ${getModeClasses()}`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {productos.slice(0, 10).map((producto) => {
                    const discount = getDiscountPercentage(producto);
                    const stockStatus = getStockStatus(producto.stock_total);
                    const productImage = producto.imagen || getDefaultImage(producto);

                    return (
                        <Link
                            key={producto.id}
                            href={`/productos/${producto.id}`}
                            className={`group relative bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden transition-all duration-300 ${getHoverEffect()}`}
                        >
                            {/* Imagen del producto */}
                            <div className="relative aspect-square overflow-hidden">
                                <img
                                    src={productImage}
                                    alt={producto.nombre}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    onError={(e) => {
                                        // Si la imagen falla, usar placeholder por defecto
                                        e.currentTarget.src = getDefaultImage(producto);
                                    }}
                                />
                                
                                {/* Overlay con efectos por modo */}
                                {settings.ageMode === 'niños' && (
                                    <div className="absolute inset-0 bg-gradient-to-t from-pink-200/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                )}
                                {settings.ageMode === 'jóvenes' && (
                                    <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                )}

                                {/* Badge de descuento */}
                                {discount > 0 && (
                                    <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-bold ${
                                        settings.ageMode === 'niños' 
                                            ? 'bg-yellow-400 text-gray-900' 
                                            : settings.ageMode === 'jóvenes'
                                            ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                                            : 'bg-red-600 text-white'
                                    }`}>
                                        {settings.ageMode === 'niños' && '🎉 '}
                                        -{discount}%
                                    </div>
                                )}

                                {/* Badge de stock */}
                                <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                                    {stockStatus.text}
                                </div>

                                {/* Indicador de más vendido */}
                                {producto.total_vendido && producto.total_vendido > 50 && (
                                    <div className={`absolute bottom-2 left-2 px-2 py-1 rounded-full text-xs font-bold ${
                                        settings.ageMode === 'niños'
                                            ? 'bg-green-400 text-gray-900'
                                            : 'bg-green-600 text-white'
                                    }`}>
                                        {settings.ageMode === 'niños' ? '🏆 Popular' : '🔥 Best Seller'}
                                    </div>
                                )}
                            </div>

                            {/* Información del producto */}
                            <div className="p-4">
                                {/* Categoría */}
                                {producto.categoria && (
                                    <div className={`text-xs font-medium mb-2 ${
                                        settings.ageMode === 'niños' 
                                            ? 'text-purple-600 dark:text-purple-400' 
                                            : 'text-gray-500 dark:text-gray-400'
                                    }`}>
                                        {producto.categoria.nombre}
                                    </div>
                                )}

                                {/* Nombre del producto */}
                                <h3 className={`font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors ${getModeClasses()}`}>
                                    {producto.nombre}
                                </h3>

                                {/* Código del producto */}
                                <p className={`text-xs text-gray-500 dark:text-gray-400 mb-2 ${getModeClasses()}`}>
                                    {getTextByMode({
                                        niños: '🔢',
                                        jóvenes: 'SKU:',
                                        adultos: 'Código:'
                                    })} {producto.cod_producto}
                                </p>

                                {/* Descripción corta */}
                                {producto.descripcion && (
                                    <p className={`text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 ${getModeClasses()}`}>
                                        {producto.descripcion}
                                    </p>
                                )}

                                {/* Precio */}
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className={`text-lg font-bold text-blue-600 dark:text-blue-400 ${getModeClasses()}`}>
                                            {formatCurrency(producto.precio_venta)}
                                        </span>
                                        {discount > 0 && (
                                            <span className={`text-xs text-gray-500 dark:text-gray-400 line-through ${getModeClasses()}`}>
                                                {formatCurrency(producto.precio_compra)}
                                            </span>
                                        )}
                                    </div>

                                    {/* Botón de acción */}
                                    <button 
                                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                                            producto.stock_total > 0
                                                ? settings.ageMode === 'niños'
                                                    ? 'bg-pink-500 hover:bg-pink-600 text-white'
                                                    : settings.ageMode === 'jóvenes'
                                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                                                : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                        } ${getModeClasses()}`}
                                        disabled={producto.stock_total === 0}
                                    >
                                        {producto.stock_total > 0 ? getTextByMode({
                                            niños: '🛒',
                                            jóvenes: '+ Cart',
                                            adultos: 'Agregar'
                                        }) : getTextByMode({
                                            niños: '😢',
                                            jóvenes: 'N/A',
                                            adultos: 'Agotado'
                                        })}
                                    </button>
                                </div>

                                {/* Stock disponible */}
                                <div className={`text-xs text-gray-500 dark:text-gray-400 mt-2 ${getModeClasses()}`}>
                                    {getTextByMode({
                                        niños: `📦 ${producto.stock_total} disponibles`,
                                        jóvenes: `${producto.stock_total} in stock`,
                                        adultos: `${producto.stock_total} disponibles`
                                    })}
                                </div>
                            </div>

                            {/* Elementos decorativos por modo */}
                            {settings.ageMode === 'niños' && (
                                <>
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-300/40 rounded-full animate-ping"></div>
                                    <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-pink-300/40 rounded-full animate-pulse"></div>
                                </>
                            )}

                            {settings.ageMode === 'jóvenes' && (
                                <div className="absolute top-2 right-2 w-2 h-2 bg-white/60 rounded-full group-hover:scale-150 transition-transform"></div>
                            )}
                        </Link>
                    );
                })}
            </div>

            {/* Botón para ver más productos */}
            {productos.length > 10 && (
                <div className="text-center mt-8">
                    <Link
                        href="/productos"
                        className={`inline-flex items-center px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                            settings.ageMode === 'niños'
                                ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                                : settings.ageMode === 'jóvenes'
                                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                        } ${getModeClasses()}`}
                    >
                        {getTextByMode({
                            niños: '🔍 ¡Ver Más Cositas Geniales!',
                            jóvenes: '🚀 Explore More Products',
                            adultos: 'Ver Todos los Productos'
                        })}
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            )}
        </div>
    );
} 
