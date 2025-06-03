import { BaseIndex } from '@/components/DataTable';

interface Cliente {
    id: number;
    nombre: string;
    email: string;
}

interface Usuario {
    id: number;
    nombre: string;
}

interface Venta {
    id: number;
    numero_venta: string;
    cliente: Cliente;
    usuario: Usuario;
    total: number;
    fecha_venta: string;
    estado: 'pendiente' | 'completada' | 'cancelada';
    metodo_pago: string;
    descuento_aplicado?: number;
    items_count: number;
    created_at: string;
    updated_at: string;
}

interface VentasIndexProps {
    ventas: {
        data: Venta[];
        links: any[];
        meta?: any;
    };
    filters: {
        search: string;
        estado: string;
        metodo_pago: string;
        fecha_desde: string;
        fecha_hasta: string;
        sort_by: string;
        sort_order: string;
        per_page: number;
    };
}

export default function VentasIndex({ ventas, filters }: VentasIndexProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        }).format(amount);
    };

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
            key: 'numero_venta',
            label: {
                niños: '🎫 N° Venta',
                jóvenes: 'N° Venta',
                adultos: 'Número de Venta',
            },
            render: (numero: string, venta: Venta) => {
                console.log('Venta data:', venta); // Debug log
                const numeroVenta = venta?.numero_venta || numero || venta?.id || 'Sin número';
                const itemsCount = venta?.items_count ?? 0;
                
                return (
                    <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">#{numeroVenta}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            {itemsCount} items
                        </div>
                    </div>
                );
            },
            sortable: true,
        },
        {
            key: 'cliente',
            label: {
                niños: '👤 Cliente',
                jóvenes: 'Cliente',
                adultos: 'Cliente',
            },
            render: (cliente: Cliente) => (
                <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{cliente?.nombre || 'Sin cliente'}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{cliente?.email || 'Sin email'}</div>
                </div>
            ),
            sortable: true,
        },
        {
            key: 'usuario',
            label: {
                niños: '👨‍💼 Vendedor',
                jóvenes: 'Vendedor',
                adultos: 'Usuario',
            },
            render: (usuario: Usuario) => usuario?.nombre || 'Sin usuario',
            sortable: true,
        },
        {
            key: 'total',
            label: {
                niños: '💰 Total',
                jóvenes: 'Total',
                adultos: 'Total',
            },
            render: (total: number, venta: Venta) => (
                <div>
                    <div className="font-semibold text-green-600 dark:text-green-400">
                        {formatCurrency(total)}
                    </div>
                    {venta.descuento_aplicado && venta.descuento_aplicado > 0 && (
                        <div className="text-xs text-orange-600 dark:text-orange-400">
                            Desc: {venta.descuento_aplicado}%
                        </div>
                    )}
                </div>
            ),
            sortable: true,
        },
        {
            key: 'metodo_pago',
            label: {
                niños: '💳 Pago',
                jóvenes: 'Método de Pago',
                adultos: 'Método de Pago',
            },
            render: (metodo: string) => {
                const metodosMap = {
                    efectivo: '💵 Efectivo',
                    tarjeta: '💳 Tarjeta',
                    transferencia: '🏦 Transferencia',
                    credito: '📋 Crédito',
                };
                return metodosMap[metodo as keyof typeof metodosMap] || metodo;
            },
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
        {
            key: 'fecha_venta',
            label: {
                niños: '📅 Fecha',
                jóvenes: 'Fecha',
                adultos: 'Fecha de Venta',
            },
            render: (value: string) => formatDate(value),
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
            value: filters.estado,
            onChange: (value: string) => {
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
        {
            type: 'select' as const,
            value: filters.metodo_pago,
            onChange: (value: string) => {
                // Esta lógica se manejará en BaseIndex
            },
            options: [
                {
                    value: '',
                    label: {
                        niños: '💳 Todos los métodos',
                        jóvenes: 'Todos los métodos',
                        adultos: 'Todos los métodos de pago',
                    },
                },
                {
                    value: 'efectivo',
                    label: {
                        niños: '💵 Efectivo',
                        jóvenes: '💵 Efectivo',
                        adultos: 'Efectivo',
                    },
                },
                {
                    value: 'tarjeta',
                    label: {
                        niños: '💳 Tarjeta',
                        jóvenes: '💳 Tarjeta',
                        adultos: 'Tarjeta',
                    },
                },
                {
                    value: 'transferencia',
                    label: {
                        niños: '🏦 Transferencia',
                        jóvenes: '🏦 Transferencia',
                        adultos: 'Transferencia',
                    },
                },
                {
                    value: 'credito',
                    label: {
                        niños: '📋 Crédito',
                        jóvenes: '📋 Crédito',
                        adultos: 'Crédito',
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