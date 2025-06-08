import { BaseIndex } from '@/components/DataTable';
import { useAppModeText } from '@/hooks/useAppModeText';

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
    const { getTextByMode } = useAppModeText();

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

    const columns = [
        {
            key: 'nombre',
            label: {
                niños: '🎁 Promoción',
                jóvenes: 'Promoción',
                adultos: 'Promoción',
            },
            render: (nombre: string, promocion: Promocion) => (
                <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{nombre}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        {promocion.productos_count} productos
                    </div>
                </div>
            ),
            sortable: true,
        },
        {
            key: 'fecha_inicio',
            label: {
                niños: '📅 Inicio',
                jóvenes: 'Fecha Inicio',
                adultos: 'Fecha de Inicio',
            },
            render: (value: string) => formatDate(value),
            sortable: true,
        },
        {
            key: 'fecha_fin',
            label: {
                niños: '📅 Fin',
                jóvenes: 'Fecha Fin',
                adultos: 'Fecha de Fin',
            },
            render: (value: string) => formatDate(value),
            sortable: true,
        },
        {
            key: 'estado_calculado',
            label: {
                niños: '🚦 Estado',
                jóvenes: 'Estado',
                adultos: 'Estado',
            },
            render: (estado: string) => getEstadoBadge(estado),
            sortable: true,
        },
        {
            key: 'created_at',
            label: {
                niños: '📅 Creado',
                jóvenes: 'Fecha Creación',
                adultos: 'Fecha de Creación',
            },
            render: (value: string) => new Date(value).toLocaleDateString(),
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
            href: (promocion: Promocion) => `/promociones/${promocion.id}`,
            variant: 'secondary' as const,
        },
        {
            label: {
                niños: '✏️ Editar',
                jóvenes: 'Editar',
                adultos: 'Editar',
            },
            icon: '✏️',
            href: (promocion: Promocion) => `/promociones/${promocion.id}/edit`,
            variant: 'primary' as const,
        },
    ];

    // Filtros personalizados para estado
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
                    value: 'activa',
                    label: {
                        niños: '🟢 ¡Activas!',
                        jóvenes: '🟢 Activas',
                        adultos: 'Activas',
                    },
                },
                {
                    value: 'pendiente',
                    label: {
                        niños: '🟡 ¡Próximamente!',
                        jóvenes: '🟡 Pendientes',
                        adultos: 'Pendientes',
                    },
                },
                {
                    value: 'vencida',
                    label: {
                        niños: '🔴 Terminadas',
                        jóvenes: '🔴 Vencidas',
                        adultos: 'Vencidas',
                    },
                },
                {
                    value: 'inactiva',
                    label: {
                        niños: '⚫ Pausadas',
                        jóvenes: '⚫ Inactivas',
                        adultos: 'Inactivas',
                    },
                },
            ],
        },
    ];

    return (
        <BaseIndex
            data={promociones}
            filters={filters}
            entityName="promoción"
            routeName="promociones"
            title={{
                niños: '🎁 ¡Mis Promociones!',
                jóvenes: '🎁 Promociones',
                adultos: 'Gestión de Promociones',
            }}
            description={{
                niños: '¡Aquí puedes ver todas las ofertas súper geniales!',
                jóvenes: 'Administra ofertas y descuentos especiales',
                adultos: 'Administre promociones y ofertas especiales',
            }}
            columns={columns}
            actions={actions}
            customFilters={customFilters}
        />
    );
}
