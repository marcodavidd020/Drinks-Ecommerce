import ConfirmDialog from '@/components/ConfirmDialog';
import { DataTable, PageHeader, Pagination, SearchFilters } from '@/components/DataTable';
import { useAppMode } from '@/contexts/AppModeContext';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface Almacen {
    id: number;
    nombre: string;
    descripcion?: string;
    ubicacion: string;
    productos_count: number;
    created_at: string;
    updated_at: string;
}

interface AlmacenesIndexProps {
    almacenes: {
        data: Almacen[];
        links: any[];
        meta?: any;
    };
    filters: {
        search: string;
        sort_by: string;
        sort_order: string;
        per_page: number;
    };
}

export default function AlmacenesIndex({ almacenes, filters }: AlmacenesIndexProps) {
    const { settings } = useAppMode();
    const [search, setSearch] = useState(filters.search);
    const [sortBy, setSortBy] = useState(filters.sort_by);
    const [sortOrder, setSortOrder] = useState(filters.sort_order);
    const [perPage, setPerPage] = useState(filters.per_page);
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        almacen?: Almacen;
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
            '/almacenes',
            {
                search,
                sort_by: sortBy,
                sort_order: sortOrder,
                per_page: perPage,
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
            search: search,
            sort_by: sortBy,
            sort_order: sortOrder,
            per_page: perPage,
            ...newFilters,
        };

        // Actualizar estados locales si cambiaron
        if (newFilters.sort_by !== undefined) setSortBy(newFilters.sort_by);
        if (newFilters.sort_order !== undefined) setSortOrder(newFilters.sort_order);
        if (newFilters.per_page !== undefined) setPerPage(newFilters.per_page);

        router.get(
            '/almacenes',
            params,
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleDeleteClick = (almacen: Almacen) => {
        setConfirmDialog({
            isOpen: true,
            almacen,
        });
    };

    const handleDeleteConfirm = () => {
        if (confirmDialog.almacen) {
            router.delete(`/almacenes/${confirmDialog.almacen.id}`, {
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
                niños: '🔍 ¿Qué almacén buscas?',
                jóvenes: '🔍 Buscar almacén...',
                adultos: 'Buscar almacén por nombre o ubicación...',
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
                const params = {
                    search,
                    sort_by: newSortBy,
                    sort_order: newSortOrder,
                    per_page: perPage,
                };

                router.get('/almacenes', params, {
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
                    value: 'ubicacion_asc',
                    label: getTextByMode({
                        niños: '📍 Ubicación A-Z',
                        jóvenes: 'Ubicación A-Z',
                        adultos: 'Ubicación A-Z',
                    }),
                },
                {
                    value: 'ubicacion_desc',
                    label: getTextByMode({
                        niños: '📍 Ubicación Z-A',
                        jóvenes: 'Ubicación Z-A',
                        adultos: 'Ubicación Z-A',
                    }),
                },
                {
                    value: 'productos_count_desc',
                    label: getTextByMode({
                        niños: '📦 Más productos',
                        jóvenes: 'Más productos',
                        adultos: 'Mayor cantidad de productos',
                    }),
                },
                {
                    value: 'productos_count_asc',
                    label: getTextByMode({
                        niños: '📦 Menos productos',
                        jóvenes: 'Menos productos',
                        adultos: 'Menor cantidad de productos',
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
            key: 'nombre',
            label: getTextByMode({
                niños: '📝 Nombre',
                jóvenes: '📝 Nombre',
                adultos: 'Nombre',
            }),
            render: (nombre: string, almacen: Almacen) => (
                <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{nombre}</div>
                    {almacen.descripcion && (
                        <div className="max-w-xs truncate text-xs text-gray-500 dark:text-gray-400">{almacen.descripcion}</div>
                    )}
                </div>
            ),
        },
        {
            key: 'ubicacion',
            label: getTextByMode({
                niños: '📍 Ubicación',
                jóvenes: '📍 Ubicación',
                adultos: 'Ubicación',
            }),
            render: (ubicacion: string) => (
                <div className="text-sm text-gray-800 dark:text-gray-200">
                    {ubicacion}
                </div>
            ),
        },
        {
            key: 'productos_count',
            label: getTextByMode({
                niños: '📦 Productos',
                jóvenes: '📦 Productos',
                adultos: 'Productos',
            }),
            render: (productos_count: number) => (
                <div
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        productos_count > 0
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                >
                    {productos_count}{' '}
                    {getTextByMode({
                        niños: productos_count === 1 ? 'producto' : 'productos',
                        jóvenes: 'prod.',
                        adultos: 'productos',
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
            href: '/almacenes/:id',
            icon: settings.ageMode === 'niños' ? '👀' : '👁️',
            title: getTextByMode({
                niños: 'Ver almacén',
                jóvenes: 'Ver almacén',
                adultos: 'Ver detalles',
            }),
            className: 'text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300',
        },
        {
            type: 'edit' as const,
            href: '/almacenes/:id/edit',
            icon: settings.ageMode === 'niños' ? '✏️' : '📝',
            title: getTextByMode({
                niños: 'Editar almacén',
                jóvenes: 'Editar almacén',
                adultos: 'Editar información',
            }),
            className: 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300',
        },
        {
            type: 'delete' as const,
            onClick: handleDeleteClick,
            icon: '🗑️',
            title: getTextByMode({
                niños: 'Eliminar almacén',
                jóvenes: 'Eliminar almacén',
                adultos: 'Eliminar almacén',
            }),
            className: 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300',
            condition: (almacen: Almacen) => almacen.productos_count === 0,
            tooltipDisabled: getTextByMode({
                niños: 'No puedes eliminar un almacén con productos',
                jóvenes: 'No se puede eliminar almacenes con productos',
                adultos: 'No se puede eliminar almacenes con productos asociados',
            }),
        },
    ];

    // Estado vacío
    const emptyState = {
        icon: settings.ageMode === 'niños' ? '😔' : '🏬',
        title: search
            ? getTextByMode({
                  niños: '¡No encontré almacenes que coincidan!',
                  jóvenes: 'No se encontraron almacenes',
                  adultos: 'No se encontraron almacenes que coincidan con los filtros',
              })
            : getTextByMode({
                  niños: '¡No hay almacenes todavía!',
                  jóvenes: 'No hay almacenes creados',
                  adultos: 'No hay almacenes creados en el sistema',
              }),
        description: search
            ? getTextByMode({
                  niños: 'Intenta buscar con otras palabras',
                  jóvenes: 'Intenta con otra búsqueda',
                  adultos: 'Intente modificar los filtros de búsqueda',
              })
            : getTextByMode({
                  niños: '¡Crea tu primer almacén con el botón de arriba!',
                  jóvenes: 'Crea un nuevo almacén con el botón de arriba',
                  adultos: 'Puede crear un nuevo almacén utilizando el botón "Nuevo Almacén"',
              }),
    };

    return (
        <DashboardLayout
            title={getTextByMode({
                niños: '🏬 Almacenes de Productos',
                jóvenes: '🏬 Almacenes',
                adultos: 'Gestión de Almacenes',
            })}
        >
            <Head title="Almacenes" />

            <div className={`space-y-6 ${getModeClasses()}`}>
                <PageHeader
                    title={getTextByMode({
                        niños: '🏬 Mis Almacenes',
                        jóvenes: '🏬 Almacenes',
                        adultos: 'Almacenes',
                    })}
                    description={getTextByMode({
                        niños: '¡Gestiona los lugares donde guardas tus productos!',
                        jóvenes: 'Administra los almacenes para tus productos',
                        adultos: 'Administre los almacenes para la gestión de inventario',
                    })}
                    buttonText={getTextByMode({
                        niños: '✨ ¡Crear Almacén!',
                        jóvenes: '➕ Nuevo Almacén',
                        adultos: 'Nuevo Almacén',
                    })}
                    buttonHref="/almacenes/create"
                />

                <SearchFilters filters={searchFilters} />

                <DataTable
                    data={almacenes.data}
                    columns={columns}
                    actions={actions}
                    emptyState={emptyState}
                    getItemKey={(almacen) => almacen.id}
                />

                <Pagination
                    links={almacenes.links}
                    meta={almacenes.meta}
                    searchParams={{
                        search,
                        sort_by: sortBy,
                        sort_order: sortOrder,
                        per_page: perPage,
                    }}
                    entityName={getTextByMode({
                        niños: 'almacenes',
                        jóvenes: 'almacenes',
                        adultos: 'almacenes',
                    })}
                />

                <ConfirmDialog
                    isOpen={confirmDialog.isOpen}
                    title={getTextByMode({
                        niños: '¿Seguro que quieres eliminar este almacén?',
                        jóvenes: '¿Eliminar este almacén?',
                        adultos: 'Confirmar eliminación',
                    })}
                    message={
                        confirmDialog.almacen
                            ? getTextByMode({
                                  niños: `¡Esta acción eliminará el almacén "${confirmDialog.almacen.nombre}" para siempre!`,
                                  jóvenes: `Se eliminará permanentemente el almacén "${confirmDialog.almacen.nombre}"`,
                                  adultos: `Está a punto de eliminar el almacén "${confirmDialog.almacen.nombre}". Esta acción no se puede deshacer.`,
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