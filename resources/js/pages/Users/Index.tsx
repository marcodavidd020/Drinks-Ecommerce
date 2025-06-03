import { BaseIndex } from '@/components/DataTable';

interface Role {
    id: number;
    name: string;
}

interface User {
    id: number;
    nombre: string;
    email: string;
    celular?: string;
    genero?: string;
    estado: 'activo' | 'inactivo';
    roles: Role[];
    created_at: string;
    updated_at: string;
}

interface UsersIndexProps {
    users: {
        data: User[];
        links: any[];
        meta?: any;
    };
    roles: Role[];
    filters: {
        search: string;
        role: string;
        estado: string;
        sort_by: string;
        sort_order: string;
        per_page: number;
    };
}

export default function UsersIndex({ users, roles, filters }: UsersIndexProps) {
    const columns = [
        {
            key: 'nombre',
            label: {
                niños: '👤 Usuario',
                jóvenes: 'Usuario',
                adultos: 'Usuario',
            },
            render: (nombre: string, user: User) => (
                <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{nombre}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                </div>
            ),
            sortable: true,
        },
        {
            key: 'celular',
            label: {
                niños: '📱 Teléfono',
                jóvenes: 'Celular',
                adultos: 'Celular',
            },
            render: (celular: string) => celular || 'No registrado',
            sortable: true,
        },
        {
            key: 'roles',
            label: {
                niños: '🎭 Rol',
                jóvenes: 'Roles',
                adultos: 'Roles',
            },
            render: (roles: Role[]) => (
                <div className="flex flex-wrap gap-1">
                    {roles.map((role, index) => (
                        <span
                            key={index}
                            className="inline-flex rounded-full bg-indigo-100 px-2 py-1 text-xs font-semibold text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                        >
                            {role.name}
                        </span>
                    ))}
                </div>
            ),
            sortable: false,
        },
        {
            key: 'genero',
            label: {
                niños: '👦👧 Género',
                jóvenes: 'Género',
                adultos: 'Género',
            },
            render: (genero: string) => {
                if (!genero) return 'No especificado';
                const generoMap = {
                    masculino: '👨 Masculino',
                    femenino: '👩 Femenino',
                    otro: '🏳️‍⚧️ Otro',
                };
                return generoMap[genero as keyof typeof generoMap] || genero;
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
            href: (user: User) => `/users/${user.id}`,
            variant: 'secondary' as const,
        },
        {
            label: {
                niños: '✏️ Editar',
                jóvenes: 'Editar',
                adultos: 'Editar',
            },
            icon: '✏️',
            href: (user: User) => `/users/${user.id}/edit`,
            variant: 'primary' as const,
        },
    ];

    // Filtros personalizados
    const customFilters = [
        {
            type: 'select' as const,
            value: filters.role,
            onChange: (value: string) => {
                // Esta lógica se manejará en BaseIndex
            },
            options: [
                {
                    value: '',
                    label: {
                        niños: '🎭 Todos los roles',
                        jóvenes: 'Todos los roles',
                        adultos: 'Todos los roles',
                    },
                },
                ...roles.map(role => ({
                    value: role.name,
                    label: {
                        niños: `🎭 ${role.name}`,
                        jóvenes: role.name,
                        adultos: role.name,
                    },
                })),
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
            data={users}
            filters={filters}
            entityName="usuario"
            routeName="users"
            title={{
                niños: '👥 ¡Mis Usuarios!',
                jóvenes: '👥 Usuarios',
                adultos: 'Gestión de Usuarios',
            }}
            description={{
                niños: '¡Aquí puedes ver todas las personas que usan el sistema!',
                jóvenes: 'Administra los usuarios del sistema',
                adultos: 'Administre los usuarios y sus permisos',
            }}
            columns={columns}
            actions={actions}
            customFilters={customFilters}
        />
    );
}
