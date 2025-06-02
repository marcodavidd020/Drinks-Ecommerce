import ConfirmDialog from '@/components/ConfirmDialog';
import { DataTable, PageHeader, SearchFilters } from '@/components/DataTable';
import { useAppMode } from '@/contexts/AppModeContext';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

interface Venta {
    id: number;
    fecha: string;
    fecha_formateada?: string;
    total: number;
    estado: 'pendiente' | 'completada' | 'cancelada';
    observaciones?: string;
    productos_count: number;
    created_at: string;
    updated_at: string;
}

interface Estadisticas {
    total: number;
    completadas: number;
    pendientes: number;
    canceladas: number;
    total_ventas: number;
}

interface VentasIndexProps {
    ventas: {
        data: Venta[];
        links: any[];
        meta?: any;
        total: number;
        from: number;
        to: number;
        per_page: number;
        current_page: number;
        last_page: number;
    };
    estadisticas: Estadisticas;
    filters: {
        search: string;
        estado: string;
        sort_by: string;
        sort_order: string;
        per_page: number;
        page?: number;
    };
}

export default function VentasIndex({ ventas, estadisticas, filters }: VentasIndexProps) {
    const { settings } = useAppMode();
    const [search, setSearch] = useState(filters.search || '');
    const [estado, setEstado] = useState(filters.estado || '');
    const [sortBy, setSortBy] = useState(filters.sort_by || 'fecha');
    const [sortOrder, setSortOrder] = useState(filters.sort_order || 'desc');
    const [perPage, setPerPage] = useState(filters.per_page || 10);
    const [page, setPage] = useState(filters.page || ventas.current_page || 1);
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        venta?: Venta;
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

    // Actualizar el estado de la página cuando cambia en las props
    useEffect(() => {
        if (filters.page) {
            setPage(filters.page);
        } else if (ventas.current_page) {
            setPage(ventas.current_page);
        }
    }, [filters.page, ventas.current_page]);

    // Debounce para búsqueda
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== filters.search) {
                handleSearch();
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    const handleSearch = () => {
        router.get(
            '/ventas',
            {
                search,
                estado,
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
            estado,
            sort_by: sortBy,
            sort_order: sortOrder,
            per_page: perPage,
            page,
            ...newFilters,
        };

        // Si estamos cambiando filtros pero no la página explícitamente, volver a página 1
        if (newFilters && !newFilters.page && 
            (newFilters.search !== undefined || 
             newFilters.estado !== undefined || 
             newFilters.sort_by !== undefined || 
             newFilters.sort_order !== undefined || 
             newFilters.per_page !== undefined)) {
            params.page = 1;
        }

        // Actualizar estados locales si cambiaron
        if (newFilters.sort_by !== undefined) setSortBy(newFilters.sort_by);
        if (newFilters.sort_order !== undefined) setSortOrder(newFilters.sort_order);
        if (newFilters.per_page !== undefined) setPerPage(newFilters.per_page);
        if (newFilters.estado !== undefined) setEstado(newFilters.estado);
        if (newFilters.page !== undefined) setPage(newFilters.page);

        router.get('/ventas', params, {
            preserveState: true,
            replace: true,
        });
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        handleFilterChange({ page: newPage });
    };

    // Configuración de filtros
    const searchFilters = [
        {
            type: 'search' as const,
            placeholder: getTextByMode({
                niños: '🔍 ¿Qué venta buscas?',
                jóvenes: '🔍 Buscar venta...',
                adultos: 'Buscar por número o detalles...',
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
                    value: 'fecha_desc',
                    label: getTextByMode({
                        niños: '📅 Más recientes',
                        jóvenes: 'Más recientes',
                        adultos: 'Fecha más reciente',
                    }),
                },
                {
                    value: 'fecha_asc',
                    label: getTextByMode({
                        niños: '📅 Más antiguas',
                        jóvenes: 'Más antiguas',
                        adultos: 'Fecha más antigua',
                    }),
                },
                {
                    value: 'total_desc',
                    label: getTextByMode({
                        niños: '💰 Mayor valor',
                        jóvenes: 'Mayor valor',
                        adultos: 'Mayor valor',
                    }),
                },
                {
                    value: 'total_asc',
                    label: getTextByMode({
                        niños: '💰 Menor valor',
                        jóvenes: 'Menor valor',
                        adultos: 'Menor valor',
                    }),
                },
                {
                    value: 'id_desc',
                    label: getTextByMode({
                        niños: '🔢 Número mayor',
                        jóvenes: 'Número mayor',
                        adultos: 'Número de venta mayor',
                    }),
                },
                {
                    value: 'id_asc',
                    label: getTextByMode({
                        niños: '🔢 Número menor',
                        jóvenes: 'Número menor',
                        adultos: 'Número de venta menor',
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
            key: 'id',
            label: getTextByMode({
                niños: '🔢 Número',
                jóvenes: '# Venta',
                adultos: '# Venta',
            }),
            render: (id: number) => (
                <div className="font-medium text-gray-900 dark:text-gray-100">
                    {`#${id.toString().padStart(6, '0')}`}
                </div>
            ),
            className: 'w-1/6',
        },
        {
            key: 'fecha',
            label: getTextByMode({
                niños: '📅 Fecha',
                jóvenes: 'Fecha',
                adultos: 'Fecha',
            }),
            render: (fecha: string, venta: Venta) => (
                <div className="text-gray-600 dark:text-gray-400">
                    {venta.fecha_formateada || formatDate(fecha)}
                </div>
            ),
            className: 'w-1/5',
        },
        {
            key: 'total',
            label: getTextByMode({
                niños: '💰 Total',
                jóvenes: 'Total',
                adultos: 'Total',
            }),
            render: (total: number) => (
                <div className="font-medium text-green-600 dark:text-green-400">
                    {formatCurrency(total)}
                </div>
            ),
            className: 'w-1/6 text-right',
        },
        {
            key: 'productos_count',
            label: getTextByMode({
                niños: '📦 Productos',
                jóvenes: 'Productos',
                adultos: 'Productos',
            }),
            render: (count: number) => (
                <div className="text-center">
                    <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {count}
                    </span>
                </div>
            ),
            className: 'w-1/6 text-center',
        },
        {
            key: 'estado',
            label: getTextByMode({
                niños: '🚦 Estado',
                jóvenes: 'Estado',
                adultos: 'Estado',
            }),
            render: (estado: string) => {
                let bgColor = '';
                let textColor = '';
                let label = '';

                switch (estado) {
                    case 'completada':
                        bgColor = 'bg-green-100 dark:bg-green-900/20';
                        textColor = 'text-green-800 dark:text-green-400';
                        label = getTextByMode({
                            niños: '✅ Completada',
                            jóvenes: 'Completada',
                            adultos: 'Completada',
                        });
                        break;
                    case 'pendiente':
                        bgColor = 'bg-yellow-100 dark:bg-yellow-900/20';
                        textColor = 'text-yellow-800 dark:text-yellow-400';
                        label = getTextByMode({
                            niños: '⏳ Pendiente',
                            jóvenes: 'Pendiente',
                            adultos: 'Pendiente',
                        });
                        break;
                    case 'cancelada':
                        bgColor = 'bg-red-100 dark:bg-red-900/20';
                        textColor = 'text-red-800 dark:text-red-400';
                        label = getTextByMode({
                            niños: '❌ Cancelada',
                            jóvenes: 'Cancelada',
                            adultos: 'Cancelada',
                        });
                        break;
                    default:
                        bgColor = 'bg-gray-100 dark:bg-gray-700';
                        textColor = 'text-gray-800 dark:text-gray-400';
                        label = estado;
                }

                return (
                    <div className="flex justify-center">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${bgColor} ${textColor}`}>
                            {label}
                        </span>
                    </div>
                );
            },
            className: 'w-1/6 text-center',
        },
    ];

    // Configuración de acciones
    const actions = [
        {
            type: 'view' as const,
            href: '/ventas/:id',
            icon: settings.ageMode === 'niños' ? '👀' : '👁️',
            title: getTextByMode({
                niños: 'Ver detalles',
                jóvenes: 'Ver detalles',
                adultos: 'Ver detalles',
            }),
            className: 'text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300',
        },
    ];

    // Estado vacío
    const emptyState = {
        icon: settings.ageMode === 'niños' ? '😔' : '📝',
        title: search || estado
            ? getTextByMode({
                  niños: '¡No encontré ventas que coincidan!',
                  jóvenes: 'No se encontraron ventas',
                  adultos: 'No se encontraron ventas que coincidan con los filtros',
              })
            : getTextByMode({
                  niños: '¡No hay ventas todavía!',
                  jóvenes: 'No hay ventas registradas',
                  adultos: 'No hay ventas registradas en el sistema',
              }),
        description: search || estado
            ? getTextByMode({
                  niños: 'Intenta buscar con otras palabras o cambiar los filtros',
                  jóvenes: 'Intenta con otra búsqueda o modifica los filtros',
                  adultos: 'Intente modificar los filtros de búsqueda',
              })
            : getTextByMode({
                  niños: '¡Las ventas aparecerán aquí cuando se registren!',
                  jóvenes: 'Las ventas se mostrarán aquí cuando se registren',
                  adultos: 'Las ventas se mostrarán en esta tabla cuando se registren',
              }),
    };

    return (
        <DashboardLayout
            title={getTextByMode({
                niños: '📝 Ventas',
                jóvenes: 'Ventas',
                adultos: 'Gestión de Ventas',
            })}
        >
            <Head title="Ventas" />

            <div className={`space-y-6 ${getModeClasses()}`}>
                <PageHeader
                    title={getTextByMode({
                        niños: '📝 ¡Ventas!',
                        jóvenes: 'Ventas',
                        adultos: 'Gestión de Ventas',
                    })}
                    description={getTextByMode({
                        niños: '¡Aquí puedes ver todas las ventas!',
                        jóvenes: 'Administración de ventas',
                        adultos: 'Administración de notas de venta',
                    })}
                    buttonText={getTextByMode({
                        niños: '✨ ¡Nueva Venta!',
                        jóvenes: '➕ Nueva Venta',
                        adultos: 'Nueva Venta',
                    })}
                    buttonHref="/ventas/create"
                />

                {/* Dashboard de estadísticas */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                        <h3 className={`text-sm font-medium text-gray-500 dark:text-gray-400 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: '📊 Total Ventas',
                                jóvenes: 'Total Ventas',
                                adultos: 'Total de Ventas',
                            })}
                        </h3>
                        <p className={`mt-2 text-3xl font-bold text-gray-900 dark:text-white ${getModeClasses()}`}>
                            {estadisticas.total}
                        </p>
                    </div>
                    
                    <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                        <h3 className={`text-sm font-medium text-gray-500 dark:text-gray-400 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: '✅ Completadas',
                                jóvenes: 'Completadas',
                                adultos: 'Ventas Completadas',
                            })}
                        </h3>
                        <p className={`mt-2 text-3xl font-bold text-green-600 dark:text-green-400 ${getModeClasses()}`}>
                            {estadisticas.completadas}
                        </p>
                    </div>
                    
                    <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                        <h3 className={`text-sm font-medium text-gray-500 dark:text-gray-400 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: '⏳ Pendientes',
                                jóvenes: 'Pendientes',
                                adultos: 'Ventas Pendientes',
                            })}
                        </h3>
                        <p className={`mt-2 text-3xl font-bold text-yellow-600 dark:text-yellow-400 ${getModeClasses()}`}>
                            {estadisticas.pendientes}
                        </p>
                    </div>
                    
                    <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                        <h3 className={`text-sm font-medium text-gray-500 dark:text-gray-400 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: '❌ Canceladas',
                                jóvenes: 'Canceladas',
                                adultos: 'Ventas Canceladas',
                            })}
                        </h3>
                        <p className={`mt-2 text-3xl font-bold text-red-600 dark:text-red-400 ${getModeClasses()}`}>
                            {estadisticas.canceladas}
                        </p>
                    </div>
                    
                    <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                        <h3 className={`text-sm font-medium text-gray-500 dark:text-gray-400 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: '💰 Total en Ventas',
                                jóvenes: 'Total en Ventas',
                                adultos: 'Ingreso Total',
                            })}
                        </h3>
                        <p className={`mt-2 text-2xl font-bold text-blue-600 dark:text-blue-400 ${getModeClasses()}`}>
                            {formatCurrency(estadisticas.total_ventas)}
                        </p>
                    </div>
                </div>

                <SearchFilters filters={searchFilters} />

                {/* Filtro por estado */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                        <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: '🚦 Estado',
                                jóvenes: 'Estado',
                                adultos: 'Filtrar por Estado',
                            })}
                        </label>
                        <select
                            value={estado}
                            onChange={(e) => {
                                setEstado(e.target.value);
                                handleFilterChange({ estado: e.target.value, page: 1 });
                            }}
                            className={`mt-2 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 sm:text-sm ${getModeClasses()}`}
                        >
                            <option value="">Todos los estados</option>
                            <option value="completada">Completada</option>
                            <option value="pendiente">Pendiente</option>
                            <option value="cancelada">Cancelada</option>
                        </select>
                    </div>
                    
                    <div className="flex items-end rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                        <button
                            type="button"
                            onClick={() => {
                                setSearch('');
                                setEstado('');
                                setSortBy('fecha');
                                setSortOrder('desc');
                                setPerPage(10);
                                setPage(1);
                                handleFilterChange({ 
                                    search: '', 
                                    estado: '', 
                                    sort_by: 'fecha',
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
                    data={ventas.data}
                    columns={columns}
                    actions={actions}
                    emptyState={emptyState}
                    getItemKey={(venta) => venta.id}
                />

                {/* Paginación */}
                <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                            Mostrando <span className="font-medium">{ventas.from || 0}</span> a{' '}
                            <span className="font-medium">{ventas.to || 0}</span> de{' '}
                            <span className="font-medium">{ventas.total}</span> ventas
                        </div>
                        
                        <div className="flex items-center space-x-1">
                            <button
                                onClick={() => handlePageChange(1)}
                                disabled={ventas.current_page <= 1}
                                className={`rounded-md border border-gray-300 px-3 py-2 text-sm font-medium ${
                                    ventas.current_page <= 1
                                        ? 'cursor-not-allowed text-gray-400 dark:text-gray-600'
                                        : 'text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                                }`}
                            >
                                &laquo;
                            </button>
                            
                            <button
                                onClick={() => handlePageChange(ventas.current_page - 1)}
                                disabled={ventas.current_page <= 1}
                                className={`rounded-md border border-gray-300 px-3 py-2 text-sm font-medium ${
                                    ventas.current_page <= 1
                                        ? 'cursor-not-allowed text-gray-400 dark:text-gray-600'
                                        : 'text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                                }`}
                            >
                                &lsaquo;
                            </button>
                            
                            {Array.from({ length: Math.min(5, ventas.last_page) }, (_, i) => {
                                // Si hay más de 5 páginas, mostrar las páginas cercanas a la actual
                                let pageNum;
                                if (ventas.last_page <= 5) {
                                    pageNum = i + 1;
                                } else if (ventas.current_page <= 3) {
                                    pageNum = i + 1;
                                } else if (ventas.current_page >= ventas.last_page - 2) {
                                    pageNum = ventas.last_page - 4 + i;
                                } else {
                                    pageNum = ventas.current_page - 2 + i;
                                }
                                
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => handlePageChange(pageNum)}
                                        className={`rounded-md border px-3 py-2 text-sm font-medium ${
                                            pageNum === ventas.current_page
                                                ? 'border-blue-500 bg-blue-50 text-blue-600 dark:border-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                            
                            <button
                                onClick={() => handlePageChange(ventas.current_page + 1)}
                                disabled={ventas.current_page >= ventas.last_page}
                                className={`rounded-md border border-gray-300 px-3 py-2 text-sm font-medium ${
                                    ventas.current_page >= ventas.last_page
                                        ? 'cursor-not-allowed text-gray-400 dark:text-gray-600'
                                        : 'text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                                }`}
                            >
                                &rsaquo;
                            </button>
                            
                            <button
                                onClick={() => handlePageChange(ventas.last_page)}
                                disabled={ventas.current_page >= ventas.last_page}
                                className={`rounded-md border border-gray-300 px-3 py-2 text-sm font-medium ${
                                    ventas.current_page >= ventas.last_page
                                        ? 'cursor-not-allowed text-gray-400 dark:text-gray-600'
                                        : 'text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                                }`}
                            >
                                &raquo;
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
} 