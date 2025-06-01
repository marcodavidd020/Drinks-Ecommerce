import ConfirmDialog from '@/components/ConfirmDialog';
import { DataTable, PageHeader, Pagination, SearchFilters } from '@/components/DataTable';
import { useAppMode } from '@/contexts/AppModeContext';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface Categoria {
    id: number;
    nombre: string;
}

interface Producto {
    id: number;
    cod_producto: string;
    nombre: string;
    precio_compra: number;
    precio_venta: number;
    imagen?: string;
    descripcion?: string;
    categoria: Categoria;
    stock_total?: number;
    created_at: string;
    updated_at: string;
}

interface ProductosIndexProps {
    productos: {
        data: Producto[];
        links: any[];
        meta?: any;
        total: number;
        from: number;
        to: number;
        per_page: number;
        current_page: number;
        last_page: number;
    };
    categorias: Categoria[];
    filters: {
        search: string;
        categoria: string;
        sort_by: string;
        sort_order: string;
        per_page: number;
        page?: number;
    };
}

export default function ProductosIndex({ productos, categorias, filters }: ProductosIndexProps) {
    const { settings } = useAppMode();
    const [search, setSearch] = useState(filters.search || '');
    const [categoria, setCategoria] = useState(filters.categoria || '');
    const [sortBy, setSortBy] = useState(filters.sort_by || 'created_at');
    const [sortOrder, setSortOrder] = useState(filters.sort_order || 'desc');
    const [perPage, setPerPage] = useState(filters.per_page || 10);
    const [page, setPage] = useState(filters.page || productos.current_page || 1);
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        producto?: Producto;
    }>({ isOpen: false });

    // Debug: Log para ver qué filtros llegan del backend
    console.log('Filtros recibidos del backend:', filters);
    console.log('Estado actual - sortBy:', sortBy, 'sortOrder:', sortOrder);
    console.log('Valor del dropdown:', `${sortBy}_${sortOrder}`);

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
        } else if (productos.current_page) {
            setPage(productos.current_page);
        }
    }, [filters.page, productos.current_page]);

    const handleSearch = () => {
        router.get(
            '/productos',
            {
                search,
                categoria,
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
            categoria,
            sort_by: sortBy,
            sort_order: sortOrder,
            per_page: perPage,
            page,
            ...newFilters,
        };

        // Si estamos cambiando filtros pero no la página explícitamente, volver a página 1
        if (newFilters && !newFilters.page && 
            (newFilters.search !== undefined || 
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
        if (newFilters.categoria !== undefined) setCategoria(newFilters.categoria);
        if (newFilters.page !== undefined) setPage(newFilters.page);

        // Debug log para ver qué valores se envían
        console.log('Filtros aplicados:', params);
        console.log('URL que se va a llamar:', '/productos?' + new URLSearchParams(params).toString());

        router.get('/productos', params, {
            preserveState: true,
            replace: true,
        });
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        handleFilterChange({ page: newPage });
    };

    const handleDeleteClick = (producto: Producto) => {
        setConfirmDialog({
            isOpen: true,
            producto,
        });
    };

    const handleDeleteConfirm = () => {
        if (confirmDialog.producto) {
            router.delete(`/productos/${confirmDialog.producto.id}`, {
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

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    // Configuración de filtros
    const searchFilters = [
        {
            type: 'search' as const,
            placeholder: getTextByMode({
                niños: '🔍 ¿Buscas algún producto divertido?',
                jóvenes: '🔍 Buscar producto...',
                adultos: 'Buscar producto por nombre, código o descripción...',
            }),
            value: search,
            onChange: setSearch,
            colSpan: 2,
        },
        {
            type: 'select' as const,
            value: categoria,
            onChange: (value: string) => {
                setCategoria(value);
                handleFilterChange({ categoria: value });
            },
            options: [
                {
                    value: '',
                    label: getTextByMode({
                        niños: '🎈 Todas las categorías',
                        jóvenes: 'Todas las categorías',
                        adultos: 'Todas las categorías',
                    }),
                },
                ...categorias.map((cat) => ({
                    value: cat.id.toString(),
                    label: cat.nombre,
                })),
            ],
        },
        {
            type: 'select' as const,
            value: `${sortBy}_${sortOrder}`,
            onChange: (value: string) => {
                // Dividir correctamente: tomar todo menos la última parte como campo, y la última como orden
                const parts = value.split('_');
                const newSortOrder = parts.pop() || 'desc'; // Última parte es el orden
                const newSortBy = parts.join('_'); // Todo lo demás es el campo

                console.log(`Ordenamiento seleccionado: campo=${newSortBy}, orden=${newSortOrder}`);

                // Actualizar estados inmediatamente para la UI
                setSortBy(newSortBy);
                setSortOrder(newSortOrder);

                // Enviar la petición con los nuevos valores
                const params = {
                    search,
                    categoria,
                    sort_by: newSortBy,
                    sort_order: newSortOrder,
                    per_page: perPage,
                };

                console.log('Parámetros de ordenamiento enviados:', params);

                router.get('/productos', params, {
                    preserveState: true,
                    replace: true,
                });
            },
            options: [
                {
                    value: 'nombre_asc',
                    label: getTextByMode({
                        niños: '🔤 Nombre A-Z',
                        jóvenes: 'Nombre A-Z',
                        adultos: 'Nombre A-Z',
                    }),
                },
                {
                    value: 'nombre_desc',
                    label: getTextByMode({
                        niños: '🔤 Nombre Z-A',
                        jóvenes: 'Nombre Z-A',
                        adultos: 'Nombre Z-A',
                    }),
                },
                {
                    value: 'precio_venta_asc',
                    label: getTextByMode({
                        niños: '💰 Precio ⬇️',
                        jóvenes: 'Precio menor a mayor',
                        adultos: 'Precio menor a mayor',
                    }),
                },
                {
                    value: 'precio_venta_desc',
                    label: getTextByMode({
                        niños: '💰 Precio ⬆️',
                        jóvenes: 'Precio mayor a menor',
                        adultos: 'Precio mayor a menor',
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
                handleFilterChange({ per_page: newPerPage });
            },
        },
    ];

    // Configuración de columnas
    const columns = [
        {
            key: 'imagen',
            label: getTextByMode({
                niños: '🖼️ Foto',
                jóvenes: '📸 Imagen',
                adultos: 'Imagen',
            }),
            render: (imagen: string, producto: Producto) => (
                <div className="h-12 w-12 flex-shrink-0">
                    {imagen ? (
                        <img className="h-12 w-12 rounded-lg object-cover" src={imagen} alt={producto.nombre} />
                    ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700">
                            <span className="text-xs text-gray-400">{settings.ageMode === 'niños' ? '📦' : 'Sin imagen'}</span>
                        </div>
                    )}
                </div>
            ),
            className: 'w-16',
        },
        {
            key: 'nombre',
            label: getTextByMode({
                niños: '🎁 Producto',
                jóvenes: '📦 Producto',
                adultos: 'Producto',
            }),
            render: (nombre: string, producto: Producto) => (
                <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{nombre}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        {settings.ageMode === 'niños' ? '🏷️' : 'Código'}: {producto.cod_producto}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{producto.categoria.nombre}</div>
                </div>
            ),
        },
        {
            key: 'precio_venta',
            label: getTextByMode({
                niños: '💰 Precio',
                jóvenes: '💰 Precio',
                adultos: 'Precio de Venta',
            }),
            render: (precio_venta: number, producto: Producto) => (
                <div>
                    <div className="text-sm font-bold text-green-600 dark:text-green-400">{formatCurrency(precio_venta)}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        {getTextByMode({
                            niños: '📥 Compra',
                            jóvenes: 'Compra',
                            adultos: 'Costo',
                        })}
                        : {formatCurrency(producto.precio_compra)}
                    </div>
                </div>
            ),
            className: 'text-right',
        },
        {
            key: 'stock_total',
            label: getTextByMode({
                niños: '📦 Cantidad',
                jóvenes: '📦 Stock',
                adultos: 'Stock Total',
            }),
            render: (stock_total: number = 0) => (
                <div
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        stock_total > 10
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : stock_total > 5
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}
                >
                    {stock_total}{' '}
                    {getTextByMode({
                        niños: stock_total === 1 ? 'unidad' : 'unidades',
                        jóvenes: 'unid.',
                        adultos: 'unidades',
                    })}
                </div>
            ),
            className: 'text-center',
        },
        {
            key: 'created_at',
            label: getTextByMode({
                niños: '📅 Creado',
                jóvenes: '📅 Fecha',
                adultos: 'Fecha de Creación',
            }),
            render: (created_at: string) => new Date(created_at).toLocaleDateString('es-CO'),
            className: 'text-sm text-gray-500 dark:text-gray-400',
        },
    ];

    // Configuración de acciones
    const actions = [
        {
            type: 'view' as const,
            href: '/productos/:id',
            icon: settings.ageMode === 'niños' ? '👀' : '👁️',
            title: getTextByMode({
                niños: 'Ver producto',
                jóvenes: 'Ver producto',
                adultos: 'Ver detalles',
            }),
            className: 'text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300',
        },
        {
            type: 'edit' as const,
            href: '/productos/:id/edit',
            icon: settings.ageMode === 'niños' ? '✏️' : '📝',
            title: getTextByMode({
                niños: 'Editar producto',
                jóvenes: 'Editar producto',
                adultos: 'Editar información',
            }),
            className: 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300',
        },
        {
            type: 'delete' as const,
            onClick: handleDeleteClick,
            icon: '🗑️',
            title: getTextByMode({
                niños: 'Eliminar producto',
                jóvenes: 'Eliminar producto',
                adultos: 'Eliminar producto',
            }),
            className: 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300',
        },
    ];

    // Estado vacío
    const emptyState = {
        icon: settings.ageMode === 'niños' ? '😔' : '📦',
        title:
            search || categoria
                ? getTextByMode({
                      niños: '¡No encontré productos que coincidan!',
                      jóvenes: 'No se encontraron productos',
                      adultos: 'No se encontraron productos que coincidan con los filtros',
                  })
                : getTextByMode({
                      niños: '¡No hay productos todavía!',
                      jóvenes: 'No hay productos registrados',
                      adultos: 'No se encontraron productos',
                  }),
        description:
            search || categoria
                ? getTextByMode({
                      niños: '¡Intenta cambiar los filtros!',
                      jóvenes: 'Intenta con otros filtros de búsqueda',
                      adultos: 'Intente modificar los criterios de búsqueda',
                  })
                : getTextByMode({
                      niños: '¡Agrega tu primer producto para empezar a vender!',
                      jóvenes: 'Comienza agregando tu primer producto',
                      adultos: 'Comience agregando el primer producto al inventario',
                  }),
        showAddButton: !search && !categoria,
        addButtonText: `➕ ${getTextByMode({
            niños: 'Agregar Primer Producto',
            jóvenes: 'Agregar Producto',
            adultos: 'Agregar Producto',
        })}`,
        addButtonHref: '/productos/create',
    };

    return (
        <DashboardLayout
            title={getTextByMode({
                niños: '📦 Productos',
                jóvenes: 'Productos',
                adultos: 'Gestión de Productos',
            })}
        >
            <Head title="Gestión de Productos" />

            <div className={`space-y-6 ${getModeClasses()}`}>
                <PageHeader
                    title={getTextByMode({
                        niños: '📦 ¡Mis Productos!',
                        jóvenes: 'Mis Productos',
                        adultos: 'Gestión de Productos',
                    })}
                    description={getTextByMode({
                        niños: '¡Aquí puedes ver todos tus productos!',
                        jóvenes: 'Administra tu inventario de productos',
                        adultos: 'Administración y control de productos',
                    })}
                    buttonText={getTextByMode({
                        niños: '✨ ¡Crear Producto!',
                        jóvenes: '➕ Nuevo Producto',
                        adultos: 'Nuevo Producto',
                    })}
                    buttonHref="/productos/create"
                />

                <SearchFilters filters={searchFilters} />

                <DataTable
                    data={productos.data}
                    columns={columns}
                    actions={actions}
                    emptyState={emptyState}
                    getItemKey={(producto) => producto.id}
                />

                {/* Paginación */}
                <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                            Mostrando <span className="font-medium">{productos.from || 0}</span> a{' '}
                            <span className="font-medium">{productos.to || 0}</span> de{' '}
                            <span className="font-medium">{productos.total}</span> productos
                        </div>
                        
                        <div className="flex items-center space-x-1">
                            <button
                                onClick={() => handlePageChange(1)}
                                disabled={productos.current_page <= 1}
                                className={`rounded-md border border-gray-300 px-3 py-2 text-sm font-medium ${
                                    productos.current_page <= 1
                                        ? 'cursor-not-allowed text-gray-400 dark:text-gray-600'
                                        : 'text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                                }`}
                            >
                                &laquo;
                            </button>
                            
                            <button
                                onClick={() => handlePageChange(productos.current_page - 1)}
                                disabled={productos.current_page <= 1}
                                className={`rounded-md border border-gray-300 px-3 py-2 text-sm font-medium ${
                                    productos.current_page <= 1
                                        ? 'cursor-not-allowed text-gray-400 dark:text-gray-600'
                                        : 'text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                                }`}
                            >
                                &lsaquo;
                            </button>
                            
                            {Array.from({ length: Math.min(5, productos.last_page) }, (_, i) => {
                                // Si hay más de 5 páginas, mostrar las páginas cercanas a la actual
                                let pageNum;
                                if (productos.last_page <= 5) {
                                    pageNum = i + 1;
                                } else if (productos.current_page <= 3) {
                                    pageNum = i + 1;
                                } else if (productos.current_page >= productos.last_page - 2) {
                                    pageNum = productos.last_page - 4 + i;
                                } else {
                                    pageNum = productos.current_page - 2 + i;
                                }
                                
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => handlePageChange(pageNum)}
                                        className={`rounded-md border px-3 py-2 text-sm font-medium ${
                                            pageNum === productos.current_page
                                                ? 'border-blue-500 bg-blue-50 text-blue-600 dark:border-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                            
                            <button
                                onClick={() => handlePageChange(productos.current_page + 1)}
                                disabled={productos.current_page >= productos.last_page}
                                className={`rounded-md border border-gray-300 px-3 py-2 text-sm font-medium ${
                                    productos.current_page >= productos.last_page
                                        ? 'cursor-not-allowed text-gray-400 dark:text-gray-600'
                                        : 'text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                                }`}
                            >
                                &rsaquo;
                            </button>
                            
                            <button
                                onClick={() => handlePageChange(productos.last_page)}
                                disabled={productos.current_page >= productos.last_page}
                                className={`rounded-md border border-gray-300 px-3 py-2 text-sm font-medium ${
                                    productos.current_page >= productos.last_page
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
                        niños: '¿Seguro que quieres eliminar este producto?',
                        jóvenes: '¿Eliminar este producto?',
                        adultos: 'Confirmar eliminación',
                    })}
                    message={
                        confirmDialog.producto
                            ? getTextByMode({
                                  niños: `¿Estás seguro de que quieres eliminar "${confirmDialog.producto.nombre}"? ¡No podrás recuperarlo después!`,
                                  jóvenes: `¿Eliminar "${confirmDialog.producto.nombre}"? Esta acción no se puede deshacer.`,
                                  adultos: `¿Está seguro de que desea eliminar el producto "${confirmDialog.producto.nombre}"? Esta acción no se puede deshacer.`,
                              })
                            : ''
                    }
                    confirmText={getTextByMode({
                        niños: '🗑️ Sí, eliminar',
                        jóvenes: 'Eliminar',
                        adultos: 'Eliminar',
                    })}
                    cancelText={getTextByMode({
                        niños: 'No, cancelar',
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
