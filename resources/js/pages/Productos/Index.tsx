import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useAppMode } from '@/contexts/AppModeContext';

interface Producto {
    id: number;
    cod_producto: string;
    nombre: string;
    descripcion?: string;
    precio: number;
    stock_total: number;
    stock_minimo: number;
    stock_maximo: number;
    imagen?: string;
    estado: 'activo' | 'inactivo';
    categoria: {
        id: number;
        nombre: string;
    };
    promociones?: Array<{
        id: number;
        nombre: string;
        descuento: number;
    }>;
    created_at: string;
}

interface Categoria {
    id: number;
    nombre: string;
}

interface ProductosIndexProps {
    productos: {
        data: Producto[];
        links?: any[];
        meta?: any;
    };
    categorias: Categoria[];
    filters: {
        search: string;
        categoria: string;
        estado: string;
        orden: string;
        per_page: number;
    };
}

export default function ProductosIndex({ productos, categorias, filters }: ProductosIndexProps) {
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

    const formatPrice = (precio: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(precio);
    };

    const getStockStatus = (producto: Producto) => {
        if (producto.stock_total <= producto.stock_minimo) {
            return { text: 'Crítico', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' };
        } else if (producto.stock_total <= producto.stock_minimo * 1.5) {
            return { text: 'Bajo', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' };
        } else {
            return { text: 'Normal', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' };
        }
    };

    return (
        <DashboardLayout title={getTextByMode({
            niños: '📦 ¡Mis Productos Geniales!',
            jóvenes: '📦 Gestión de Productos',
            adultos: 'Gestión de Productos'
        })}>
            <Head title="Productos" />
            
            <div className={`space-y-6 ${getModeClasses()}`}>
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className={`text-3xl font-bold text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: '📦 ¡Mis Productos Súper Geniales!',
                                jóvenes: '📦 Gestión de Productos',
                                adultos: 'Gestión de Productos'
                            })}
                        </h1>
                        <p className={`text-gray-600 dark:text-gray-400 mt-2 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: '¡Administra todos tus productos increíbles!',
                                jóvenes: 'Administra el inventario de productos',
                                adultos: 'Administre el catálogo de productos del sistema'
                            })}
                        </p>
                    </div>
                    <Link
                        href="/productos/create"
                        className={`bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${getModeClasses()}`}
                    >
                        <span>➕</span>
                        <span>{getTextByMode({
                            niños: '¡Agregar Producto!',
                            jóvenes: 'Agregar Producto',
                            adultos: 'Agregar Producto'
                        })}</span>
                    </Link>
                </div>

                {/* Filtros */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div>
                            <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '🔍 Buscar',
                                    jóvenes: '🔍 Buscar',
                                    adultos: 'Buscar'
                                })}
                            </label>
                            <input
                                type="text"
                                defaultValue={filters.search}
                                placeholder={getTextByMode({
                                    niños: 'Buscar productos...',
                                    jóvenes: 'Buscar por nombre o código...',
                                    adultos: 'Buscar por nombre, código o descripción...'
                                })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
                            />
                        </div>
                        <div>
                            <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '📂 Categoría',
                                    jóvenes: '📂 Categoría',
                                    adultos: 'Categoría'
                                })}
                            </label>
                            <select
                                defaultValue={filters.categoria}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
                            >
                                <option value="">Todas las categorías</option>
                                {categorias.map((categoria) => (
                                    <option key={categoria.id} value={categoria.id}>
                                        {categoria.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '⚡ Estado',
                                    jóvenes: '⚡ Estado',
                                    adultos: 'Estado'
                                })}
                            </label>
                            <select
                                defaultValue={filters.estado}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
                            >
                                <option value="">Todos los estados</option>
                                <option value="activo">Activo</option>
                                <option value="inactivo">Inactivo</option>
                            </select>
                        </div>
                        <div>
                            <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '🔄 Ordenar',
                                    jóvenes: '🔄 Ordenar por',
                                    adultos: 'Ordenar por'
                                })}
                            </label>
                            <select
                                defaultValue={filters.orden}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
                            >
                                <option value="nombre">Nombre</option>
                                <option value="precio">Precio</option>
                                <option value="stock_total">Stock</option>
                                <option value="created_at">Fecha</option>
                            </select>
                        </div>
                        <div>
                            <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '📄 Por página',
                                    jóvenes: '📄 Por página',
                                    adultos: 'Elementos por página'
                                })}
                            </label>
                            <select
                                defaultValue={filters.per_page}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
                            >
                                <option value={12}>12 por página</option>
                                <option value={24}>24 por página</option>
                                <option value={48}>48 por página</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Grid de productos */}
                {productos.data.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
                        <div className="text-6xl mb-4">
                            {settings.ageMode === 'niños' ? '📦' : '📦'}
                        </div>
                        <h3 className={`text-lg font-medium text-gray-900 dark:text-gray-100 mb-2 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: '¡No hay productos todavía!',
                                jóvenes: 'No hay productos registrados',
                                adultos: 'No se encontraron productos'
                            })}
                        </h3>
                        <p className={`text-gray-600 dark:text-gray-400 mb-4 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: '¡Agrega tu primer producto para empezar!',
                                jóvenes: 'Comienza agregando tu primer producto',
                                adultos: 'Comience agregando el primer producto al catálogo'
                            })}
                        </p>
                        <Link
                            href="/productos/create"
                            className={`inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors ${getModeClasses()}`}
                        >
                            ➕ {getTextByMode({
                                niños: 'Agregar Primer Producto',
                                jóvenes: 'Agregar Producto',
                                adultos: 'Agregar Producto'
                            })}
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {productos.data.map((producto) => {
                            const stockStatus = getStockStatus(producto);
                            return (
                                <div key={producto.id} className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow">
                                    {/* Imagen del producto */}
                                    <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-t-lg flex items-center justify-center">
                                        {producto.imagen ? (
                                            <img
                                                src={`/storage/${producto.imagen}`}
                                                alt={producto.nombre}
                                                className="h-full w-full object-cover rounded-t-lg"
                                            />
                                        ) : (
                                            <div className="text-4xl">
                                                {settings.ageMode === 'niños' ? '📦' : '📦'}
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Contenido */}
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className={`text-lg font-medium text-gray-900 dark:text-gray-100 truncate ${getModeClasses()}`}>
                                                {producto.nombre}
                                            </h3>
                                            <span className={`px-2 py-1 rounded-full text-xs ${stockStatus.color}`}>
                                                {stockStatus.text}
                                            </span>
                                        </div>
                                        
                                        <p className={`text-sm text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>
                                            {getTextByMode({
                                                niños: '🔢 Código',
                                                jóvenes: 'Código',
                                                adultos: 'Código'
                                            })}: {producto.cod_producto}
                                        </p>
                                        
                                        <p className={`text-sm text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>
                                            {getTextByMode({
                                                niños: '📂 Categoría',
                                                jóvenes: 'Categoría',
                                                adultos: 'Categoría'
                                            })}: {producto.categoria.nombre}
                                        </p>
                                        
                                        <div className="mt-3 space-y-2">
                                            <div className="flex justify-between">
                                                <span className={`text-lg font-bold text-purple-600 dark:text-purple-400 ${getModeClasses()}`}>
                                                    {formatPrice(producto.precio)}
                                                </span>
                                                <span className={`text-sm text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>
                                                    Stock: {producto.stock_total}
                                                </span>
                                            </div>
                                            
                                            {producto.promociones && producto.promociones.length > 0 && (
                                                <div className="flex flex-wrap gap-1">
                                                    {producto.promociones.map((promo) => (
                                                        <span key={promo.id} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full dark:bg-green-900 dark:text-green-200">
                                                            -{promo.descuento}%
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Acciones */}
                                        <div className="mt-4 flex justify-between items-center">
                                            <div className="flex space-x-2">
                                                <Link
                                                    href={`/productos/${producto.id}`}
                                                    className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
                                                    title={getTextByMode({
                                                        niños: 'Ver producto',
                                                        jóvenes: 'Ver detalles',
                                                        adultos: 'Ver detalles'
                                                    })}
                                                >
                                                    {settings.ageMode === 'niños' ? '👀' : '👁️'}
                                                </Link>
                                                <Link
                                                    href={`/productos/${producto.id}/edit`}
                                                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                                    title={getTextByMode({
                                                        niños: 'Editar producto',
                                                        jóvenes: 'Editar',
                                                        adultos: 'Editar producto'
                                                    })}
                                                >
                                                    {settings.ageMode === 'niños' ? '✏️' : '📝'}
                                                </Link>
                                            </div>
                                            
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                producto.estado === 'activo' 
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                            }`}>
                                                {producto.estado === 'activo' ? 
                                                    getTextByMode({ niños: '✅ Activo', jóvenes: 'Activo', adultos: 'Activo' }) :
                                                    getTextByMode({ niños: '❌ Inactivo', jóvenes: 'Inactivo', adultos: 'Inactivo' })
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Paginación */}
                {productos.data.length > 0 && productos.links && productos.meta && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                        <div className="flex justify-between items-center">
                            <div className={`text-sm text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: `Mostrando ${productos.meta?.from || 0} a ${productos.meta?.to || 0} de ${productos.meta?.total || 0} productos`,
                                    jóvenes: `Mostrando ${productos.meta?.from || 0} a ${productos.meta?.to || 0} de ${productos.meta?.total || 0} productos`,
                                    adultos: `Mostrando ${productos.meta?.from || 0} a ${productos.meta?.to || 0} de ${productos.meta?.total || 0} productos`
                                })}
                            </div>
                            <div className="flex space-x-1">
                                {productos.links?.map((link, index) => (
                                    link.url ? (
                                        <Link
                                            key={index}
                                            href={link.url}
                                            className={`px-3 py-2 text-sm rounded-md transition-colors ${
                                                link.active 
                                                    ? 'bg-purple-600 text-white' 
                                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                            } ${getModeClasses()}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span
                                            key={index}
                                            className={`px-3 py-2 text-sm rounded-md text-gray-400 dark:text-gray-600 ${getModeClasses()}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    )
                                )) || []}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
} 