import { BaseIndex } from '@/components/DataTable';

interface Proveedor {
    id: number;
    nombre: string;
    email: string;
    telefono?: string;
    direccion?: string;
    tipo: 'empresa' | 'persona';
    estado: 'activo' | 'inactivo';
    productos_count: number;
    created_at: string;
    updated_at: string;
}

interface ProveedoresIndexProps {
    proveedores: {
        data: Proveedor[];
        links: any[];
        meta?: any;
    };
    filters: {
        search: string;
        tipo: string;
        estado: string;
        sort_by: string;
        sort_order: string;
        per_page: number;
    };
}

export default function ProveedoresIndex({ proveedores, filters }: ProveedoresIndexProps) {
    const columns = [
        {
            key: 'nombre',
            label: {
                niños: '🏭 Proveedor',
                jóvenes: 'Proveedor',
                adultos: 'Proveedor',
            },
            render: (nombre: string, proveedor: Proveedor) => (
                <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{nombre}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{proveedor.email}</div>
                </div>
            ),
            sortable: true,
        },
        {
            key: 'telefono',
            label: {
                niños: '📱 Teléfono',
                jóvenes: 'Teléfono',
                adultos: 'Teléfono',
            },
            render: (telefono: string) => telefono || 'No registrado',
            sortable: true,
        },
        {
            key: 'tipo',
            label: {
                niños: '🏢 Tipo',
                jóvenes: 'Tipo',
                adultos: 'Tipo',
            },
            render: (tipo: string) => (
                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                    tipo === 'empresa' 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                }`}>
                    {tipo === 'empresa' ? '🏢 Empresa' : '👤 Persona'}
                </span>
            ),
            sortable: true,
        },
        {
            key: 'productos_count',
            label: {
                niños: '📦 Productos',
                jóvenes: 'N° Productos',
                adultos: 'Número de Productos',
            },
            render: (count: number) => (
                <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800 dark:bg-green-900 dark:text-green-200">
                    {count} productos
                </span>
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
            render: (estado: string) => (
                <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        estado === 'activo'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}
                >
                    {estado === 'activo' ? '🟢 Activo' : '🔴 Inactivo'}
                </span>
            ),
            sortable: true,
        },
        {
            key: 'created_at',
            label: {
                niños: '📅 Registrado',
                jóvenes: 'Fecha Registro',
                adultos: 'Fecha de Registro',
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
            href: (proveedor: Proveedor) => `/proveedores/${proveedor.id}`,
            variant: 'secondary' as const,
        },
        {
            label: {
                niños: '✏️ Editar',
                jóvenes: 'Editar',
                adultos: 'Editar',
            },
            icon: '✏️',
            href: (proveedor: Proveedor) => `/proveedores/${proveedor.id}/edit`,
            variant: 'primary' as const,
        },
    ];

    // Filtros personalizados
    const customFilters = [
        {
            type: 'select' as const,
            value: filters.tipo,
            onChange: (value: string) => {
                // Esta lógica se manejará en BaseIndex
            },
            options: [
                {
                    value: '',
                    label: {
                        niños: '🏢 Todos los tipos',
                        jóvenes: 'Todos los tipos',
                        adultos: 'Todos los tipos',
                    },
                },
                {
                    value: 'empresa',
                    label: {
                        niños: '🏢 Empresas',
                        jóvenes: '🏢 Empresas',
                        adultos: 'Empresas',
                    },
                },
                {
                    value: 'persona',
                    label: {
                        niños: '👤 Personas',
                        jóvenes: '👤 Personas',
                        adultos: 'Personas',
                    },
                },
            ],
        },
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
    ];

    return (
        <BaseIndex
            data={proveedores}
            filters={filters}
            entityName="proveedor"
            routeName="proveedores"
            title={{
                niños: '🏭 ¡Mis Proveedores!',
                jóvenes: '🏭 Proveedores',
                adultos: 'Gestión de Proveedores',
            }}
            description={{
                niños: '¡Aquí puedes ver todas las empresas y personas que te venden cosas!',
                jóvenes: 'Administra la información de tus proveedores',
                adultos: 'Administre la base de datos de proveedores',
            }}
            columns={columns}
            actions={actions}
            customFilters={customFilters}
        />
    );
}
