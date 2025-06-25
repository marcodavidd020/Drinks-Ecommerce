import ConfirmDialog from '@/components/ConfirmDialog';
import { DataTable, PageHeader, Pagination, SearchFilters } from '@/components/DataTable';
import { useAppModeText } from '@/hooks/useAppModeText';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface BaseEntity {
    id: number;
    [key: string]: unknown;
}

interface BaseIndexData<T extends BaseEntity> {
    data: T[];
    links: Record<string, unknown>[];
    meta?: Record<string, unknown>;
}

interface BaseFilters {
    search: string;
    sort_by: string;
    sort_order: string;
    per_page: number;
    [key: string]: unknown;
}

interface ColumnConfig {
    key: string;
    label: {
        niños: string;
        jóvenes: string;
        adultos: string;
    };
    type?: 'text' | 'number' | 'date' | 'badge' | 'custom';
    render?: (value: unknown, item: unknown) => React.ReactNode;
    sortable?: boolean;
    className?: string;
}

interface ActionConfig<T extends BaseEntity> {
    label: {
        niños: string;
        jóvenes: string;
        adultos: string;
    };
    icon: string;
    href?: (item: T) => string;
    onClick?: (item: T) => void;
    variant?: 'primary' | 'secondary' | 'danger';
    show?: (item: T) => boolean;
}

interface FilterConfig {
    type: 'search' | 'select';
    key?: string; // Agregar key para identificar el filtro
    placeholder?: {
        niños: string;
        jóvenes: string;
        adultos: string;
    };
    value: string;
    onChange: (value: string) => void;
    options?: Array<{
        value: string;
        label: {
            niños: string;
            jóvenes: string;
            adultos: string;
        };
    }>;
    colSpan?: number;
}

interface BaseIndexProps<T extends BaseEntity> {
    // Datos
    data: BaseIndexData<T>;
    filters: BaseFilters;

    // Configuración
    entityName: string;
    routeName: string;

    // Título y descripción
    title: {
        niños: string;
        jóvenes: string;
        adultos: string;
    };
    description: {
        niños: string;
        jóvenes: string;
        adultos: string;
    };

    // Configuración de columnas
    columns: ColumnConfig[];

    // Configuración de acciones
    actions: ActionConfig<T>[];

    // Configuración de filtros personalizados (opcional)
    customFilters?: FilterConfig[];

    // Configuración adicional
    canCreate?: boolean;
    canDelete?: boolean;

    // Callbacks personalizados
    onDelete?: (item: T) => void;
    renderEmptyState?: () => React.ReactNode;
}

export default function BaseIndex<T extends BaseEntity>({
    data,
    filters,
    entityName,
    routeName,
    title,
    description,
    columns,
    actions,
    customFilters = [],
    canCreate = true,
    canDelete = true,
    onDelete,
}: BaseIndexProps<T>) {
    const { getTextByMode } = useAppModeText();

    const [search, setSearch] = useState(filters.search);
    const [sortBy, setSortBy] = useState(filters.sort_by);
    const [sortOrder, setSortOrder] = useState(filters.sort_order);
    const [perPage, setPerPage] = useState(filters.per_page);
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        item?: T;
    }>({ isOpen: false });

    // Debounce para búsqueda
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== filters.search) {
                router.get(
                    `/${routeName}`,
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
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [search, filters.search, routeName, sortBy, sortOrder, perPage]);



    const handleFilterChange = (newFilters: Record<string, unknown>) => {
        // Actualizar estados locales si cambiaron
        if (newFilters.sort_by !== undefined) setSortBy(newFilters.sort_by);
        if (newFilters.sort_order !== undefined) setSortOrder(newFilters.sort_order);
        if (newFilters.per_page !== undefined) setPerPage(newFilters.per_page);

        // Construir parámetros incluyendo todos los filtros actuales
        const params = {
            ...filters, // Incluir todos los filtros actuales
            search: newFilters.search !== undefined ? newFilters.search : search,
            sort_by: newFilters.sort_by !== undefined ? newFilters.sort_by : sortBy,
            sort_order: newFilters.sort_order !== undefined ? newFilters.sort_order : sortOrder,
            per_page: newFilters.per_page !== undefined ? newFilters.per_page : perPage,
            ...newFilters, // Sobrescribir con los nuevos filtros
        };

        router.get(`/${routeName}`, params, {
            preserveState: true,
            replace: true,
        });
    };

    const handleDeleteClick = (item: T) => {
        setConfirmDialog({
            isOpen: true,
            item,
        });
    };

    const handleDeleteConfirm = () => {
        if (confirmDialog.item) {
            if (onDelete) {
                onDelete(confirmDialog.item);
            } else {
                router.delete(`/${routeName}/${confirmDialog.item.id}`, {
                    preserveScroll: true,
                    onSuccess: () => {
                        setConfirmDialog({ isOpen: false });
                    },
                });
            }
        }
    };

    const handleDeleteCancel = () => {
        setConfirmDialog({ isOpen: false });
    };

    // Convertir FilterConfig a Filter para SearchFilters
    const searchFilters = [
        {
            type: 'search' as const,
            placeholder: getTextByMode({
                niños: `🔍 ¿Qué ${entityName} buscas?`,
                jóvenes: `🔍 Buscar ${entityName}...`,
                adultos: `Buscar ${entityName}...`,
            }),
            value: search,
            onChange: setSearch,
            colSpan: 2,
        },
        // Configuración de ordenamiento
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
            options: columns
                .filter(col => col.sortable !== false)
                .flatMap(col => [
                    {
                        value: `${col.key}_asc`,
                        label: getTextByMode({
                            niños: `🔤 ${col.label.niños} A-Z`,
                            jóvenes: `${col.label.jóvenes} A-Z`,
                            adultos: `${col.label.adultos} A-Z`,
                        }),
                    },
                    {
                        value: `${col.key}_desc`,
                        label: getTextByMode({
                            niños: `🔤 ${col.label.niños} Z-A`,
                            jóvenes: `${col.label.jóvenes} Z-A`,
                            adultos: `${col.label.adultos} Z-A`,
                        }),
                    },
                ]),
        },
        // Convertir filtros personalizados
        ...customFilters.map((filter, index) => ({
            type: filter.type,
            value: filter.value,
            onChange: (value: string) => {
                // Usar la key del filtro si está disponible, sino usar el índice como fallback
                let filterName = filter.key;

                if (!filterName) {
                    // Obtener el nombre del filtro basado en el índice como fallback
                    const filterNames = Object.keys(filters).filter(key =>
                        key !== 'search' && key !== 'sort_by' && key !== 'sort_order' && key !== 'per_page'
                    );
                    filterName = filterNames[index];
                }

                if (filterName) {
                    handleFilterChange({ [filterName]: value, page: 1 });
                }
            },
            options: filter.options?.map(option => ({
                value: option.value,
                label: getTextByMode(option.label),
            })),
            colSpan: filter.colSpan,
        })),
        // Filtro per_page
        {
            type: 'per_page' as const,
            value: perPage,
            onChange: (newPerPage: number) => {
                setPerPage(newPerPage);
                handleFilterChange({ per_page: newPerPage, page: 1 });
            },
        },
    ];

    // Convertir ColumnConfig a Column para DataTable
    const tableColumns = columns.map(col => ({
        key: col.key,
        label: getTextByMode(col.label),
        render: col.render,
        className: col.className,
    }));

    // Convertir ActionConfig a Action para DataTable
    const tableActions = [
        ...actions.map(action => ({
            type: action.href ? (action.href.toString().includes('edit') ? 'edit' as const : 'view' as const) : ('custom' as const),
            href: action.href ? (typeof action.href === 'function' ? `/${routeName}/:id` : action.href) : undefined,
            onClick: action.onClick,
            icon: action.icon,
            title: getTextByMode(action.label),
            className: action.variant === 'danger'
                ? 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300'
                : action.variant === 'secondary'
                ? 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300'
                : 'text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300',
            condition: action.show,
        })),
        ...(canDelete ? [{
            type: 'delete' as const,
            onClick: handleDeleteClick,
            icon: '🗑️',
            title: getTextByMode({
                niños: '🗑️ Eliminar',
                jóvenes: 'Eliminar',
                adultos: 'Eliminar',
            }),
            className: 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300',
        }] : []),
    ];

    // Estado vacío por defecto
    const defaultEmptyState = {
        icon: '📁',
        title: search
            ? getTextByMode({
                niños: `😔 No encontré ${entityName}s que coincidan`,
                jóvenes: `No se encontraron ${entityName}s`,
                adultos: `No se encontraron ${entityName}s que coincidan con los filtros`,
            })
            : getTextByMode({
                niños: `😔 No hay ${entityName}s todavía`,
                jóvenes: `No hay ${entityName}s registrados`,
                adultos: `No se encontraron ${entityName}s`,
            }),
        description: search
            ? getTextByMode({
                niños: 'Intenta cambiar los filtros',
                jóvenes: 'Intenta con otros filtros de búsqueda',
                adultos: 'Intente modificar los criterios de búsqueda',
            })
            : getTextByMode({
                niños: `¡Crea tu primer ${entityName} con el botón de arriba!`,
                jóvenes: `Comienza agregando tu primer ${entityName}`,
                adultos: `Comience agregando el primer ${entityName}`,
            }),
        showAddButton: canCreate && !search,
        addButtonText: canCreate ? getTextByMode({
            niños: `➕ ¡Crear ${entityName}!`,
            jóvenes: `➕ Crear ${entityName}`,
            adultos: `Crear Nuevo ${entityName}`,
        }) : undefined,
        addButtonHref: canCreate ? `/${routeName}/create` : undefined,
    };

    return (
        <DashboardLayout
            title={getTextByMode(title)}
        >
            <Head title={getTextByMode(title)} />

            <div className="space-y-6">
                <PageHeader
                    title={getTextByMode(title)}
                    description={getTextByMode(description)}
                    buttonHref={canCreate ? `/${routeName}/create` : '#'}
                    buttonText={canCreate ? getTextByMode({
                        niños: `➕ ¡Crear ${entityName}!`,
                        jóvenes: `➕ Crear ${entityName}`,
                        adultos: `Crear Nuevo ${entityName}`,
                    }) : ''}
                />

                <SearchFilters
                    filters={searchFilters}
                />

                <DataTable
                    columns={tableColumns}
                    data={data.data}
                    actions={tableActions}
                    emptyState={defaultEmptyState}
                    getItemKey={(item) => item.id}
                />

                <Pagination
                    links={data.links || []}
                    meta={data.meta || {
                        from: data.data?.length > 0 ? 1 : 0,
                        to: data.data?.length || 0,
                        total: data.data?.length || 0,
                        current_page: 1,
                        last_page: 1,
                    }}
                    searchParams={{
                        ...filters,
                        search,
                        sort_by: sortBy,
                        sort_order: sortOrder,
                        per_page: perPage,
                    }}
                    entityName={entityName}
                />
            </div>

            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title={getTextByMode({
                    niños: '🤔 ¿Estás seguro?',
                    jóvenes: 'Confirmar eliminación',
                    adultos: 'Confirmar eliminación',
                })}
                message={getTextByMode({
                    niños: `¿Realmente quieres eliminar este ${entityName}? ¡No se puede deshacer!`,
                    jóvenes: `¿Estás seguro de que deseas eliminar este ${entityName}?`,
                    adultos: `Esta acción no se puede deshacer. ¿Está seguro de que desea eliminar este ${entityName}?`,
                })}
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
                confirmText={getTextByMode({
                    niños: '🗑️ ¡Sí, eliminar!',
                    jóvenes: 'Sí, eliminar',
                    adultos: 'Eliminar',
                })}
                cancelText={getTextByMode({
                    niños: '❌ ¡No, cancelar!',
                    jóvenes: 'Cancelar',
                    adultos: 'Cancelar',
                })}
            />
        </DashboardLayout>
    );
}
