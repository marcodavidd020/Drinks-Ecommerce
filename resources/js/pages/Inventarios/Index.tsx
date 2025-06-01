import ConfirmDialog from '@/components/ConfirmDialog';
import { DataTable, PageHeader, Pagination, SearchFilters } from '@/components/DataTable';
import { useAppMode } from '@/contexts/AppModeContext';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

interface Categoria {
    id: number;
    nombre: string;
}

interface Almacen {
    id: number;
    nombre: string;
}

interface Producto {
    id: number;
    nombre: string;
    cod_producto: string;
    precio_venta: number;
    categoria?: Categoria;
}

interface ProductoInventario {
    id: number;
    producto: Producto;
    almacen: Almacen;
    stock: number;
    created_at: string;
    updated_at: string;
}

interface InventariosIndexProps {
    inventarios: {
        data: ProductoInventario[];
        links: any[];
        meta?: any;
        total: number;
        from: number;
        to: number;
        per_page: number;
        current_page: number;
        last_page: number;
    };
    almacenes: Almacen[];
    categorias: Categoria[];
    filters: {
        search: string;
        almacen: string;
        categoria: string;
        sort_by: string;
        sort_order: string;
        per_page: number;
        page?: number;
    };
}

export default function InventariosIndex({ inventarios, almacenes, categorias, filters }: InventariosIndexProps) {
    const { settings } = useAppMode();
    const [search, setSearch] = useState(filters.search || '');
    const [almacenId, setAlmacenId] = useState(filters.almacen || '');
    const [categoriaId, setCategoriaId] = useState(filters.categoria || '');
    const [sortBy, setSortBy] = useState(filters.sort_by || 'created_at');
    const [sortOrder, setSortOrder] = useState(filters.sort_order || 'desc');
    const [perPage, setPerPage] = useState(filters.per_page || 10);
    const [page, setPage] = useState(filters.page || inventarios.current_page || 1);
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        inventario?: ProductoInventario;
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

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    // Debounce para búsqueda
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== filters.search) {
                handleSearch();
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    // Actualizar el estado de la página cuando cambia en las props
    useEffect(() => {
        if (filters.page) {
            setPage(filters.page);
        } else if (inventarios.current_page) {
            setPage(inventarios.current_page);
        }
    }, [filters.page, inventarios.current_page]);

    const handleSearch = () => {
        router.get(
            '/inventarios',
            {
                search,
                almacen: almacenId,
                categoria: categoriaId,
                sort_by: sortBy,
                sort_order: sortOrder,
                per_page: perPage,
                page: 1, // Resetear a primera página cuando se busca
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleFilterChange = (newFilters: any) => {
        // Guardar valores actuales para cada filtro
        const params = {
            search,
            almacen: almacenId,
            categoria: categoriaId,
            sort_by: sortBy,
            sort_order: sortOrder,
            per_page: perPage,
            page: page,
            ...newFilters,
        };

        // Si estamos cambiando filtros pero no la página explícitamente, volver a página 1
        if (newFilters && !newFilters.page && 
            (newFilters.search !== undefined || 
             newFilters.almacen !== undefined || 
             newFilters.categoria !== undefined || 
             newFilters.sort_by !== undefined || 
             newFilters.sort_order !== undefined || 
             newFilters.per_page !== undefined)) {
            params.page = 1;
        }

        // Actualizar estados locales si cambiaron
        if (newFilters.sort_by !== undefined) setSortBy(newFilters.sort_by);
        if (newFilters.sort_order !== undefined) setSortOrder(newFilters.sort_order);
        if (newFilters.per_page !== undefined) setPerPage(newFilters.per_page);
        if (newFilters.almacen !== undefined) setAlmacenId(newFilters.almacen);
        if (newFilters.categoria !== undefined) setCategoriaId(newFilters.categoria);
        if (newFilters.page !== undefined) setPage(newFilters.page);

        router.get('/inventarios', params, {
            preserveState: true,
            replace: true,
        });
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        handleFilterChange({ page: newPage });
    };

    const handleDeleteClick = (inventario: ProductoInventario) => {
        setConfirmDialog({
            isOpen: true,
            inventario,
        });
    };

    const handleDeleteConfirm = () => {
        if (confirmDialog.inventario) {
            router.delete(`/inventarios/${confirmDialog.inventario.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setConfirmDialog({ isOpen: false });
                },
            });
        }
    };

    const handleDeleteCancel = () => {
        setConfirmDialog({ isOpen: false });
    };

    // Opciones para filtros
    const almacenOptions = [
        { value: '', label: 'Todos los almacenes' },
        ...almacenes.map((a) => ({ value: a.id.toString(), label: a.nombre })),
    ];

    const categoriaOptions = [
        { value: '', label: 'Todas las categorías' },
        ...categorias.map((c) => ({ value: c.id.toString(), label: c.nombre })),
    ];

    // Configuración de filtros
    const searchFilters = [
        {
            type: 'search' as const,
            placeholder: getTextByMode({
                niños: '🔍 ¿Qué producto buscas?',
                jóvenes: '🔍 Buscar producto...',
                adultos: 'Buscar por producto o código...',
            }),
            value: search,
            onChange: setSearch,
            colSpan: 2,
        },
        {
            type: 'select' as const,
            value: `${sortBy}_${sortOrder}`,
            onChange: (value: string) => {
                // Dividir correctamente: tomar todo menos la última parte como campo, y la última como orden
                const parts = value.split('_');
                const newSortOrder = parts.pop() || 'desc'; // Última parte es el orden
                const newSortBy = parts.join('_'); // Todo lo demás es el campo

                // Actualizar estados inmediatamente para la UI
                setSortBy(newSortBy);
                setSortOrder(newSortOrder);

                // Enviar la petición con los nuevos valores
                handleFilterChange({
                    sort_by: newSortBy,
                    sort_order: newSortOrder,
                    page: 1, // Volver a primera página al cambiar orden
                });
            },
            options: [
                {
                    value: 'producto.nombre_asc',
                    label: getTextByMode({
                        niños: '🔤 Producto A-Z',
                        jóvenes: 'Producto A-Z',
                        adultos: 'Producto A-Z',
                    }),
                },
                {
                    value: 'producto.nombre_desc',
                    label: getTextByMode({
                        niños: '🔤 Producto Z-A',
                        jóvenes: 'Producto Z-A',
                        adultos: 'Producto Z-A',
                    }),
                },
                {
                    value: 'almacen.nombre_asc',
                    label: getTextByMode({
                        niños: '🏬 Almacén A-Z',
                        jóvenes: 'Almacén A-Z',
                        adultos: 'Almacén A-Z',
                    }),
                },
                {
                    value: 'stock_desc',
                    label: getTextByMode({
                        niños: '📊 Mayor stock',
                        jóvenes: 'Mayor stock',
                        adultos: 'Mayor cantidad en stock',
                    }),
                },
                {
                    value: 'stock_asc',
                    label: getTextByMode({
                        niños: '📊 Menor stock',
                        jóvenes: 'Menor stock',
                        adultos: 'Menor cantidad en stock',
                    }),
                },
                {
                    value: 'created_at_desc',
                    label: getTextByMode({
                        niños: '🆕 Más nuevos',
                        jóvenes: 'Más recientes',
                        adultos: 'Más recientes',
                    }),
                },
                {
                    value: 'created_at_asc',
                    label: getTextByMode({
                        niños: '👴 Más antiguos',
                        jóvenes: 'Más antiguos',
                        adultos: 'Más antiguos',
                    }),
                },
            ],
        },
        {
            type: 'per_page' as const,
            value: perPage,
            onChange: (newPerPage: number) => {
                setPerPage(newPerPage);
                handleFilterChange({ per_page: newPerPage, page: 1 }); // Volver a primera página al cambiar items por página
            },
        },
    ];

    // Configuración de columnas
    const columns = [
        {
            key: 'producto',
            label: getTextByMode({
                niños: '📦 Producto',
                jóvenes: 'Producto',
                adultos: 'Producto',
            }),
            render: (_: any, item: ProductoInventario) => (
                <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{item.producto.nombre}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        {item.producto.cod_producto}
                        {item.producto.categoria && <span> | {item.producto.categoria.nombre}</span>}
                    </div>
                </div>
            ),
        },
        {
            key: 'almacen',
            label: getTextByMode({
                niños: '🏬 Almacén',
                jóvenes: 'Almacén',
                adultos: 'Almacén',
            }),
            render: (_: any, item: ProductoInventario) => (
                <div className="font-medium text-gray-900 dark:text-gray-100">{item.almacen.nombre}</div>
            ),
        },
        {
            key: 'stock',
            label: getTextByMode({
                niños: '📊 Stock',
                jóvenes: 'Stock',
                adultos: 'Stock',
            }),
            render: (stock: number) => (
                <div
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        stock > 0
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                >
                    {stock} unidades
                </div>
            ),
            className: 'text-center',
        },
        {
            key: 'updated_at',
            label: getTextByMode({
                niños: '📅 Actualizado',
                jóvenes: 'Actualización',
                adultos: 'Última Actualización',
            }),
            render: (updated_at: string) => formatDate(updated_at),
            className: 'text-sm text-gray-500 dark:text-gray-400',
        },
    ];

    // Configuración de acciones
    const actions = [
        {
            type: 'view' as const,
            href: '/inventarios/:id',
            icon: settings.ageMode === 'niños' ? '👀' : '👁️',
            title: getTextByMode({
                niños: 'Ver detalle',
                jóvenes: 'Ver detalle',
                adultos: 'Ver detalles',
            }),
            className: 'text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300',
        },
        {
            type: 'edit' as const,
            href: '/inventarios/:id/edit',
            icon: settings.ageMode === 'niños' ? '✏️' : '📝',
            title: getTextByMode({
                niños: 'Editar stock',
                jóvenes: 'Editar stock',
                adultos: 'Editar stock',
            }),
            className: 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300',
        },
        {
            type: 'delete' as const,
            onClick: handleDeleteClick,
            icon: '🗑️',
            title: getTextByMode({
                niños: 'Eliminar registro',
                jóvenes: 'Eliminar registro',
                adultos: 'Eliminar registro',
            }),
            className: 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300',
        },
    ];

    // Estado vacío
    const emptyState = {
        icon: settings.ageMode === 'niños' ? '😔' : '📦',
        title: search || almacenId || categoriaId
            ? getTextByMode({
                  niños: '¡No encontré productos que coincidan!',
                  jóvenes: 'No se encontraron productos',
                  adultos: 'No se encontraron productos que coincidan con los filtros',
              })
            : getTextByMode({
                  niños: '¡No hay productos en inventario todavía!',
                  jóvenes: 'No hay productos en inventario',
                  adultos: 'No hay productos registrados en el inventario',
              }),
        description: search || almacenId || categoriaId
            ? getTextByMode({
                  niños: 'Intenta buscar con otras palabras o cambiar los filtros',
                  jóvenes: 'Intenta con otra búsqueda o modifica los filtros',
                  adultos: 'Intente modificar los filtros de búsqueda',
              })
            : getTextByMode({
                  niños: '¡Agrega tu primer producto al inventario con el botón de arriba!',
                  jóvenes: 'Registra un nuevo producto en el inventario',
                  adultos: 'Puede registrar un nuevo producto utilizando el botón "Nuevo Registro"',
              }),
    };

    return (
        <DashboardLayout
            title={getTextByMode({
                niños: '📦 Inventario de Productos',
                jóvenes: 'Inventario',
                adultos: 'Gestión de Inventario',
            })}
        >
            <Head title="Inventario de Productos" />

            <div className={`space-y-6 ${getModeClasses()}`}>
                <PageHeader
                    title={getTextByMode({
                        niños: '📦 ¡Inventario de Productos!',
                        jóvenes: 'Inventario de Productos',
                        adultos: 'Gestión de Inventario',
                    })}
                    description={getTextByMode({
                        niños: '¡Aquí puedes ver todos los productos en stock!',
                        jóvenes: 'Gestión de productos en almacenes',
                        adultos: 'Administración de productos en inventario por almacén',
                    })}
                    buttonText={getTextByMode({
                        niños: '✨ ¡Agregar Producto!',
                        jóvenes: '➕ Nuevo Registro',
                        adultos: 'Nuevo Registro',
                    })}
                    buttonHref="/inventarios/create"
                />

                <SearchFilters filters={searchFilters} />

                {/* Filtros Adicionales */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                        <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: '🏬 Almacén',
                                jóvenes: 'Almacén',
                                adultos: 'Filtrar por Almacén',
                            })}
                        </label>
                        <select
                            value={almacenId}
                            onChange={(e) => {
                                setAlmacenId(e.target.value);
                                handleFilterChange({ almacen: e.target.value, page: 1 });
                            }}
                            className={`mt-2 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 sm:text-sm ${getModeClasses()}`}
                        >
                            {almacenOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                        <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: '📑 Categoría',
                                jóvenes: 'Categoría',
                                adultos: 'Filtrar por Categoría',
                            })}
                        </label>
                        <select
                            value={categoriaId}
                            onChange={(e) => {
                                setCategoriaId(e.target.value);
                                handleFilterChange({ categoria: e.target.value, page: 1 });
                            }}
                            className={`mt-2 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 sm:text-sm ${getModeClasses()}`}
                        >
                            {categoriaOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="flex items-end rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                        <button
                            type="button"
                            onClick={() => {
                                setSearch('');
                                setAlmacenId('');
                                setCategoriaId('');
                                setSortBy('created_at');
                                setSortOrder('desc');
                                setPerPage(10);
                                setPage(1);
                                handleFilterChange({ 
                                    search: '', 
                                    almacen: '', 
                                    categoria: '', 
                                    sort_by: 'created_at',
                                    sort_order: 'desc',
                                    per_page: 10,
                                    page: 1
                                });
                            }}
                            className={`inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 ${getModeClasses()}`}
                        >
                            <svg className="-ml-1 mr-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>
                            {getTextByMode({
                                niños: '🔄 ¡Limpiar filtros!',
                                jóvenes: 'Limpiar filtros',
                                adultos: 'Restablecer filtros',
                            })}
                        </button>
                    </div>
                </div>

                <DataTable
                    data={inventarios.data}
                    columns={columns}
                    actions={actions}
                    emptyState={emptyState}
                    getItemKey={(inventario) => inventario.id}
                />

                <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                            Mostrando <span className="font-medium">{inventarios.from || 0}</span> a{' '}
                            <span className="font-medium">{inventarios.to || 0}</span> de{' '}
                            <span className="font-medium">{inventarios.total}</span> registros
                        </div>
                        
                        <div className="flex items-center space-x-1">
                            <button
                                onClick={() => handlePageChange(1)}
                                disabled={inventarios.current_page <= 1}
                                className={`rounded-md border border-gray-300 px-3 py-2 text-sm font-medium ${
                                    inventarios.current_page <= 1
                                        ? 'cursor-not-allowed text-gray-400 dark:text-gray-600'
                                        : 'text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                                }`}
                            >
                                &laquo;
                            </button>
                            
                            <button
                                onClick={() => handlePageChange(inventarios.current_page - 1)}
                                disabled={inventarios.current_page <= 1}
                                className={`rounded-md border border-gray-300 px-3 py-2 text-sm font-medium ${
                                    inventarios.current_page <= 1
                                        ? 'cursor-not-allowed text-gray-400 dark:text-gray-600'
                                        : 'text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                                }`}
                            >
                                &lsaquo;
                            </button>
                            
                            {Array.from({ length: Math.min(5, inventarios.last_page) }, (_, i) => {
                                // Si hay más de 5 páginas, mostrar las páginas cercanas a la actual
                                let pageNum;
                                if (inventarios.last_page <= 5) {
                                    pageNum = i + 1;
                                } else if (inventarios.current_page <= 3) {
                                    pageNum = i + 1;
                                } else if (inventarios.current_page >= inventarios.last_page - 2) {
                                    pageNum = inventarios.last_page - 4 + i;
                                } else {
                                    pageNum = inventarios.current_page - 2 + i;
                                }
                                
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => handlePageChange(pageNum)}
                                        className={`rounded-md border px-3 py-2 text-sm font-medium ${
                                            pageNum === inventarios.current_page
                                                ? 'border-blue-500 bg-blue-50 text-blue-600 dark:border-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                            
                            <button
                                onClick={() => handlePageChange(inventarios.current_page + 1)}
                                disabled={inventarios.current_page >= inventarios.last_page}
                                className={`rounded-md border border-gray-300 px-3 py-2 text-sm font-medium ${
                                    inventarios.current_page >= inventarios.last_page
                                        ? 'cursor-not-allowed text-gray-400 dark:text-gray-600'
                                        : 'text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                                }`}
                            >
                                &rsaquo;
                            </button>
                            
                            <button
                                onClick={() => handlePageChange(inventarios.last_page)}
                                disabled={inventarios.current_page >= inventarios.last_page}
                                className={`rounded-md border border-gray-300 px-3 py-2 text-sm font-medium ${
                                    inventarios.current_page >= inventarios.last_page
                                        ? 'cursor-not-allowed text-gray-400 dark:text-gray-600'
                                        : 'text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                                }`}
                            >
                                &raquo;
                            </button>
                        </div>
                    </div>
                </div>

                <ConfirmDialog
                    isOpen={confirmDialog.isOpen}
                    title={getTextByMode({
                        niños: '¿Seguro que quieres eliminar este registro?',
                        jóvenes: '¿Eliminar este registro?',
                        adultos: 'Confirmar eliminación',
                    })}
                    message={
                        confirmDialog.inventario
                            ? getTextByMode({
                                  niños: `¡Esta acción eliminará el registro de "${confirmDialog.inventario.producto.nombre}" en "${confirmDialog.inventario.almacen.nombre}" para siempre!`,
                                  jóvenes: `Se eliminará permanentemente el registro de "${confirmDialog.inventario.producto.nombre}" en "${confirmDialog.inventario.almacen.nombre}"`,
                                  adultos: `Está a punto de eliminar el registro de "${confirmDialog.inventario.producto.nombre}" en "${confirmDialog.inventario.almacen.nombre}". Esta acción no se puede deshacer.`,
                              })
                            : ''
                    }
                    confirmText={getTextByMode({
                        niños: '🗑️ ¡Sí, eliminar!',
                        jóvenes: '🗑️ Eliminar',
                        adultos: 'Eliminar',
                    })}
                    cancelText={getTextByMode({
                        niños: '❌ No, ¡mejor no!',
                        jóvenes: 'Cancelar',
                        adultos: 'Cancelar',
                    })}
                    onConfirm={handleDeleteConfirm}
                    onCancel={handleDeleteCancel}
                    type="danger"
                />
            </div>
        </DashboardLayout>
    );
} 