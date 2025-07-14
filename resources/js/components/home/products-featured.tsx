import { useAppMode } from '@/contexts/AppModeContext';
import { Link, usePage, router } from '@inertiajs/react';
import { formatCurrency } from '@/lib/currency';
import { type SharedData } from '@/types';
import { useState, useEffect } from 'react';

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
    const page = usePage();
    const [addingToCart, setAddingToCart] = useState<number[]>([]);
    const [showSuccessMessage, setShowSuccessMessage] = useState<number | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    
    // Verificar si el usuario está autenticado y es cliente
    const { auth } = page.props as unknown as SharedData;
    const isAuthenticated = !!auth.user;
    
    // Verificar roles correctamente como en otros componentes
    const userRoles = (auth.user?.roles as Array<{ name: string }>) || [];
    const hasRole = (role: string): boolean => {
        return userRoles.some(r => r.name === role);
    };
    const hasAnyRole = (roles: string[]): boolean => {
        return roles.some(role => hasRole(role));
    };
    
    // Verificar que es cliente y NO tiene roles administrativos
    const isCliente = auth.user && hasRole('cliente') && 
                     !hasAnyRole(['admin', 'empleado', 'organizador', 'vendedor', 'almacenista']);

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

    // Función para agregar producto al carrito usando Inertia
    const agregarAlCarrito = async (productoId: number, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            window.location.href = '/login';
            return;
        }
        if (!isCliente) {
            alert(getTextByMode({
                niños: '🔒 Solo los clientes pueden agregar productos al carrito',
                jóvenes: 'Esta función es solo para clientes',
                adultos: 'Funcionalidad disponible solo para clientes'
            }));
            return;
        }
        if (addingToCart.includes(productoId)) return;
        setAddingToCart(prev => [...prev, productoId]);
        setErrorMessage(null);
        setShowSuccessMessage(null);
        router.post(
            '/carrito/agregar',
            { producto_id: productoId, cantidad: 1 },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setShowSuccessMessage(productoId);
                    setTimeout(() => setShowSuccessMessage(null), 1200);
                },
                onError: (errors) => {
                    setErrorMessage(errors.producto_id || errors.cantidad || 'Error al agregar producto al carrito');
                    alert(getTextByMode({
                        niños: '😰 ¡Ups! No se pudo agregar al carrito. ¡Intenta de nuevo!',
                        jóvenes: 'Error al agregar al carrito. Intenta nuevamente.',
                        adultos: 'Error al agregar producto al carrito. Intente nuevamente.'
                    }));
                },
                onFinish: () => {
                    setAddingToCart(prev => prev.filter(id => id !== productoId));
                }
            }
        );
    };

    // Manejar éxito y error del formulario
    useEffect(() => {
        if (errorMessage) {
            console.error('Error agregando al carrito:', errorMessage);
        }
    }, [errorMessage]);

    // Obtener imagen por defecto según la categoría para bebidas
    const getDefaultImage = (producto: Producto) => {
        const categoria = producto.categoria?.nombre.toLowerCase() || '';
        
        // Mapeo de categorías de bebidas a imágenes placeholder
        const categoryImages: { [key: string]: string } = {
            'jugos': 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&h=300&fit=crop',
            'aguas': 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=300&fit=crop',
            'refrescos': 'https://images.unsplash.com/photo-1581006852262-e94e74f8ba80?w=400&h=300&fit=crop',
            'cocteles': 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=300&fit=crop',
            'smoothies': 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400&h=300&fit=crop',
            'café': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
            'té': 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop'
        };

        // Buscar por categoría
        for (const [key, image] of Object.entries(categoryImages)) {
            if (categoria.includes(key)) {
                return image;
            }
        }

        // Imagen por defecto para bebidas
        return 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&h=300&fit=crop';
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
                    {settings.ageMode === 'niños' ? '😔' : '🧃'}
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    {getTextByMode({
                        niños: '¡No hay bebidas todavía!',
                        jóvenes: 'No drinks available',
                        adultos: 'No hay bebidas disponibles'
                    })}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                    {getTextByMode({
                        niños: 'Las bebidas más ricas aparecerán aquí pronto',
                        jóvenes: 'Drinks will appear here when available',
                        adultos: 'Las bebidas aparecerán una vez que sean agregadas'
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
                    const isProcessing = addingToCart.includes(producto.id);
                    const showSuccess = showSuccessMessage === producto.id;

                    return (
                        <div
                            key={producto.id}
                            className={`group relative bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden transition-all duration-300 ${getHoverEffect()}`}
                        >
                            {/* Imagen del producto */}
                            <Link href={`/product/${producto.id}`} className="block">
                                <div className="relative aspect-square overflow-hidden">
                                    <img
                                        src={productImage}
                                        alt={producto.nombre}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                        onError={(e) => {
                                            if (e.currentTarget.src !== getDefaultImage(producto)) {
                                                e.currentTarget.src = getDefaultImage(producto);
                                            }
                                        }}
                                    />
                                    
                                    {/* Overlay con efectos por modo */}
                                    {settings.ageMode === 'niños' && (
                                        <div className="absolute inset-0 bg-gradient-to-t from-cyan-200/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    )}
                                    {settings.ageMode === 'jóvenes' && (
                                        <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
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

                                    {/* Mensaje de éxito */}
                                    {showSuccessMessage === producto.id && (
                                        <div className="absolute inset-0 bg-green-500/90 flex items-center justify-center">
                                            <div className="text-white text-center">
                                                <div className="text-2xl mb-1">✅</div>
                                                <div className="text-xs font-medium">
                                                    {getTextByMode({
                                                        niños: '¡Agregado!',
                                                        jóvenes: 'Added!',
                                                        adultos: 'Agregado'
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Link>

                            {/* Información del producto */}
                            <div className="p-4">
                                {/* Categoría */}
                                {producto.categoria && (
                                    <div className={`text-xs font-medium mb-2 ${
                                        settings.ageMode === 'niños' 
                                            ? 'text-cyan-600 dark:text-cyan-400' 
                                            : 'text-gray-500 dark:text-gray-400'
                                    }`}>
                                        {producto.categoria.nombre}
                                    </div>
                                )}

                                {/* Nombre del producto */}
                                <Link href={`/product/${producto.id}`}>
                                    <h3 className={`font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors ${getModeClasses()}`}>
                                        {producto.nombre}
                                    </h3>
                                </Link>

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

                                {/* Precio y botón de carrito */}
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className={`text-lg font-bold text-cyan-600 dark:text-cyan-400 ${getModeClasses()}`}>
                                            {formatCurrency(producto.precio_venta)}
                                        </span>
                                        {discount > 0 && (
                                            <span className={`text-xs text-gray-500 dark:text-gray-400 line-through ${getModeClasses()}`}>
                                                {formatCurrency(producto.precio_compra)}
                                            </span>
                                        )}
                                    </div>

                                    {/* Botón de agregar al carrito */}
                                    <button 
                                        onClick={(e) => agregarAlCarrito(producto.id, e)}
                                        disabled={producto.stock_total === 0 || addingToCart.includes(producto.id)}
                                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-all disabled:cursor-not-allowed ${
                                            producto.stock_total > 0 && !addingToCart.includes(producto.id)
                                                ? settings.ageMode === 'niños'
                                                    ? 'bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg hover:shadow-xl'
                                                    : settings.ageMode === 'jóvenes'
                                                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg'
                                                    : 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-md'
                                                : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                                        } ${getModeClasses()}`}
                                    >
                                        {addingToCart.includes(producto.id) ? (
                                            <div className="flex items-center">
                                                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                                                {getTextByMode({
                                                    niños: '...',
                                                    jóvenes: '...',
                                                    adultos: '...'
                                                })}
                                            </div>
                                        ) : producto.stock_total > 0 ? getTextByMode({
                                            niños: '🛒 Agregar',
                                            jóvenes: '+ Carrito',
                                            adultos: 'Agregar'
                                        }) : getTextByMode({
                                            niños: '😢 Agotado',
                                            jóvenes: 'N/A',
                                            adultos: 'Agotado'
                                        })}
                                    </button>
                                </div>

                                {/* Stock disponible */}
                                <div className={`text-xs text-gray-500 dark:text-gray-400 mt-2 ${getModeClasses()}`}>
                                    {getTextByMode({
                                        niños: `🧃 ${producto.stock_total} disponibles`,
                                        jóvenes: `${producto.stock_total} in stock`,
                                        adultos: `${producto.stock_total} disponibles`
                                    })}
                                </div>
                            </div>

                            {/* Elementos decorativos por modo */}
                            {settings.ageMode === 'niños' && (
                                <>
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-300/40 rounded-full animate-ping"></div>
                                    <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-300/40 rounded-full animate-pulse"></div>
                                </>
                            )}

                            {settings.ageMode === 'jóvenes' && (
                                <div className="absolute top-2 right-2 w-2 h-2 bg-white/60 rounded-full group-hover:scale-150 transition-transform"></div>
                            )}
                        </div>
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
                                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                                : settings.ageMode === 'jóvenes'
                                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl'
                                : 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-md hover:shadow-lg'
                        } ${getModeClasses()}`}
                    >
                        {getTextByMode({
                            niños: '🧃 ¡Ver Más Bebidas Deliciosas!',
                            jóvenes: '🥤 Explore More Drinks',
                            adultos: 'Ver Todas las Bebidas'
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
