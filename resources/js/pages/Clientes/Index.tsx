import { BaseIndex } from '@/components/DataTable';

interface Cliente {
    id: number;
    nombre: string;
    email: string;
    celular?: string;
    direccion?: string;
    fecha_nacimiento?: string;
    genero?: string;
    estado: 'activo' | 'inactivo';
    ventas_count: number;
    created_at: string;
    updated_at: string;
}

interface ClientesIndexProps {
    clientes: {
        data: Cliente[];
        links: any[];
        meta?: any;
    };
    filters: {
        search: string;
        estado: string;
        genero: string;
        sort_by: string;
        sort_order: string;
        per_page: number;
    };
}

export default function ClientesIndex({ clientes, filters }: ClientesIndexProps) {
    // Debug log para ver los datos que recibe el componente
    console.log('Clientes data:', clientes);
    console.log('Filters:', filters);

    const columns = [
        {
            key: 'nombre',
            label: {
                niños: '👤 Nombre',
                jóvenes: 'Nombre',
                adultos: 'Nombre',
            },
            render: (nombre: string, cliente: Cliente) => {
                console.log('Cliente item:', cliente); // Debug log para cada cliente
                const clienteNombre = cliente?.nombre || nombre || 'Sin nombre';
                const clienteEmail = cliente?.email || 'Sin email';
                
                return (
                    <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">{clienteNombre}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{clienteEmail}</div>
                    </div>
                );
            },
            sortable: true,
        },
        {
            key: 'celular',
            label: {
                niños: '📱 Teléfono',
                jóvenes: 'Celular',
                adultos: 'Celular',
            },
            render: (celular: string, cliente: Cliente) => {
                const clienteCelular = cliente?.celular || celular || 'No registrado';
                return clienteCelular;
            },
            sortable: true,
        },
        {
            key: 'genero',
            label: {
                niños: '👦👧 Género',
                jóvenes: 'Género',
                adultos: 'Género',
            },
            render: (genero: string, cliente: Cliente) => {
                const clienteGenero = cliente?.genero || genero;
                if (!clienteGenero) return 'No especificado';
                const generoMap = {
                    masculino: '👨 Masculino',
                    femenino: '👩 Femenino',
                    otro: '🏳️‍⚧️ Otro',
                };
                return generoMap[clienteGenero as keyof typeof generoMap] || clienteGenero;
            },
            sortable: true,
        },
        {
            key: 'ventas_count',
            label: {
                niños: '🛒 Compras',
                jóvenes: 'N° Ventas',
                adultos: 'Número de Ventas',
            },
            render: (count: number, cliente: Cliente) => {
                const ventasCount = cliente?.ventas_count ?? count ?? 0;
                return (
                    <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {ventasCount} ventas
                    </span>
                );
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
            render: (estado: string, cliente: Cliente) => {
                const clienteEstado = cliente?.estado || estado || 'inactivo';
                return (
                    <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                            clienteEstado === 'activo'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}
                    >
                        {clienteEstado === 'activo' ? '🟢 Activo' : '🔴 Inactivo'}
                    </span>
                );
            },
            sortable: true,
        },
        {
            key: 'created_at',
            label: {
                niños: '📅 Registrado',
                jóvenes: 'Fecha Registro',
                adultos: 'Fecha de Registro',
            },
            render: (value: string) => {
                if (!value) return 'Fecha no disponible';
                const date = new Date(value);
                if (isNaN(date.getTime())) return 'Fecha inválida';
                return date.toLocaleDateString('es-CO', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                });
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
            href: (cliente: Cliente) => `/clientes/${cliente.id}`,
            variant: 'secondary' as const,
        },
        {
            label: {
                niños: '✏️ Editar',
                jóvenes: 'Editar',
                adultos: 'Editar',
            },
            icon: '✏️',
            href: (cliente: Cliente) => `/clientes/${cliente.id}/edit`,
            variant: 'primary' as const,
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
                    value: 'activo',
                    label: {
                        niños: '🟢 Activos',
                        jóvenes: '🟢 Activos',
                        adultos: 'Activos',
                    },
                },
                {
                    value: 'inactivo',
                    label: {
                        niños: '🔴 Inactivos',
                        jóvenes: '🔴 Inactivos',
                        adultos: 'Inactivos',
                    },
                },
            ],
        },
        {
            type: 'select' as const,
            value: filters.genero,
            onChange: (value: string) => {
                // Esta lógica se manejará en BaseIndex
            },
            options: [
                {
                    value: '',
                    label: {
                        niños: '👦👧 Todos los géneros',
                        jóvenes: 'Todos los géneros',
                        adultos: 'Todos los géneros',
                    },
                },
                {
                    value: 'masculino',
                    label: {
                        niños: '👨 Masculino',
                        jóvenes: 'Masculino',
                        adultos: 'Masculino',
                    },
                },
                {
                    value: 'femenino',
                    label: {
                        niños: '👩 Femenino',
                        jóvenes: 'Femenino',
                        adultos: 'Femenino',
                    },
                },
                {
                    value: 'otro',
                    label: {
                        niños: '🏳️‍⚧️ Otro',
                        jóvenes: 'Otro',
                        adultos: 'Otro',
                    },
                },
            ],
        },
    ];

    return (
        <BaseIndex
            data={clientes}
            filters={filters}
            entityName="cliente"
            routeName="clientes"
            title={{
                niños: '👥 ¡Mis Clientes!',
                jóvenes: '👥 Clientes',
                adultos: 'Gestión de Clientes',
            }}
            description={{
                niños: '¡Aquí puedes ver todas las personas que compran contigo!',
                jóvenes: 'Administra la información de tus clientes',
                adultos: 'Administre la base de datos de clientes',
            }}
            columns={columns}
            actions={actions}
            customFilters={customFilters}
        />
    );
} 