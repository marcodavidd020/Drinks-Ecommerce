import ConfirmDialog from '@/components/ConfirmDialog';
import { DataTable, PageHeader, Pagination, SearchFilters } from '@/components/DataTable';
import { useAppModeText } from '@/hooks/useAppModeText';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface BaseEntity {
    id: number;
    [key: string]: any;
}

interface BaseIndexData<T extends BaseEntity> {
    data: T[];
    links: any[];
    meta?: any;
}

interface BaseFilters {
    search: string;
    sort_by: string;
    sort_order: string;
    per_page: number;
    [key: string]: any;
}

interface ColumnConfig {
    key: string;
    label: {
        niños: string;
        jóvenes: string;
        adultos: string;
    };
    type?: 'text' | 'number' | 'date' | 'badge' | 'custom';
    render?: (value: any, item: any) => React.ReactNode;
    sortable?: boolean;
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
    renderEmptyState,
}: BaseIndexProps<T>) {
    const { getTextByMode, getModeClasses } = useAppModeText();
    
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
                handleSearch();
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    const handleSearch = () => {
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
    };

    const handleFilterChange = (newFilters: any) => {
        const params = {
            search: search,
            sort_by: sortBy,
            sort_order: sortOrder,
            per_page: perPage,
            ...newFilters,
        };

        if (newFilters.sort_by !== undefined) setSortBy(newFilters.sort_by);
        if (newFilters.sort_order !== undefined) setSortOrder(newFilters.sort_order);
        if (newFilters.per_page !== undefined) setPerPage(newFilters.per_page);

        router.get(
            `/${routeName}`,
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

    // Configuración de filtros base
    const baseSearchFilters: FilterConfig[] = [
        {
            type: 'search',
            placeholder: {
                niños: `🔍 ¿Qué ${entityName} buscas?`,
                jóvenes: `🔍 Buscar ${entityName}...`,
                adultos: `Buscar ${entityName}...`,
            },
            value: search,
            onChange: setSearch,
            colSpan: 2,
        },
        // Configuración de ordenamiento
        {
            type: 'select',
            value: `${sortBy}_${sortOrder}`,
            onChange: (value: string) => {
                const parts = value.split('_');
                const newSortOrder = parts.pop() || 'desc';
                const newSortBy = parts.join('_');

                setSortBy(newSortBy);
                setSortOrder(newSortOrder);

                const params = {
                    search,
                    sort_by: newSortBy,
                    sort_order: newSortOrder,
                    per_page: perPage,
                };

                router.get(`/${routeName}`, params, {
                    preserveState: true,
                    replace: true,
                });
            },
            options: columns
                .filter(col => col.sortable !== false)
                .flatMap(col => [
                    {
                        value: `${col.key}_asc`,
                        label: {
                            niños: `🔤 ${col.label.niños} A-Z`,
                            jóvenes: `${col.label.jóvenes} A-Z`,
                            adultos: `${col.label.adultos} A-Z`,
                        },
                    },
                    {
                        value: `${col.key}_desc`,
                        label: {
                            niños: `🔤 ${col.label.niños} Z-A`,
                            jóvenes: `${col.label.jóvenes} Z-A`,
                            adultos: `${col.label.adultos} Z-A`,
                        },
                    },
                ]),
        },
        ...customFilters,
    ];

    // Configurar acciones de DataTable
    const tableActions = [
        ...actions,
        ...(canDelete ? [{
            label: {
                niños: '🗑️ Eliminar',
                jóvenes: 'Eliminar',
                adultos: 'Eliminar',
            },
            icon: '🗑️',
            onClick: handleDeleteClick,
            variant: 'danger' as const,
        }] : []),
    ];

    return (
        <DashboardLayout
            title={getTextByMode(title)}
        >
            <Head title={getTextByMode(title)} />

            <div className="space-y-6">
                <PageHeader
                    title={getTextByMode(title)}
                    description={getTextByMode(description)}
                    createHref={canCreate ? `/${routeName}/create` : undefined}
                    createLabel={canCreate ? getTextByMode({
                        niños: `➕ ¡Crear ${entityName}!`,
                        jóvenes: `➕ Crear ${entityName}`,
                        adultos: `Crear Nuevo ${entityName}`,
                    }) : undefined}
                />

                <SearchFilters
                    filters={baseSearchFilters}
                    onFilterChange={handleFilterChange}
                />

                <DataTable
                    columns={columns}
                    data={data.data}
                    actions={tableActions}
                    emptyState={renderEmptyState ? renderEmptyState() : undefined}
                />

                <Pagination
                    links={data.links}
                    meta={data.meta}
                    searchParams={{
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