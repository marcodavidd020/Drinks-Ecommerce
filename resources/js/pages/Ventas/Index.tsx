import { BaseIndex } from '@/components/DataTable';
import { formatCurrency } from '@/lib/currency';

interface Cliente {
    id: number;
    nombre: string;
    email: string;
    nit: string;
}

interface Venta {
    id: number;
    fecha: string;
    total: number;
    estado: 'pendiente' | 'completada' | 'cancelada';
    observaciones?: string;
    productos_count: number;
    cliente?: Cliente;
    created_at: string;
    updated_at: string;
}

interface VentasIndexProps {
    ventas: {
        data: Venta[];
        links: Array<{ url?: string; label: string; active: boolean }>;
        meta?: Record<string, unknown>;
    };
    estadisticas: {
        total: number;
        completadas: number;
        pendientes: number;
        canceladas: number;
        total_ventas: number;
    };
    filters: {
        search: string;
        estado: string;
        sort_by: string;
        sort_order: string;
        per_page: number;
    };
}

export default function VentasIndex({ ventas, filters }: VentasIndexProps) {
    const formatDate = (dateString: string) => {
        if (!dateString) return 'Fecha no disponible';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Fecha inválida';
        return date.toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const columns = [
        {
            key: 'id',
            label: {
                niños: '🎫 N° Venta',
                jóvenes: 'N° Venta',
                adultos: 'Número de Venta',
            },
            render: (id: number, venta: Venta) => {
                const productosCount = venta?.productos_count ?? 0;
                
                return (
                    <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">#{id}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            {productosCount} productos
                        </div>
                    </div>
                );
            },
            sortable: true,
        },
        {
            key: 'fecha',
            label: {
                niños: '📅 Fecha',
                jóvenes: 'Fecha',
                adultos: 'Fecha de Venta',
            },
            render: (fecha: string) => formatDate(fecha),
            sortable: true,
        },
        {
            key: 'cliente',
            label: {
                niños: '👤 Cliente',
                jóvenes: 'Cliente',
                adultos: 'Cliente',
            },
            render: (cliente: Cliente | undefined) => {
                if (!cliente) {
                    return (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            Sin cliente asignado
                        </div>
                    );
                }
                
                return (
                    <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                            {cliente.nombre}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            {cliente.email}
                        </div>
                    </div>
                );
            },
            sortable: false,
        },
        {
            key: 'observaciones',
            label: {
                niños: '📝 Nota',
                jóvenes: 'Observaciones',
                adultos: 'Observaciones',
            },
            render: (observaciones: string) => observaciones || 'Sin observaciones',
            sortable: false,
        },
        {
            key: 'total',
            label: {
                niños: '💰 Total',
                jóvenes: 'Total',
                adultos: 'Total',
            },
            render: (total: number) => (
                <div className="font-semibold text-green-600 dark:text-green-400">
                    {formatCurrency(total)}
                </div>
            ),
            sortable: true,
        },
        {
            key: 'estado',
            label: {
                niños: '🚦 Estado',
                jóvenes: 'Estado',
                adultos: 'Estado',
            },
            render: (estado: string) => {
                const estadoConfig = {
                    pendiente: {
                        class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
                        icon: '🟡',
                        text: 'Pendiente',
                    },
                    completada: {
                        class: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
                        icon: '🟢',
                        text: 'Completada',
                    },
                    cancelada: {
                        class: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
                        icon: '🔴',
                        text: 'Cancelada',
                    },
                };

                const config = estadoConfig[estado as keyof typeof estadoConfig] || estadoConfig.pendiente;

                return (
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${config.class}`}>
                        <span className="mr-1">{config.icon}</span>
                        {config.text}
                    </span>
                );
            },
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
            href: (venta: Venta) => `/ventas/${venta.id}`,
            variant: 'secondary' as const,
        },
        {
            label: {
                niños: '✏️ Editar',
                jóvenes: 'Editar',
                adultos: 'Editar',
            },
            icon: '✏️',
            href: (venta: Venta) => `/ventas/${venta.id}/edit`,
            variant: 'primary' as const,
            show: (venta: Venta) => venta.estado !== 'cancelada',
        },
    ];

    // Filtros personalizados
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
                        niños: '🚦 Todos los estados',
                        jóvenes: 'Todos los estados',
                        adultos: 'Todos los estados',
                    },
                },
                {
                    value: 'pendiente',
                    label: {
                        niños: '🟡 Pendientes',
                        jóvenes: '🟡 Pendientes',
                        adultos: 'Pendientes',
                    },
                },
                {
                    value: 'completada',
                    label: {
                        niños: '🟢 Completadas',
                        jóvenes: '🟢 Completadas',
                        adultos: 'Completadas',
                    },
                },
                {
                    value: 'cancelada',
                    label: {
                        niños: '🔴 Canceladas',
                        jóvenes: '🔴 Canceladas',
                        adultos: 'Canceladas',
                    },
                },
            ],
        },
    ];

    return (
        <BaseIndex
            data={ventas}
            filters={filters}
            entityName="venta"
            routeName="ventas"
            title={{
                niños: '🛒 ¡Mis Ventas!',
                jóvenes: '🛒 Ventas',
                adultos: 'Gestión de Ventas',
            }}
            description={{
                niños: '¡Aquí puedes ver todas las ventas realizadas!',
                jóvenes: 'Administra el historial de ventas',
                adultos: 'Administre el historial de ventas y transacciones',
            }}
            columns={columns}
            actions={actions}
            customFilters={customFilters}
        />
    );
} 