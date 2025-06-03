import ConfirmDialog from '@/components/ConfirmDialog';
import { DataTable, PageHeader, SearchFilters } from '@/components/DataTable';
import { useAppMode } from '@/contexts/AppModeContext';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface Producto {
    id: number;
    nombre: string;
    cod_producto: string;
    precio_venta: number;
    categoria?: {
        id: number;
        nombre: string;
    };
}

interface Promocion {
    id: number;
    nombre: string;
    fecha_inicio: string;
    fecha_fin: string;
    estado: 'activa' | 'inactiva';
    estado_calculado: 'activa' | 'inactiva' | 'pendiente' | 'vencida';
    productos: Producto[];
    productos_count: number;
    created_at: string;
    updated_at: string;
}

interface PromocionesIndexProps {
    promociones: {
        data: Promocion[];
        links: any[];
        meta?: any;
        total: number;
        from: number;
        to: number;
        per_page: number;
        current_page: number;
        last_page: number;
    };
    filters: {
        search: string;
        estado: string;
        sort_by: string;
        sort_order: string;
        per_page: number;
        page?: number;
    };
}

export default function PromocionesIndex({ promociones, filters }: PromocionesIndexProps) {
    const { settings } = useAppMode();
    const [search, setSearch] = useState(filters.search || '');
    const [estado, setEstado] = useState(filters.estado || '');
    const [sortBy, setSortBy] = useState(filters.sort_by || 'created_at');
    const [sortOrder, setSortOrder] = useState(filters.sort_order || 'desc');
    const [perPage, setPerPage] = useState(filters.per_page || 10);
    const [page, setPage] = useState(filters.page || promociones.current_page || 1);
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        promocion?: Promocion;
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getEstadoBadge = (estadoCalculado: string) => {
        const estadoConfig = {
            activa: {
                class: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
                icon: '🟢',
                text: getTextByMode({
                    niños: '¡Activa!',
                    jóvenes: 'Activa',
                    adultos: 'Activa',
                }),
            },
            inactiva: {
                class: 'bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300',
                icon: '⚫',
                text: getTextByMode({
                    niños: 'Pausada',
                    jóvenes: 'Inactiva',
                    adultos: 'Inactiva',
                }),
            },
            pendiente: {
                class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
                icon: '🟡',
                text: getTextByMode({
                    niños: '¡Próximamente!',
                    jóvenes: 'Pendiente',
                    adultos: 'Pendiente',
                }),
            },
            vencida: {
                class: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
                icon: '🔴',
                text: getTextByMode({
                    niños: 'Terminada',
                    jóvenes: 'Vencida',
                    adultos: 'Vencida',
                }),
            },
        };

        const config = estadoConfig[estadoCalculado as keyof typeof estadoConfig] || estadoConfig.inactiva;

        return (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.class}`}>
                <span className="mr-1">{config.icon}</span>
                {config.text}
            </span>
        );
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
        } else if (promociones.current_page) {
            setPage(promociones.current_page);
        }
    }, [filters.page, promociones.current_page]);

    const handleSearch = () => {
        router.get(
            '/promociones',
            {
                search,
                estado,
                sort_by: sortBy,
                sort_order: sortOrder,
                per_page: perPage,
                page: 1,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleFilterChange = (newFilters: any) => {
        const params = {
            search,
            estado,
            sort_by: sortBy,
            sort_order: sortOrder,
            per_page: perPage,
            page: page,
            ...newFilters,
        };

        if (
            newFilters &&
            !newFilters.page &&
            (newFilters.search !== undefined ||
                newFilters.estado !== undefined ||
                newFilters.sort_by !== undefined ||
                newFilters.sort_order !== undefined ||
                newFilters.per_page !== undefined)
        ) {
            params.page = 1;
        }

        // Actualizar estados locales si cambiaron
        if (newFilters.sort_by !== undefined) setSortBy(newFilters.sort_by);
        if (newFilters.sort_order !== undefined) setSortOrder(newFilters.sort_order);
        if (newFilters.per_page !== undefined) setPerPage(newFilters.per_page);
        if (newFilters.estado !== undefined) setEstado(newFilters.estado);
        if (newFilters.page !== undefined) setPage(newFilters.page);

        router.get('/promociones', params, {
            preserveState: true,
            replace: true,
        });
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        handleFilterChange({ page: newPage });
    };

    const handleDeleteClick = (promocion: Promocion) => {
        setConfirmDialog({
            isOpen: true,
            promocion,
        });
    };

    const handleDeleteConfirm = () => {
        if (confirmDialog.promocion) {
            router.delete(`/promociones/${confirmDialog.promocion.id}`, {
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

    // Configuración de filtros
    const searchFilters = [
        {
            type: 'search' as const,
            placeholder: getTextByMode({
                niños: '🔍 ¿Qué promoción buscas?',
                jóvenes: '🔍 Buscar promoción...',
                adultos: 'Buscar promociones...',
            }),
            value: search,
            onChange: setSearch,
            colSpan: 2,
        },
        {
            type: 'select' as const,
            value: `${sortBy}_${sortOrder}`,
            onChange: (value: string) => {
                const parts = value.split('_');
                const newSortOrder = parts.pop() || 'desc';
                const newSortBy = parts.join('_');

                setSortBy(newSortBy);
                setSortOrder(newSortOrder);

                handleFilterChange({
                    sort_by: newSortBy,
                    sort_order: newSortOrder,
                    page: 1,
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
                    value: 'fecha_inicio_desc',
                    label: getTextByMode({
                        niños: '📅 Más recientes',
                        jóvenes: 'Más recientes',
                        adultos: 'Más recientes',
                    }),
                },
                {
                    value: 'fecha_inicio_asc',
                    label: getTextByMode({
                        niños: '📅 Más antiguas',
                        jóvenes: 'Más antiguas',
                        adultos: 'Más antiguas',
                    }),
                },
                {
                    value: 'fecha_fin_asc',
                    label: getTextByMode({
                        niños: '⏰ Por vencer',
                        jóvenes: 'Por vencer',
                        adultos: 'Por fecha de fin',
                    }),
                },
                {
                    value: 'created_at_desc',
                    label: getTextByMode({
                        niños: '🆕 Creadas recientemente',
                        jóvenes: 'Creadas recientemente',
                        adultos: 'Creadas recientemente',
                    }),
                },
            ],
        },
        {
            type: 'per_page' as const,
            value: perPage,
            onChange: (newPerPage: number) => {
                setPerPage(newPerPage);
                handleFilterChange({ per_page: newPerPage, page: 1 });
            },
        },
    ];

    // Configuración de columnas
    const columns = [
        {
            key: 'nombre',
            label: getTextByMode({
                niños: '🏷️ Promoción',
                jóvenes: 'Promoción',
                adultos: 'Nombre de la Promoción',
            }),
            render: (_: any, item: Promocion) => (
                <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{item.nombre}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        {item.productos_count} {item.productos_count === 1 ? 'producto' : 'productos'}
                    </div>
                </div>
            ),
        },
        {
            key: 'fechas',
            label: getTextByMode({
                niños: '📅 Fechas',
                jóvenes: 'Periodo',
                adultos: 'Periodo de Vigencia',
            }),
            render: (_: any, item: Promocion) => (
                <div className="text-sm">
                    <div className="text-gray-900 dark:text-gray-100">📅 {formatDate(item.fecha_inicio)}</div>
                    <div className="text-gray-500 dark:text-gray-400">🏁 {formatDate(item.fecha_fin)}</div>
                </div>
            ),
        },
        {
            key: 'estado',
            label: getTextByMode({
                niños: '🚦 Estado',
                jóvenes: 'Estado',
                adultos: 'Estado',
            }),
            render: (_: any, item: Promocion) => getEstadoBadge(item.estado_calculado),
            className: 'text-center',
        },
        {
            key: 'created_at',
            label: getTextByMode({
                niños: '📅 Creada',
                jóvenes: 'Fecha de Creación',
                adultos: 'Fecha de Creación',
            }),
            render: (created_at: string) => formatDate(created_at),
            className: 'text-sm text-gray-500 dark:text-gray-400',
        },
    ];

    // Configuración de acciones
    const actions = [
        {
            type: 'view' as const,
            href: '/promociones/:id',
            icon: settings.ageMode === 'niños' ? '👀' : '👁️',
            title: getTextByMode({
                niños: 'Ver detalles',
                jóvenes: 'Ver detalles',
                adultos: 'Ver detalles',
            }),
            className: 'text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300',
        },
        {
            type: 'edit' as const,
            href: '/promociones/:id/edit',
            icon: settings.ageMode === 'niños' ? '✏️' : '📝',
            title: getTextByMode({
                niños: 'Editar promoción',
                jóvenes: 'Editar promoción',
                adultos: 'Editar promoción',
            }),
            className: 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300',
        },
        {
            type: 'delete' as const,
            onClick: handleDeleteClick,
            icon: '🗑️',
            title: getTextByMode({
                niños: 'Eliminar promoción',
                jóvenes: 'Eliminar promoción',
                adultos: 'Eliminar promoción',
            }),
            className: 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300',
        },
    ];

    // Estado vacío
    const emptyState = {
        icon: settings.ageMode === 'niños' ? '😔' : '🏷️',
        title:
            search || estado
                ? getTextByMode({
                      niños: '¡No encontré promociones que coincidan!',
                      jóvenes: 'No se encontraron promociones',
                      adultos: 'No se encontraron promociones que coincidan con los filtros',
                  })
                : getTextByMode({
                      niños: '¡No hay promociones todavía!',
                      jóvenes: 'No hay promociones registradas',
                      adultos: 'No hay promociones registradas',
                  }),
        description:
            search || estado
                ? getTextByMode({
                      niños: 'Intenta buscar con otras palabras o cambiar los filtros',
                      jóvenes: 'Intenta con otra búsqueda o modifica los filtros',
                      adultos: 'Intente modificar los filtros de búsqueda',
                  })
                : getTextByMode({
                      niños: '¡Crea tu primera promoción con el botón de arriba!',
                      jóvenes: 'Crea una nueva promoción para comenzar',
                      adultos: 'Puede crear una nueva promoción utilizando el botón "Nueva Promoción"',
                  }),
    };

    return (
        <DashboardLayout
            title={getTextByMode({
                niños: '🏷️ Promociones',
                jóvenes: 'Promociones',
                adultos: 'Gestión de Promociones',
            })}
        >
            <Head title="Promociones" />

            <div className={`space-y-6 ${getModeClasses()}`}>
                <PageHeader
                    title={getTextByMode({
                        niños: '🏷️ ¡Promociones Especiales!',
                        jóvenes: 'Promociones',
                        adultos: 'Gestión de Promociones',
                    })}
                    description={getTextByMode({
                        niños: '¡Aquí puedes crear y manejar todas las ofertas especiales!',
                        jóvenes: 'Gestión de ofertas y descuentos especiales',
                        adultos: 'Administración de promociones y descuentos para productos',
                    })}
                    buttonText={getTextByMode({
                        niños: '✨ ¡Nueva Promoción!',
                        jóvenes: '➕ Nueva Promoción',
                        adultos: 'Nueva Promoción',
                    })}
                    buttonHref="/promociones/create"
                />

                <SearchFilters filters={searchFilters} />

                {/* Filtro de Estado */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                            className={`mt-2 block w-full rounded-md border-gray-300 py-2 pr-10 pl-3 text-base focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 ${getModeClasses()}`}
                        >
                            <option value="">Todos los estados</option>
                            <option value="activa">🟢 Activas</option>
                            <option value="pendiente">🟡 Pendientes</option>
                            <option value="vencida">🔴 Vencidas</option>
                            <option value="inactiva">⚫ Inactivas</option>
                        </select>
                    </div>

                    <div className="flex items-end rounded-lg bg-white p-4 shadow-sm lg:col-span-2 dark:bg-gray-800">
                        <button
                            type="button"
                            onClick={() => {
                                setSearch('');
                                setEstado('');
                                setSortBy('created_at');
                                setSortOrder('desc');
                                setPerPage(10);
                                setPage(1);
                                handleFilterChange({
                                    search: '',
                                    estado: '',
                                    sort_by: 'created_at',
                                    sort_order: 'desc',
                                    per_page: 10,
                                    page: 1,
                                });
                            }}
                            className={`inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 ${getModeClasses()}`}
                        >
                            <svg
                                className="mr-2 -ml-1 h-5 w-5 text-gray-400"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                                />
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
                    data={promociones.data}
                    columns={columns}
                    actions={actions}
                    emptyState={emptyState}
                    getItemKey={(promocion) => promocion.id}
                />

                <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                            Mostrando <span className="font-medium">{promociones.from || 0}</span> a{' '}
                            <span className="font-medium">{promociones.to || 0}</span> de <span className="font-medium">{promociones.total}</span>{' '}
                            registros
                        </div>

                        <div className="flex items-center space-x-1">
                            <button
                                onClick={() => handlePageChange(1)}
                                disabled={promociones.current_page <= 1}
                                className={`rounded-md border border-gray-300 px-3 py-2 text-sm font-medium ${
                                    promociones.current_page <= 1
                                        ? 'cursor-not-allowed text-gray-400 dark:text-gray-600'
                                        : 'text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                                }`}
                            >
                                &laquo;
                            </button>

                            <button
                                onClick={() => handlePageChange(promociones.current_page - 1)}
                                disabled={promociones.current_page <= 1}
                                className={`rounded-md border border-gray-300 px-3 py-2 text-sm font-medium ${
                                    promociones.current_page <= 1
                                        ? 'cursor-not-allowed text-gray-400 dark:text-gray-600'
                                        : 'text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                                }`}
                            >
                                &lsaquo;
                            </button>

                            {Array.from({ length: Math.min(5, promociones.last_page) }, (_, i) => {
                                let pageNum;
                                if (promociones.last_page <= 5) {
                                    pageNum = i + 1;
                                } else if (promociones.current_page <= 3) {
                                    pageNum = i + 1;
                                } else if (promociones.current_page >= promociones.last_page - 2) {
                                    pageNum = promociones.last_page - 4 + i;
                                } else {
                                    pageNum = promociones.current_page - 2 + i;
                                }

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => handlePageChange(pageNum)}
                                        className={`rounded-md border px-3 py-2 text-sm font-medium ${
                                            pageNum === promociones.current_page
                                                ? 'border-blue-500 bg-blue-50 text-blue-600 dark:border-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}

                            <button
                                onClick={() => handlePageChange(promociones.current_page + 1)}
                                disabled={promociones.current_page >= promociones.last_page}
                                className={`rounded-md border border-gray-300 px-3 py-2 text-sm font-medium ${
                                    promociones.current_page >= promociones.last_page
                                        ? 'cursor-not-allowed text-gray-400 dark:text-gray-600'
                                        : 'text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                                }`}
                            >
                                &rsaquo;
                            </button>

                            <button
                                onClick={() => handlePageChange(promociones.last_page)}
                                disabled={promociones.current_page >= promociones.last_page}
                                className={`rounded-md border border-gray-300 px-3 py-2 text-sm font-medium ${
                                    promociones.current_page >= promociones.last_page
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
                        niños: '¿Seguro que quieres eliminar esta promoción?',
                        jóvenes: '¿Eliminar esta promoción?',
                        adultos: 'Confirmar eliminación',
                    })}
                    message={
                        confirmDialog.promocion
                            ? getTextByMode({
                                  niños: `¡Esta acción eliminará la promoción "${confirmDialog.promocion.nombre}" para siempre!`,
                                  jóvenes: `Se eliminará permanentemente la promoción "${confirmDialog.promocion.nombre}"`,
                                  adultos: `Está a punto de eliminar la promoción "${confirmDialog.promocion.nombre}". Esta acción no se puede deshacer.`,
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
