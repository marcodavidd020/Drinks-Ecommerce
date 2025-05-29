import ConfirmDialog from '@/components/ConfirmDialog';
import { DataTable, PageHeader, Pagination, SearchFilters } from '@/components/DataTable';
import { useAppMode } from '@/contexts/AppModeContext';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface Categoria {
    id: number;
    nombre: string;
    descripcion?: string;
    productos_count: number;
    created_at: string;
    updated_at: string;
}

interface CategoriasIndexProps {
    categorias: {
        data: Categoria[];
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

export default function CategoriasIndex({ categorias, filters }: CategoriasIndexProps) {
    const { settings } = useAppMode();
    const [search, setSearch] = useState(filters.search);
    const [sortBy, setSortBy] = useState(filters.sort_by);
    const [sortOrder, setSortOrder] = useState(filters.sort_order);
    const [perPage, setPerPage] = useState(filters.per_page);
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        categoria?: Categoria;
    }>({ isOpen: false });

    // Debug: Log para ver qué filtros llegan del backend
    console.log('Filtros de categorías recibidos del backend:', filters);
    console.log('Estado actual en categorías - sortBy:', sortBy, 'sortOrder:', sortOrder);
    console.log('Valor del dropdown en categorías:', `${sortBy}_${sortOrder}`);

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
            '/categorias',
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

        // Debug log para ver qué valores se envían
        console.log('Filtros aplicados en categorías:', params);

        router.get(
            '/categorias',
            {
                search: newFilters.search !== undefined ? newFilters.search : search,
                sort_by: newFilters.sort_by !== undefined ? newFilters.sort_by : sortBy,
                sort_order: newFilters.sort_order !== undefined ? newFilters.sort_order : sortOrder,
                per_page: newFilters.per_page !== undefined ? newFilters.per_page : perPage,
                ...newFilters,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleDeleteClick = (categoria: Categoria) => {
        setConfirmDialog({
            isOpen: true,
            categoria,
        });
    };

    const handleDeleteConfirm = () => {
        if (confirmDialog.categoria) {
            router.delete(`/categorias/${confirmDialog.categoria.id}`, {
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
                niños: '🔍 ¿Qué categoría buscas?',
                jóvenes: '🔍 Buscar categoría...',
                adultos: 'Buscar categoría por nombre o descripción...',
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

                console.log(`Ordenamiento seleccionado en categorías: campo=${newSortBy}, orden=${newSortOrder}`);

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

                console.log('Parámetros de ordenamiento enviados en categorías:', params);

                router.get('/categorias', params, {
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
                        niños: '🆕 Más nuevas',
                        jóvenes: 'Más recientes',
                        adultos: 'Más recientes',
                    }),
                },
                {
                    value: 'created_at_asc',
                    label: getTextByMode({
                        niños: '👴 Más antiguas',
                        jóvenes: 'Más antiguas',
                        adultos: 'Más antiguas',
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
            render: (nombre: string, categoria: Categoria) => (
                <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{nombre}</div>
                    {categoria.descripcion && (
                        <div className="max-w-xs truncate text-xs text-gray-500 dark:text-gray-400">{categoria.descripcion}</div>
                    )}
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
                niños: '📅 Creada',
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
            href: '/categorias/:id',
            icon: settings.ageMode === 'niños' ? '👀' : '👁️',
            title: getTextByMode({
                niños: 'Ver categoría',
                jóvenes: 'Ver categoría',
                adultos: 'Ver detalles',
            }),
            className: 'text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300',
        },
        {
            type: 'edit' as const,
            href: '/categorias/:id/edit',
            icon: settings.ageMode === 'niños' ? '✏️' : '📝',
            title: getTextByMode({
                niños: 'Editar categoría',
                jóvenes: 'Editar categoría',
                adultos: 'Editar información',
            }),
            className: 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300',
        },
        {
            type: 'delete' as const,
            onClick: handleDeleteClick,
            icon: '🗑️',
            title: getTextByMode({
                niños: 'Eliminar categoría',
                jóvenes: 'Eliminar categoría',
                adultos: 'Eliminar categoría',
            }),
            className: 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300',
            condition: (categoria: Categoria) => categoria.productos_count === 0,
            tooltipDisabled: getTextByMode({
                niños: 'No puedes eliminar una categoría con productos',
                jóvenes: 'No se puede eliminar categorías con productos',
                adultos: 'No se puede eliminar categorías con productos asociados',
            }),
        },
    ];

    // Estado vacío
    const emptyState = {
        icon: settings.ageMode === 'niños' ? '😔' : '📁',
        title: search
            ? getTextByMode({
                  niños: '¡No encontré categorías que coincidan!',
                  jóvenes: 'No se encontraron categorías',
                  adultos: 'No se encontraron categorías que coincidan con los filtros',
              })
            : getTextByMode({
                  niños: '¡No hay categorías todavía!',
                  jóvenes: 'No hay categorías creadas',
                  adultos: 'No hay categorías creadas en el sistema',
              }),
        description: search
            ? getTextByMode({
                  niños: 'Intenta buscar con otras palabras',
                  jóvenes: 'Intenta con otra búsqueda',
                  adultos: 'Intente modificar los filtros de búsqueda',
              })
            : getTextByMode({
                  niños: '¡Crea tu primera categoría con el botón de arriba!',
                  jóvenes: 'Crea una nueva categoría con el botón de arriba',
                  adultos: 'Puede crear una nueva categoría utilizando el botón "Nueva Categoría"',
              }),
    };

    return (
        <DashboardLayout
            title={getTextByMode({
                niños: '📁 Categorías de Productos',
                jóvenes: '📁 Categorías',
                adultos: 'Gestión de Categorías',
            })}
        >
            <Head title="Categorías" />

            <div className={`space-y-6 ${getModeClasses()}`}>
                <PageHeader
                    title={getTextByMode({
                        niños: '📁 Mis Categorías',
                        jóvenes: '📁 Categorías',
                        adultos: 'Categorías',
                    })}
                    description={getTextByMode({
                        niños: '¡Organiza tus productos en grupos geniales!',
                        jóvenes: 'Gestiona las categorías de tus productos',
                        adultos: 'Administre las categorías para organizar sus productos',
                    })}
                    buttonText={getTextByMode({
                        niños: '✨ ¡Crear Categoría!',
                        jóvenes: '➕ Nueva Categoría',
                        adultos: 'Nueva Categoría',
                    })}
                    buttonHref="/categorias/create"
                />

                <SearchFilters filters={searchFilters} />

                <DataTable
                    data={categorias.data}
                    columns={columns}
                    actions={actions}
                    emptyState={emptyState}
                    getItemKey={(categoria) => categoria.id}
                />

                <Pagination
                    links={categorias.links}
                    meta={categorias.meta}
                    searchParams={{
                        search,
                        sort_by: sortBy,
                        sort_order: sortOrder,
                        per_page: perPage,
                    }}
                    entityName={getTextByMode({
                        niños: 'categorías',
                        jóvenes: 'categorías',
                        adultos: 'categorías',
                    })}
                />

                <ConfirmDialog
                    isOpen={confirmDialog.isOpen}
                    title={getTextByMode({
                        niños: '¿Seguro que quieres eliminar esta categoría?',
                        jóvenes: '¿Eliminar esta categoría?',
                        adultos: 'Confirmar eliminación',
                    })}
                    message={
                        confirmDialog.categoria
                            ? getTextByMode({
                                  niños: `¡Esta acción eliminará la categoría "${confirmDialog.categoria.nombre}" para siempre!`,
                                  jóvenes: `Se eliminará permanentemente la categoría "${confirmDialog.categoria.nombre}"`,
                                  adultos: `Está a punto de eliminar la categoría "${confirmDialog.categoria.nombre}". Esta acción no se puede deshacer.`,
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
