import { BaseIndex } from '@/components/DataTable';
import { formatCurrency } from '@/lib/currency';

interface Proveedor {
    id: number;
    nombre: string;
}

interface Compra {
    id: number;
    fecha: string;
    total: number;
    estado: 'pendiente' | 'recibida' | 'cancelada';
    observaciones?: string;
    proveedor: {
        id: number;
        nombre: string;
        email?: string;
        telefono?: string;
    };
    detalles_count: number;
    created_at: string;
    updated_at: string;
}

interface ComprasIndexProps {
    compras: {
        data: Compra[];
        links: Array<{ url?: string; label: string; active: boolean }>;
        meta?: Record<string, unknown>;
        total: number;
        from: number;
        to: number;
        per_page: number;
        current_page: number;
        last_page: number;
    };
    proveedores: Proveedor[];
    filters: {
        search: string;
        estado: string;
        proveedor: string;
        sort_by: string;
        sort_order: string;
        per_page: number;
    };
}

export default function ComprasIndex({ compras, proveedores, filters }: ComprasIndexProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getEstadoBadge = (estado: string) => {
        const estadoConfig = {
            pendiente: {
                class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
                icon: '⏳',
                text: 'Pendiente',
            },
            recibida: {
                class: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
                icon: '✅',
                text: 'Recibida',
            },
            cancelada: {
                class: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
                icon: '❌',
                text: 'Cancelada',
            },
        };

        const config = estadoConfig[estado as keyof typeof estadoConfig] || estadoConfig.pendiente;

        return (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.class}`}>
                <span className="mr-1">{config.icon}</span>
                {config.text}
            </span>
        );
    };

    const columns = [
        {
            key: 'id',
            label: {
                niños: '🔢 ID',
                jóvenes: 'ID',
                adultos: 'ID',
            },
            render: (value: any) => `#${value}`,
            sortable: true,
        },
        {
            key: 'fecha',
            label: {
                niños: '📅 Fecha',
                jóvenes: 'Fecha',
                adultos: 'Fecha',
            },
            render: (value: any) => formatDate(value),
            sortable: true,
        },
        {
            key: 'proveedor',
            label: {
                niños: '🏪 Proveedor',
                jóvenes: 'Proveedor',
                adultos: 'Proveedor',
            },
            render: (_: any, item: any) => (
                <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                        {(item as Compra).proveedor.nombre}
                    </div>
                    {(item as Compra).proveedor.email && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            {(item as Compra).proveedor.email}
                        </div>
                    )}
                </div>
            ),
            sortable: false,
        },
        {
            key: 'detalles_count',
            label: {
                niños: '📦 Productos',
                jóvenes: 'Productos',
                adultos: 'Productos',
            },
            render: (value: any) => `${value} ${value === 1 ? 'producto' : 'productos'}`,
            sortable: true,
        },
        {
            key: 'total',
            label: {
                niños: '💰 Total',
                jóvenes: 'Total',
                adultos: 'Total',
            },
            render: (value: any) => formatCurrency(value),
            sortable: true,
        },
        {
            key: 'estado',
            label: {
                niños: '📊 Estado',
                jóvenes: 'Estado',
                adultos: 'Estado',
            },
            render: (value: any) => getEstadoBadge(value),
            sortable: true,
        },
        {
            key: 'created_at',
            label: {
                niños: '📅 Creado',
                jóvenes: 'Fecha Creación',
                adultos: 'Fecha de Creación',
            },
            render: (value: any) => new Date(value).toLocaleDateString(),
            sortable: true,
        },
    ];

    const actions = [
        {
            label: {
                niños: '👀 Ver',
                jóvenes: 'Ver',
                adultos: 'Ver',
            },
            icon: '👀',
            href: (item: { id: number }) => `/compras/${item.id}`,
            variant: 'secondary' as const,
        },
        {
            label: {
                niños: '✏️ Editar',
                jóvenes: 'Editar',
                adultos: 'Editar',
            },
            icon: '✏️',
            href: (item: { id: number }) => `/compras/${item.id}/edit`,
            variant: 'primary' as const,
        },
    ];

    const customFilters = [
        {
            type: 'select' as const,
            key: 'estado',
            value: filters.estado,
            onChange: () => {
                // Esta lógica se manejará en BaseIndex
            },
            options: [
                {
                    value: '',
                    label: {
                        niños: '📊 Todos los estados',
                        jóvenes: 'Todos los estados',
                        adultos: 'Todos los estados',
                    },
                },
                {
                    value: 'pendiente',
                    label: {
                        niños: '⏳ Pendiente',
                        jóvenes: 'Pendiente',
                        adultos: 'Pendiente',
                    },
                },
                {
                    value: 'recibida',
                    label: {
                        niños: '✅ Recibida',
                        jóvenes: 'Recibida',
                        adultos: 'Recibida',
                    },
                },
                {
                    value: 'cancelada',
                    label: {
                        niños: '❌ Cancelada',
                        jóvenes: 'Cancelada',
                        adultos: 'Cancelada',
                    },
                },
            ],
        },
        {
            type: 'select' as const,
            key: 'proveedor',
            value: filters.proveedor,
            onChange: () => {
                // Esta lógica se manejará en BaseIndex
            },
            options: [
                {
                    value: '',
                    label: {
                        niños: '🏪 Todos los proveedores',
                        jóvenes: 'Todos los proveedores',
                        adultos: 'Todos los proveedores',
                    },
                },
                ...proveedores.map((proveedor) => ({
                    value: proveedor.id.toString(),
                    label: {
                        niños: proveedor.nombre,
                        jóvenes: proveedor.nombre,
                        adultos: proveedor.nombre,
                    },
                })),
            ],
        },
    ];

    return (
        <BaseIndex
            data={compras}
            filters={filters}
            entityName="compra"
            routeName="compras"
            title={{
                niños: '🛍️ Gestión de Compras',
                jóvenes: 'Gestión de Compras',
                adultos: 'Gestión de Compras',
            }}
            description={{
                niños: 'Administra todas las compras a proveedores',
                jóvenes: 'Administra todas las compras a proveedores',
                adultos: 'Administra y controla todas las compras realizadas a proveedores',
            }}
            columns={columns}
            actions={actions}
            customFilters={customFilters}
        />
    );
}
 