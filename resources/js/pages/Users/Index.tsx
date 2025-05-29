import ConfirmDialog from '@/components/ConfirmDialog';
import { DataTable, PageHeader, Pagination, SearchFilters } from '@/components/DataTable';
import { useAppMode } from '@/contexts/AppModeContext';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface User {
    id: number;
    nombre: string;
    email: string;
    celular?: string;
    genero?: string;
    role?: string;
    estado: 'activo' | 'inactivo';
    email_verified_at?: string;
    created_at: string;
    updated_at: string;
    // Campos añadidos por el backend para Spatie roles
    role_principal?: string;
    roles_nombres?: string[];
}

interface Role {
    id: number;
    name: string;
}

interface UsersIndexProps {
    users: {
        data: User[];
        links?: any[];
        meta?: any;
    };
    allRoles: Role[];
    filters: {
        search: string;
        role: string;
        estado: string;
        per_page: number;
    };
}

export default function UsersIndex({ users, allRoles, filters }: UsersIndexProps) {
    const { settings } = useAppMode();
    const [search, setSearch] = useState(filters.search);
    const [role, setRole] = useState(filters.role);
    const [estado, setEstado] = useState(filters.estado);
    const [perPage, setPerPage] = useState(filters.per_page);
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        user?: User;
        action?: 'delete' | 'toggle';
    }>({ isOpen: false });

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
            '/users',
            {
                search,
                role,
                estado,
                per_page: perPage,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleFilterChange = (newFilters: any) => {
        router.get(
            '/users',
            {
                search,
                role,
                estado,
                per_page: perPage,
                ...newFilters,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const handleToggleClick = (user: User) => {
        setConfirmDialog({
            isOpen: true,
            user,
            action: 'toggle',
        });
    };

    const handleDeleteClick = (user: User) => {
        setConfirmDialog({
            isOpen: true,
            user,
            action: 'delete',
        });
    };

    const handleConfirm = () => {
        if (confirmDialog.user && confirmDialog.action) {
            if (confirmDialog.action === 'toggle') {
                router.patch(
                    `/users/${confirmDialog.user.id}/toggle-status`,
                    {},
                    {
                        preserveScroll: true,
                        onSuccess: () => {
                            setConfirmDialog({ isOpen: false });
                        },
                    },
                );
            } else if (confirmDialog.action === 'delete') {
                router.delete(`/users/${confirmDialog.user.id}`, {
                    preserveScroll: true,
                    onSuccess: () => {
                        setConfirmDialog({ isOpen: false });
                    },
                });
            }
        }
    };

    const handleCancel = () => {
        setConfirmDialog({ isOpen: false });
    };

    const getRoleBadge = (user: User) => {
        const roleName = user.role_principal || 'Sin rol';

        const roleMap = {
            cliente: { label: 'Cliente', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' },
            empleado: { label: 'Empleado', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' },
            admin: { label: 'Administrador', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' },
            'super-admin': { label: 'Super Admin', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' },
            'Sin rol': { label: 'Sin rol', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' },
        };

        const roleInfo = roleMap[roleName as keyof typeof roleMap] || {
            label: roleName,
            color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
        };

        return <span className={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${roleInfo.color}`}>{roleInfo.label}</span>;
    };

    const getStatusBadge = (estado: string) => {
        return (
            <span
                className={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${
                    estado === 'activo'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                }`}
            >
                {estado === 'activo' ? 'Activo' : 'Inactivo'}
            </span>
        );
    };

    // Configuración de filtros
    const searchFilters = [
        {
            type: 'search' as const,
            placeholder: getTextByMode({
                niños: '🔍 ¿Buscas algún usuario?',
                jóvenes: '🔍 Buscar usuario...',
                adultos: 'Buscar usuario por nombre, email o teléfono...',
            }),
            value: search,
            onChange: setSearch,
            colSpan: 2,
        },
        {
            type: 'select' as const,
            value: role,
            onChange: (value: string) => {
                setRole(value);
                handleFilterChange({ role: value });
            },
            options: [
                {
                    value: '',
                    label: getTextByMode({
                        niños: '🎭 Todos los roles',
                        jóvenes: 'Todos los roles',
                        adultos: 'Todos los roles',
                    }),
                },
                ...allRoles.map((r) => ({
                    value: r.name,
                    label: r.name.charAt(0).toUpperCase() + r.name.slice(1),
                })),
            ],
        },
        {
            type: 'select' as const,
            value: estado,
            onChange: (value: string) => {
                setEstado(value);
                handleFilterChange({ estado: value });
            },
            options: [
                {
                    value: '',
                    label: getTextByMode({
                        niños: '🌟 Todos los estados',
                        jóvenes: 'Todos los estados',
                        adultos: 'Todos los estados',
                    }),
                },
                {
                    value: 'activo',
                    label: getTextByMode({
                        niños: '✅ Activos',
                        jóvenes: 'Activos',
                        adultos: 'Activos',
                    }),
                },
                {
                    value: 'inactivo',
                    label: getTextByMode({
                        niños: '❌ Inactivos',
                        jóvenes: 'Inactivos',
                        adultos: 'Inactivos',
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
            key: 'usuario',
            label: getTextByMode({
                niños: '😊 Usuario',
                jóvenes: '👤 Usuario',
                adultos: 'Usuario',
            }),
            render: (_value: any, user: User) => (
                <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500 font-medium text-white">
                            {user.nombre.charAt(0).toUpperCase()}
                        </div>
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.nombre}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            {settings.ageMode === 'niños' ? '🆔' : 'ID'}: #{user.id}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            key: 'email',
            label: getTextByMode({
                niños: '📧 Email',
                jóvenes: '📧 Email',
                adultos: 'Correo Electrónico',
            }),
            render: (email: string, user: User) => (
                <div>
                    <div className="text-sm text-gray-900 dark:text-gray-100">{email}</div>
                    {user.email_verified_at ? (
                        <div className="text-xs text-green-600 dark:text-green-400">
                            ✅{' '}
                            {getTextByMode({
                                niños: 'Verificado',
                                jóvenes: 'Verificado',
                                adultos: 'Verificado',
                            })}
                        </div>
                    ) : (
                        <div className="text-xs text-yellow-600 dark:text-yellow-400">
                            ⚠️{' '}
                            {getTextByMode({
                                niños: 'Sin verificar',
                                jóvenes: 'Sin verificar',
                                adultos: 'Sin verificar',
                            })}
                        </div>
                    )}
                </div>
            ),
            className: 'text-sm',
        },
        {
            key: 'celular',
            label: getTextByMode({
                niños: '📱 Teléfono',
                jóvenes: '📱 Celular',
                adultos: 'Celular',
            }),
            render: (celular: string) =>
                celular ||
                getTextByMode({
                    niños: '❌ Sin número',
                    jóvenes: 'No registrado',
                    adultos: 'No registrado',
                }),
            className: 'text-sm text-gray-900 dark:text-gray-100',
        },
        {
            key: 'role_principal',
            label: getTextByMode({
                niños: '🎭 Rol',
                jóvenes: '🎭 Rol',
                adultos: 'Rol',
            }),
            render: (_value: any, user: User) => getRoleBadge(user),
            className: 'text-center',
        },
        {
            key: 'estado',
            label: getTextByMode({
                niños: '🌟 Estado',
                jóvenes: '🌟 Estado',
                adultos: 'Estado',
            }),
            render: (estado: string) => getStatusBadge(estado),
            className: 'text-center',
        },
        {
            key: 'created_at',
            label: getTextByMode({
                niños: '📅 Registro',
                jóvenes: '📅 Creado',
                adultos: 'Fecha de Registro',
            }),
            render: (created_at: string) => new Date(created_at).toLocaleDateString('es-CO'),
            className: 'text-sm text-gray-500 dark:text-gray-400',
        },
    ];

    // Configuración de acciones
    const actions = [
        {
            type: 'view' as const,
            href: '/users/:id',
            icon: settings.ageMode === 'niños' ? '👀' : '👁️',
            title: getTextByMode({
                niños: 'Ver usuario',
                jóvenes: 'Ver usuario',
                adultos: 'Ver detalles',
            }),
            className: 'text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300',
        },
        {
            type: 'edit' as const,
            href: '/users/:id/edit',
            icon: settings.ageMode === 'niños' ? '✏️' : '📝',
            title: getTextByMode({
                niños: 'Editar usuario',
                jóvenes: 'Editar usuario',
                adultos: 'Editar información',
            }),
            className: 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300',
        },
        {
            type: 'toggle' as const,
            onClick: handleToggleClick,
            icon: '🔄',
            title: getTextByMode({
                niños: 'Cambiar estado',
                jóvenes: 'Cambiar estado',
                adultos: 'Cambiar estado',
            }),
            className: 'text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300',
        },
        {
            type: 'delete' as const,
            onClick: handleDeleteClick,
            icon: '🗑️',
            title: getTextByMode({
                niños: 'Eliminar usuario',
                jóvenes: 'Eliminar usuario',
                adultos: 'Eliminar usuario',
            }),
            className: 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300',
        },
    ];

    // Estado vacío
    const emptyState = {
        icon: settings.ageMode === 'niños' ? '😔' : '👥',
        title:
            search || role || estado
                ? getTextByMode({
                      niños: `¡No encontré usuarios que coincidan!`,
                      jóvenes: `No se encontraron usuarios`,
                      adultos: `No se encontraron usuarios que coincidan con los filtros`,
                  })
                : getTextByMode({
                      niños: '¡No hay usuarios todavía!',
                      jóvenes: 'No hay usuarios registrados',
                      adultos: 'No se encontraron usuarios',
                  }),
        description:
            search || role || estado
                ? getTextByMode({
                      niños: '¡Intenta cambiar los filtros!',
                      jóvenes: 'Intenta con otros filtros de búsqueda',
                      adultos: 'Intente modificar los criterios de búsqueda',
                  })
                : getTextByMode({
                      niños: '¡Agrega tu primer usuario para empezar!',
                      jóvenes: 'Comienza agregando tu primer usuario',
                      adultos: 'Comience agregando el primer usuario al sistema',
                  }),
        showAddButton: !search && !role && !estado,
        addButtonText: `➕ ${getTextByMode({
            niños: 'Agregar Primer Usuario',
            jóvenes: 'Agregar Usuario',
            adultos: 'Agregar Usuario',
        })}`,
        addButtonHref: '/users/create',
    };

    return (
        <DashboardLayout
            title={getTextByMode({
                niños: '👥 ¡Mis Usuarios Geniales!',
                jóvenes: '👥 Users',
                adultos: 'Gestión de Usuarios',
            })}
        >
            <Head title="Usuarios" />

            <div className={`space-y-6 ${getModeClasses()}`}>
                <PageHeader
                    title=""
                    description={getTextByMode({
                        niños: '¡Aquí puedes ver a todos los usuarios del sistema!',
                        jóvenes: 'Administra usuarios y sus roles en el sistema',
                        adultos: 'Administre usuarios del sistema y asigne roles apropiados',
                    })}
                    buttonText={getTextByMode({
                        niños: '➕ ¡Agregar Usuario!',
                        jóvenes: '➕ Nuevo Usuario',
                        adultos: '➕ Agregar Usuario',
                    })}
                    buttonHref="/users/create"
                    buttonColor="purple"
                />

                <SearchFilters filters={searchFilters} />

                <DataTable data={users.data} columns={columns} actions={actions} emptyState={emptyState} getItemKey={(user) => user.id} />

                {users.data.length > 0 && users.links && users.meta && (
                    <Pagination
                        links={users.links}
                        meta={users.meta}
                        searchParams={{ search, role, estado, per_page: perPage }}
                        entityName={getTextByMode({
                            niños: 'usuarios',
                            jóvenes: 'usuarios',
                            adultos: 'usuarios',
                        })}
                    />
                )}
            </div>

            {/* Confirm Dialog */}
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title={
                    confirmDialog.action === 'toggle'
                        ? getTextByMode({
                              niños: '¿Cambiar estado del usuario?',
                              jóvenes: '¿Cambiar estado?',
                              adultos: 'Confirmar cambio de estado',
                          })
                        : getTextByMode({
                              niños: '¿Eliminar usuario?',
                              jóvenes: '¿Eliminar usuario?',
                              adultos: 'Confirmar eliminación',
                          })
                }
                message={
                    confirmDialog.user && confirmDialog.action === 'toggle'
                        ? getTextByMode({
                              niños: `¿Quieres ${confirmDialog.user.estado === 'activo' ? 'desactivar' : 'activar'} a ${confirmDialog.user.nombre}?`,
                              jóvenes: `¿${confirmDialog.user.estado === 'activo' ? 'Desactivar' : 'Activar'} a ${confirmDialog.user.nombre}?`,
                              adultos: `¿Está seguro de que desea ${confirmDialog.user.estado === 'activo' ? 'desactivar' : 'activar'} al usuario "${confirmDialog.user.nombre}"?`,
                          })
                        : confirmDialog.user
                          ? getTextByMode({
                                niños: `¿Estás seguro de que quieres eliminar a ${confirmDialog.user.nombre}? ¡No podrás recuperarlo después!`,
                                jóvenes: `¿Eliminar a ${confirmDialog.user.nombre}? Esta acción no se puede deshacer.`,
                                adultos: `¿Está seguro de que desea eliminar el usuario "${confirmDialog.user.nombre}"? Esta acción no se puede deshacer.`,
                            })
                          : ''
                }
                confirmText={
                    confirmDialog.action === 'toggle'
                        ? getTextByMode({
                              niños: confirmDialog.user?.estado === 'activo' ? '❌ Desactivar' : '✅ Activar',
                              jóvenes: confirmDialog.user?.estado === 'activo' ? 'Desactivar' : 'Activar',
                              adultos: confirmDialog.user?.estado === 'activo' ? 'Desactivar' : 'Activar',
                          })
                        : getTextByMode({
                              niños: '🗑️ Sí, eliminar',
                              jóvenes: 'Eliminar',
                              adultos: 'Eliminar',
                          })
                }
                cancelText={getTextByMode({
                    niños: 'No, cancelar',
                    jóvenes: 'Cancelar',
                    adultos: 'Cancelar',
                })}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                type={confirmDialog.action === 'toggle' ? 'warning' : 'danger'}
            />
        </DashboardLayout>
    );
}
