import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useAppMode } from '@/contexts/AppModeContext';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useState, useEffect } from 'react';

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
        orden: string;
        per_page: number;
    };
}

export default function ProductosIndex({ productos, categorias, filters }: ProductosIndexProps) {
    const { settings } = useAppMode();
    const [search, setSearch] = useState(filters.search);
    const [categoria, setCategoria] = useState(filters.categoria);
    const [orden, setOrden] = useState(filters.orden);
    const [perPage, setPerPage] = useState(filters.per_page);
    const [isLoading, setIsLoading] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        producto?: Producto;
        action?: 'delete';
    }>({ isOpen: false });

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

    // Debounce para búsqueda y filtros
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== filters.search || categoria !== filters.categoria || 
                orden !== filters.orden) {
                router.get('/productos', {
                    search,
                    categoria,
                    orden,
                    per_page: perPage,
                }, {
                    preserveState: true,
                    replace: true,
                });
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [search, categoria, orden]);

    const handlePerPageChange = (newPerPage: number) => {
        setPerPage(newPerPage);
        router.get('/productos', {
            search,
            categoria,
            orden,
            per_page: newPerPage,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleDeleteClick = (producto: Producto) => {
        setConfirmDialog({
            isOpen: true,
            producto,
            action: 'delete',
        });
    };

    const handleConfirm = () => {
        if (confirmDialog.producto && confirmDialog.action) {
            setIsLoading(true);
            
            if (confirmDialog.action === 'delete') {
                router.delete(`/productos/${confirmDialog.producto.id}`, {
                    preserveScroll: true,
                    onFinish: () => {
                        setIsLoading(false);
                        setConfirmDialog({ isOpen: false });
                    },
                });
            }
        }
    };

    const handleCancel = () => {
        setConfirmDialog({ isOpen: false });
    };

    const formatPrice = (precio: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(precio);
    };

    const getStockStatus = (producto: Producto) => {
        if (producto.stock_total <= producto.stock_minimo) {
            return { 
                text: getTextByMode({ niños: '😱 ¡Crítico!', jóvenes: 'Crítico', adultos: 'Crítico' }), 
                color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' 
            };
        } else if (producto.stock_total <= producto.stock_minimo * 1.5) {
            return { 
                text: getTextByMode({ niños: '⚠️ Bajo', jóvenes: 'Bajo', adultos: 'Bajo' }), 
                color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' 
            };
        } else {
            return { 
                text: getTextByMode({ niños: '✅ Normal', jóvenes: 'Normal', adultos: 'Normal' }), 
                color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
            };
        }
    };

    return (
        <DashboardLayout title={getTextByMode({
            niños: '📦 ¡Mis Productos Geniales!',
            jóvenes: '📦 Productos',
            adultos: 'Gestión de Productos'
        })}>
            <Head title="Productos" />
            
            <div className={`space-y-6 ${getModeClasses()}`}>
                {/* Header con botón de agregar */}
                <div className="flex justify-between items-center">
                    <div>
                        <p className={`text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: '¡Administra todos tus productos increíbles!',
                                jóvenes: 'Administra el inventario de productos',
                                adultos: 'Administre el catálogo de productos del sistema'
                            })}
                        </p>
                    </div>
                    
                    <Link
                        href="/productos/create"
                        className={`bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors ${getModeClasses()}`}
                    >
                        {getTextByMode({
                            niños: '➕ ¡Agregar Producto!',
                            jóvenes: '➕ Nuevo Producto',
                            adultos: '➕ Agregar Producto'
                        })}
                    </Link>
                </div>

                {/* Filtros de búsqueda */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-2">
                            <input
                                type="text"
                                placeholder={getTextByMode({
                                    niños: '🔍 ¿Buscas algún producto?',
                                    jóvenes: '🔍 Buscar producto...',
                                    adultos: 'Buscar por nombre, código o descripción...'
                                })}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
                            />
                        </div>
                        <div>
                            <select
                                value={categoria}
                                onChange={(e) => setCategoria(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
                            >
                                <option value="">Todas las categorías</option>
                                {categorias.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <select
                                value={orden}
                                onChange={(e) => setOrden(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
                            >
                                <option value="nombre">Nombre</option>
                                <option value="precio_venta">Precio</option>
                                <option value="created_at">Fecha</option>
                            </select>
                        </div>
                        <div>
                            <select
                                value={perPage}
                                onChange={(e) => handlePerPageChange(Number(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
                            >
                                <option value={10}>10 por página</option>
                                <option value={25}>25 por página</option>
                                <option value={50}>50 por página</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Tabla de productos */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                    {productos.data.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="text-6xl mb-4">
                                {settings.ageMode === 'niños' ? '😔' : '📦'}
                            </div>
                            <h3 className={`text-lg font-medium text-gray-900 dark:text-gray-100 mb-2 ${getModeClasses()}`}>
                                {search || categoria || orden ? getTextByMode({
                                    niños: `¡No encontré productos con esos filtros!`,
                                    jóvenes: `No se encontraron productos para los filtros aplicados`,
                                    adultos: `No se encontraron productos que coincidan con los filtros`
                                }) : getTextByMode({
                                    niños: '¡No hay productos todavía!',
                                    jóvenes: 'No hay productos registrados',
                                    adultos: 'No se encontraron productos'
                                })}
                            </h3>
                            <p className={`text-gray-600 dark:text-gray-400 mb-4 ${getModeClasses()}`}>
                                {search || categoria || orden ? getTextByMode({
                                    niños: '¡Intenta cambiar los filtros!',
                                    jóvenes: 'Intenta con otros filtros de búsqueda',
                                    adultos: 'Intente con diferentes filtros de búsqueda'
                                }) : getTextByMode({
                                    niños: '¡Agrega tu primer producto para empezar!',
                                    jóvenes: 'Comienza agregando tu primer producto',
                                    adultos: 'Comience agregando el primer producto al sistema'
                                })}
                            </p>
                            {!search && !categoria && !orden && (
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
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-900">
                                    <tr>
                                        <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${getModeClasses()}`}>
                                            {getTextByMode({
                                                niños: '📦 Producto',
                                                jóvenes: '📦 Producto',
                                                adultos: 'Producto'
                                            })}
                                        </th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${getModeClasses()}`}>
                                            {getTextByMode({
                                                niños: '🏷️ Código',
                                                jóvenes: '🏷️ Código',
                                                adultos: 'Código'
                                            })}
                                        </th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${getModeClasses()}`}>
                                            {getTextByMode({
                                                niños: '📂 Categoría',
                                                jóvenes: '📂 Categoría',
                                                adultos: 'Categoría'
                                            })}
                                        </th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${getModeClasses()}`}>
                                            {getTextByMode({
                                                niños: '💰 Precio',
                                                jóvenes: '💰 Precio',
                                                adultos: 'Precio'
                                            })}
                                        </th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${getModeClasses()}`}>
                                            {getTextByMode({
                                                niños: '📊 Stock',
                                                jóvenes: '📊 Stock',
                                                adultos: 'Stock'
                                            })}
                                        </th>
                                        <th className={`px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${getModeClasses()}`}>
                                            {getTextByMode({
                                                niños: '🔧 Acciones',
                                                jóvenes: '🔧 Acciones',
                                                adultos: 'Acciones'
                                            })}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {productos.data.map((producto) => {
                                        const stockStatus = getStockStatus(producto);
                                        return (
                                            <tr key={producto.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <td className={`px-6 py-4 whitespace-nowrap ${getModeClasses()}`}>
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            {producto.imagen ? (
                                                                <img 
                                                                    className="h-10 w-10 rounded-lg object-cover" 
                                                                    src={producto.imagen} 
                                                                    alt={producto.nombre}
                                                                />
                                                            ) : (
                                                                <div className="h-10 w-10 rounded-lg bg-purple-500 flex items-center justify-center text-white font-medium">
                                                                    {producto.nombre.charAt(0).toUpperCase()}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                                {producto.nombre}
                                                            </div>
                                                            {producto.descripcion && (
                                                                <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                                                    {producto.descripcion}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 font-mono ${getModeClasses()}`}>
                                                    {producto.cod_producto}
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                                                        {producto.categoria.nombre}
                                                    </span>
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 font-medium ${getModeClasses()}`}>
                                                    {formatPrice(producto.precio)}
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap ${getModeClasses()}`}>
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-sm text-gray-900 dark:text-gray-100">
                                                            {producto.stock_total}
                                                        </span>
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${stockStatus.color}`}>
                                                            {stockStatus.text}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${getModeClasses()}`}>
                                                    <div className="flex justify-end space-x-2">
                                                        <Link
                                                            href={`/productos/${producto.id}`}
                                                            className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                                                            title={getTextByMode({
                                                                niños: 'Ver producto',
                                                                jóvenes: 'Ver producto',
                                                                adultos: 'Ver detalles'
                                                            })}
                                                        >
                                                            {settings.ageMode === 'niños' ? '👀' : '👁️'}
                                                        </Link>
                                                        <Link
                                                            href={`/productos/${producto.id}/edit`}
                                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 ml-3"
                                                            title={getTextByMode({
                                                                niños: 'Editar producto',
                                                                jóvenes: 'Editar producto',
                                                                adultos: 'Editar información'
                                                            })}
                                                        >
                                                            {settings.ageMode === 'niños' ? '✏️' : '📝'}
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDeleteClick(producto)}
                                                            disabled={isLoading}
                                                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 ml-3 disabled:opacity-50"
                                                            title={getTextByMode({
                                                                niños: 'Eliminar producto',
                                                                jóvenes: 'Eliminar producto',
                                                                adultos: 'Eliminar producto'
                                                            })}
                                                        >
                                                            {settings.ageMode === 'niños' ? '🗑️' : '🗑️'}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Paginación */}
                {productos.data.length > 0 && productos.links && productos.meta && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                        <div className="flex justify-between items-center">
                            <div className={`text-sm text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: `Mostrando ${productos.meta?.from || 1} a ${productos.meta?.to || productos.data.length} de ${productos.meta?.total || productos.data.length} productos`,
                                    jóvenes: `Mostrando ${productos.meta?.from || 1} a ${productos.meta?.to || productos.data.length} de ${productos.meta?.total || productos.data.length} productos`,
                                    adultos: `Mostrando ${productos.meta?.from || 1} a ${productos.meta?.to || productos.data.length} de ${productos.meta?.total || productos.data.length} productos`
                                })}
                            </div>
                            <div className="flex space-x-1">
                                {productos.links?.map((link, index) => (
                                    link.url ? (
                                        <Link
                                            key={index}
                                            href={link.url}
                                            data={{ search, categoria, orden, per_page: perPage }}
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

            {/* Confirm Dialog */}
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title={getTextByMode({
                    niños: '¿Eliminar producto?',
                    jóvenes: '¿Eliminar producto?',
                    adultos: 'Confirmar eliminación'
                })}
                message={
                    confirmDialog.producto
                        ? getTextByMode({
                            niños: `¿Estás seguro de que quieres eliminar "${confirmDialog.producto.nombre}"? ¡No podrás recuperarlo después!`,
                            jóvenes: `¿Eliminar "${confirmDialog.producto.nombre}"? Esta acción no se puede deshacer.`,
                            adultos: `¿Está seguro de que desea eliminar el producto "${confirmDialog.producto.nombre}"? Esta acción no se puede deshacer.`
                        })
                        : ''
                }
                confirmText={getTextByMode({
                    niños: '🗑️ Sí, eliminar',
                    jóvenes: 'Eliminar',
                    adultos: 'Eliminar'
                })}
                cancelText={getTextByMode({
                    niños: 'No, cancelar',
                    jóvenes: 'Cancelar',
                    adultos: 'Cancelar'
                })}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                type="danger"
            />
        </DashboardLayout>
    );
} 