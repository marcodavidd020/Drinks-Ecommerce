import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { useAppModeText } from '@/hooks/useAppModeText';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { formatCurrency } from '@/lib/currency';
import { Search, Filter, SortAsc, SortDesc, Star, ShoppingCart } from 'lucide-react';

interface Producto {
    id: number;
    cod_producto: string;
    nombre: string;
    precio_compra: number;
    precio_venta: number;
    imagen?: string;
    descripcion?: string;
    categoria: {
        id: number;
        nombre: string;
    };
    stock_total: number;
}

interface Categoria {
    id: number;
    nombre: string;
    productos_count: number;
}

interface Promocion {
    id: number;
    nombre: string;
    fecha_inicio: string;
    fecha_fin: string;
    descuento?: string;
    producto?: {
        id: number;
        nombre: string;
    } | null;
}

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    next_page_url?: string;
    prev_page_url?: string;
}

interface ProductosProps {
    productos: PaginatedData<Producto>;
    categorias: Categoria[];
    promociones_activas: Promocion[];
    filtros: {
        categoria_id?: number;
        busqueda?: string;
        orden: string;
        per_page: number;
    };
    stats: {
        total_productos: number;
        total_categorias: number;
        productos_en_promocion: number;
    };
}

export default function CatalogoProductos({
    productos,
    categorias,
    promociones_activas,
    filtros,
    stats
}: ProductosProps) {
    const { getTextByMode } = useAppModeText();
    const [busquedaLocal, setBusquedaLocal] = useState(filtros.busqueda || '');
    const [filtrosVisibles, setFiltrosVisibles] = useState(false);

    const getModeClasses = () => {
        // Obtener el modo desde localStorage o contexto
        const savedMode = localStorage.getItem('appMode');
        const mode = savedMode ? JSON.parse(savedMode).ageMode : 'adultos';
        
        switch (mode) {
            case 'niños':
                return 'font-comic text-adaptive-kids';
            case 'jóvenes':
                return 'font-modern text-adaptive-teen';
            default:
                return 'font-classic text-adaptive-adult';
        }
    };

    const aplicarFiltros = (nuevosFiltros: any) => {
        const params = {
            ...filtros,
            ...nuevosFiltros,
        };
        
        // Remover parámetros vacíos
        Object.keys(params).forEach(key => {
            if (params[key] === '' || params[key] === null || params[key] === undefined) {
                delete params[key];
            }
        });

        router.get(route('catalogo.productos'), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const buscar = () => {
        aplicarFiltros({ busqueda: busquedaLocal, page: 1 });
    };

    const cambiarOrden = (nuevoOrden: string) => {
        aplicarFiltros({ orden: nuevoOrden, page: 1 });
    };

    const cambiarCategoria = (categoriaId?: number) => {
        aplicarFiltros({ categoria: categoriaId, page: 1 });
    };

    const esProductoEnPromocion = (productoId: number) => {
        return promociones_activas.some(promo => promo.producto?.id === productoId);
    };

    const getStockBadge = (stock: number) => {
        if (stock === 0) {
            return <Badge variant="destructive">Agotado</Badge>;
        } else if (stock <= 5) {
            return <Badge variant="secondary">Pocas unidades</Badge>;
        } else {
            return <Badge variant="default">Disponible</Badge>;
        }
    };

    return (
        <AppLayout showNavbar={true} showModeSelector={true}>
            <Head title={getTextByMode({
                niños: '🧃 Catálogo de Bebidas - Arturo',
                jóvenes: '🥤 Bebidas Cool - Arturo',
                adultos: 'Catálogo de Productos - Arturo'
            })} />

            <div className={`min-h-screen py-8 ${getModeClasses()}`}>
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="text-center mb-6">
                            <h1 className={`text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '🧃 ¡Todas Nuestras Bebidas Súper Refrescantes! 🥤',
                                    jóvenes: '🔥 Catálogo Completo de Bebidas',
                                    adultos: 'Catálogo de Productos'
                                })}
                            </h1>
                            <p className={`text-gray-600 dark:text-gray-300 max-w-2xl mx-auto ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: `¡Descubre ${stats.total_productos} bebidas deliciosas en ${stats.total_categorias} categorías diferentes!`,
                                    jóvenes: `Explora ${stats.total_productos} bebidas increíbles organizadas en ${stats.total_categorias} categorías`,
                                    adultos: `Explore nuestro catálogo de ${stats.total_productos} productos organizados en ${stats.total_categorias} categorías`
                                })}
                            </p>
                        </div>

                        {/* Estadísticas rápidas */}
                        <div className="grid grid-cols-3 gap-4 mb-6 max-w-2xl mx-auto">
                            <div className="text-center bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                    {stats.total_productos}
                                </div>
                                <div className="text-sm text-blue-800 dark:text-blue-200">
                                    {getTextByMode({
                                        niños: 'Bebidas Ricas',
                                        jóvenes: 'Bebidas',
                                        adultos: 'Productos'
                                    })}
                                </div>
                            </div>
                            <div className="text-center bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    {stats.total_categorias}
                                </div>
                                <div className="text-sm text-green-800 dark:text-green-200">
                                    {getTextByMode({
                                        niños: 'Tipos',
                                        jóvenes: 'Categorías',
                                        adultos: 'Categorías'
                                    })}
                                </div>
                            </div>
                            <div className="text-center bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                    {stats.productos_en_promocion}
                                </div>
                                <div className="text-sm text-purple-800 dark:text-purple-200">
                                    {getTextByMode({
                                        niños: 'En Oferta',
                                        jóvenes: 'Ofertas',
                                        adultos: 'Promociones'
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Barra de búsqueda y filtros */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
                        <div className="flex flex-col lg:flex-row gap-4">
                            {/* Búsqueda */}
                            <div className="flex-1">
                                <div className="flex gap-2">
                                    <Input
                                        type="text"
                                        placeholder={getTextByMode({
                                            niños: '🔍 Buscar tu bebida favorita...',
                                            jóvenes: 'Buscar bebidas...',
                                            adultos: 'Buscar productos...'
                                        })}
                                        value={busquedaLocal}
                                        onChange={(e) => setBusquedaLocal(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && buscar()}
                                        className="flex-1"
                                    />
                                    <Button onClick={buscar} className="px-4">
                                        <Search className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Botones de control */}
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setFiltrosVisibles(!filtrosVisibles)}
                                    className="flex items-center gap-2"
                                >
                                    <Filter className="h-4 w-4" />
                                    {getTextByMode({
                                        niños: 'Filtros',
                                        jóvenes: 'Filtrar',
                                        adultos: 'Filtros'
                                    })}
                                </Button>

                                {/* Ordenamiento */}
                                <select
                                    value={filtros.orden}
                                    onChange={(e) => cambiarOrden(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                >
                                    <option value="nombre">
                                        {getTextByMode({
                                            niños: 'Por nombre',
                                            jóvenes: 'Nombre A-Z',
                                            adultos: 'Nombre (A-Z)'
                                        })}
                                    </option>
                                    <option value="precio_asc">
                                        {getTextByMode({
                                            niños: 'Más barato',
                                            jóvenes: 'Precio bajo',
                                            adultos: 'Precio (menor a mayor)'
                                        })}
                                    </option>
                                    <option value="precio_desc">
                                        {getTextByMode({
                                            niños: 'Más caro',
                                            jóvenes: 'Precio alto',
                                            adultos: 'Precio (mayor a menor)'
                                        })}
                                    </option>
                                </select>
                            </div>
                        </div>

                        {/* Panel de filtros */}
                        {filtrosVisibles && (
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {/* Filtro por categoría */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            {getTextByMode({
                                                niños: '🧃 Tipo de bebida',
                                                jóvenes: 'Categoría',
                                                adultos: 'Categoría'
                                            })}
                                        </label>
                                        <select
                                            value={filtros.categoria_id || ''}
                                            onChange={(e) => cambiarCategoria(e.target.value ? Number(e.target.value) : undefined)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        >
                                            <option value="">
                                                {getTextByMode({
                                                    niños: 'Todas las bebidas',
                                                    jóvenes: 'Todas',
                                                    adultos: 'Todas las categorías'
                                                })}
                                            </option>
                                            {categorias.map((categoria) => (
                                                <option key={categoria.id} value={categoria.id}>
                                                    {categoria.nombre} ({categoria.productos_count})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Limpiar filtros */}
                                    <div className="flex items-end">
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setBusquedaLocal('');
                                                router.get(route('catalogo.productos'), {}, {
                                                    preserveState: true,
                                                });
                                            }}
                                            className="w-full"
                                        >
                                            {getTextByMode({
                                                niños: '🧹 Limpiar',
                                                jóvenes: 'Limpiar',
                                                adultos: 'Limpiar filtros'
                                            })}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Grid de productos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                        {productos.data.map((producto) => (
                            <Card key={producto.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                                <div className="relative">
                                    {/* Imagen del producto */}
                                    <div className="aspect-square bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                                        {producto.imagen ? (
                                            <img
                                                src={`/images/productos/${producto.imagen}`}
                                                alt={producto.nombre}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="text-6xl opacity-50">🥤</div>
                                        )}
                                    </div>

                                    {/* Badge de promoción */}
                                    {esProductoEnPromocion(producto.id) && (
                                        <div className="absolute top-2 left-2">
                                            <Badge variant="destructive" className="animate-pulse">
                                                <Star className="h-3 w-3 mr-1" />
                                                {getTextByMode({
                                                    niños: '¡Oferta!',
                                                    jóvenes: 'Promo',
                                                    adultos: 'Promoción'
                                                })}
                                            </Badge>
                                        </div>
                                    )}

                                    {/* Badge de stock */}
                                    <div className="absolute top-2 right-2">
                                        {getStockBadge(producto.stock_total)}
                                    </div>
                                </div>

                                <CardContent className="p-4">
                                    <div className="mb-2">
                                        <Badge variant="secondary" className="text-xs">
                                            {producto.categoria.nombre}
                                        </Badge>
                                    </div>
                                    
                                    <h3 className={`font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 ${getModeClasses()}`}>
                                        {producto.nombre}
                                    </h3>
                                    
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                        {getTextByMode({
                                            niños: 'Código:',
                                            jóvenes: 'SKU:',
                                            adultos: 'Código:'
                                        })} {producto.cod_producto}
                                    </p>

                                    {producto.descripcion && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                                            {producto.descripcion}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <div className={`text-xl font-bold text-blue-600 dark:text-blue-400 ${getModeClasses()}`}>
                                            {formatCurrency(producto.precio_venta)}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {producto.stock_total} {getTextByMode({
                                                niños: 'disponibles',
                                                jóvenes: 'disponibles',
                                                adultos: 'unidades'
                                            })}
                                        </div>
                                    </div>
                                </CardContent>

                                <CardFooter className="p-4 pt-0">
                                    <div className="flex gap-2 w-full">
                                        <Link
                                            href={route('productos.show', producto.id)}
                                            className="flex-1"
                                        >
                                            <Button variant="outline" className="w-full">
                                                {getTextByMode({
                                                    niños: '👀 Ver más',
                                                    jóvenes: 'Ver detalles',
                                                    adultos: 'Ver detalles'
                                                })}
                                            </Button>
                                        </Link>
                                        
                                        {producto.stock_total > 0 && (
                                            <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                                                <ShoppingCart className="h-4 w-4 mr-2" />
                                                {getTextByMode({
                                                    niños: '🛒 Agregar',
                                                    jóvenes: 'Agregar',
                                                    adultos: 'Al carrito'
                                                })}
                                            </Button>
                                        )}
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    {/* Paginación */}
                    {productos.last_page > 1 && (
                        <div className="flex justify-center items-center space-x-2">
                            {productos.prev_page_url && (
                                <Link
                                    href={productos.prev_page_url}
                                    className="px-4 py-2 text-sm font-medium text-gray-500 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    {getTextByMode({
                                        niños: '← Anterior',
                                        jóvenes: '← Anterior',
                                        adultos: 'Anterior'
                                    })}
                                </Link>
                            )}

                            <span className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                {getTextByMode({
                                    niños: `Página ${productos.current_page} de ${productos.last_page}`,
                                    jóvenes: `${productos.current_page} / ${productos.last_page}`,
                                    adultos: `Página ${productos.current_page} de ${productos.last_page}`
                                })}
                            </span>

                            {productos.next_page_url && (
                                <Link
                                    href={productos.next_page_url}
                                    className="px-4 py-2 text-sm font-medium text-gray-500 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    {getTextByMode({
                                        niños: 'Siguiente →',
                                        jóvenes: 'Siguiente →',
                                        adultos: 'Siguiente'
                                    })}
                                </Link>
                            )}
                        </div>
                    )}

                    {/* Mensaje si no hay productos */}
                    {productos.data.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-8xl mb-4 opacity-50">🔍</div>
                            <h3 className={`text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: 'No encontramos esa bebida 😢',
                                    jóvenes: 'No se encontraron productos',
                                    adultos: 'No se encontraron productos'
                                })}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                {getTextByMode({
                                    niños: 'Intenta buscar con otras palabras o revisa todas nuestras bebidas',
                                    jóvenes: 'Intenta con otros términos de búsqueda o revisa todo el catálogo',
                                    adultos: 'Intente con otros criterios de búsqueda o explore todo el catálogo'
                                })}
                            </p>
                            <Button
                                onClick={() => {
                                    setBusquedaLocal('');
                                    router.get(route('catalogo.productos'), {}, {
                                        preserveState: true,
                                    });
                                }}
                            >
                                {getTextByMode({
                                    niños: '🧃 Ver todas las bebidas',
                                    jóvenes: 'Ver todo el catálogo',
                                    adultos: 'Ver todo el catálogo'
                                })}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
} 