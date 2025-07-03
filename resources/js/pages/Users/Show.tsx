import { useAppMode } from '@/contexts/AppModeContext';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';
import { ShowHeader, InfoCard } from '@/components/Show';

interface User {
    id: number;
    nombre: string;
    email: string;
    celular?: string;
    genero?: string;
    estado: 'activo' | 'inactivo';
    email_verified_at?: string;
    created_at: string;
    updated_at: string;
    // Campos de Spatie roles
    roles?: Array<{ id: number; name: string }>;
    role_principal?: string;
    roles_nombres?: string[];
}

interface UserShowProps {
    user: User;
    isViewingOwnProfile: boolean;
    canManageUsers: boolean;
    currentUserRole?: string;
}

export default function UserShow({ user, isViewingOwnProfile, canManageUsers, currentUserRole }: UserShowProps) {
    const { settings } = useAppMode();

    // Determinar la URL de regreso según el contexto
    const getBackHref = () => {
        if (canManageUsers) {
            // Si puede gestionar usuarios, va a la lista de usuarios
            return '/users';
        } else if (isViewingOwnProfile) {
            // Si está viendo su propio perfil, va al dashboard apropiado
            if (currentUserRole === 'cliente') {
                return '/cliente/dashboard';
            } else {
                return '/dashboard';
            }
        } else {
            // En caso de duda, va al dashboard
            return '/dashboard';
        }
    };

    const getBackText = () => {
        if (canManageUsers) {
            return getTextByMode({
                niños: '⬅️ Volver a Usuarios',
                jóvenes: 'Volver a Usuarios',
                adultos: 'Volver a Usuarios',
            });
        } else if (isViewingOwnProfile) {
            return getTextByMode({
                niños: '⬅️ Volver al Dashboard',
                jóvenes: 'Volver al Dashboard',
                adultos: 'Volver al Dashboard',
            });
        } else {
            return getTextByMode({
                niños: '⬅️ Volver',
                jóvenes: 'Volver',
                adultos: 'Volver',
            });
        }
    };

    // Determinar si se puede editar el perfil
    const getEditHref = () => {
        if (canManageUsers) {
            // Si puede gestionar usuarios, puede editar cualquier usuario
            return `/users/${user.id}/edit`;
        } else if (isViewingOwnProfile) {
            // Si está viendo su propio perfil, va a configuración personal
            return '/settings/profile';
        } else {
            // Si no puede gestionar usuarios ni es su propio perfil, no puede editar
            return null;
        }
    };

    const getEditText = () => {
        if (canManageUsers) {
            return getTextByMode({
                niños: '✏️ Editar Usuario',
                jóvenes: 'Editar Usuario',
                adultos: 'Editar Usuario',
            });
        } else if (isViewingOwnProfile) {
            return getTextByMode({
                niños: '✏️ Editar mi Perfil',
                jóvenes: 'Editar Perfil',
                adultos: 'Editar Perfil',
            });
        } else {
            return null;
        }
    };

    // Validación para evitar errores si user no está definido
    if (!user) {
        return (
            <DashboardLayout title="Error">
                <Head title="Error - Usuario no encontrado" />
                <div className="flex min-h-96 items-center justify-center">
                    <div className="text-center">
                        <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">Usuario no encontrado</h1>
                        <p className="mb-4 text-gray-600 dark:text-gray-400">El usuario que estás buscando no existe o ha sido eliminado.</p>
                        <Link
                            href={getBackHref()}
                            className="rounded-lg bg-purple-600 px-4 py-2 font-medium text-white transition-colors hover:bg-purple-700"
                        >
                            {getBackText()}
                        </Link>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

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

    const formatDate = (dateString: string) => {
        if (!dateString) return 'No disponible';
        return new Date(dateString).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getRoleBadge = (roleName?: string) => {
        if (!roleName) {
            return (
                <span className="inline-flex rounded-full bg-gray-100 px-2 text-xs leading-5 font-semibold text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">
                    Sin rol
                </span>
            );
        }

        const roleMap = {
            cliente: { label: 'Cliente', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' },
            empleado: { label: 'Empleado', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' },
            admin: { label: 'Administrador', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' },
            'super-admin': { label: 'Super Admin', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' },
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

    const getInitials = (name?: string) => {
        if (!name) return '?';
        return name.charAt(0).toUpperCase();
    };

    // Configuración de campos para InfoCard
    const personalFields = [
        {
            label: getTextByMode({
                niños: '😊 Nombre Completo',
                jóvenes: '👤 Nombre',
                adultos: 'Nombre Completo',
            }),
            value: (
                <div className="flex items-center space-x-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500 text-lg font-bold text-white">
                        {getInitials(user.nombre)}
                    </div>
                    <span className="font-medium">{user.nombre}</span>
                </div>
            ),
            span: 2 as const
        },
        {
            label: getTextByMode({
                niños: '📧 Email',
                jóvenes: '📧 Email',
                adultos: 'Correo Electrónico',
            }),
            value: (
                <div>
                    <div>{user.email}</div>
                    <div className="text-sm">
                        {user.email_verified_at ? (
                            <span className="text-green-600 dark:text-green-400">
                                ✅ {getTextByMode({
                                    niños: 'Verificado',
                                    jóvenes: 'Verificado',
                                    adultos: 'Verificado'
                                })}
                            </span>
                        ) : (
                            <span className="text-yellow-600 dark:text-yellow-400">
                                ⚠️ {getTextByMode({
                                    niños: 'Sin verificar',
                                    jóvenes: 'Sin verificar',
                                    adultos: 'Sin verificar'
                                })}
                            </span>
                        )}
                    </div>
                </div>
            )
        },
        {
            label: getTextByMode({
                niños: '📱 Teléfono',
                jóvenes: '📱 Celular',
                adultos: 'Celular',
            }),
            value: user.celular || getTextByMode({
                niños: '❌ Sin número',
                jóvenes: 'No registrado',
                adultos: 'No registrado'
            })
        },
        {
            label: getTextByMode({
                niños: '🚻 Género',
                jóvenes: '🚻 Género',
                adultos: 'Género',
            }),
            value: user.genero || getTextByMode({
                niños: '❓ No especificado',
                jóvenes: 'No especificado',
                adultos: 'No especificado'
            })
        },
        {
            label: getTextByMode({
                niños: '🎭 Rol Principal',
                jóvenes: '🎭 Rol',
                adultos: 'Rol Principal',
            }),
            value: getRoleBadge(user.role_principal)
        }
    ];

    const statusFields = [
        {
            label: getTextByMode({
                niños: '🌟 Estado',
                jóvenes: '🌟 Estado',
                adultos: 'Estado Actual',
            }),
            value: getStatusBadge(user.estado),
            span: 2 as const
        }
    ];

    const dateFields = [
        {
            label: getTextByMode({
                niños: '📅 Fecha de Registro',
                jóvenes: '📅 Registrado',
                adultos: 'Fecha de Registro',
            }),
            value: formatDate(user.created_at)
        },
        {
            label: getTextByMode({
                niños: '🔄 Última Actualización',
                jóvenes: '🔄 Actualizado',
                adultos: 'Última Actualización',
            }),
            value: formatDate(user.updated_at)
        }
    ];

    const rolesFields = user.roles && user.roles.length > 0 ? [
        {
            label: getTextByMode({
                niños: '🎭 Todos los Roles',
                jóvenes: '🎭 Roles Asignados',
                adultos: 'Roles del Sistema',
            }),
            value: (
                <div className="flex flex-wrap gap-2">
                    {user.roles.map(role => (
                        <span key={role.id} className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                            {role.name}
                        </span>
                    ))}
                </div>
            ),
            span: 2 as const
        }
    ] : [];

    return (
        <DashboardLayout
            title={getTextByMode({
                niños: '👀 Ver Usuario Genial',
                jóvenes: '👀 Ver Usuario',
                adultos: 'Detalles del Usuario',
            })}
        >
            <Head title={`Usuario: ${user.nombre}`} />

            <div className={`space-y-6 ${getModeClasses()}`}>
                <ShowHeader
                    title={getTextByMode({
                        niños: isViewingOwnProfile ? `👀 Mi Información` : `👀 Información de ${user.nombre}`,
                        jóvenes: isViewingOwnProfile ? `Mi Perfil` : `Detalles de ${user.nombre}`,
                        adultos: isViewingOwnProfile ? `Mi Perfil` : `Información del Usuario`,
                    })}
                    description={getTextByMode({
                        niños: isViewingOwnProfile ? 'Aquí puedes ver toda tu información genial' : 'Aquí puedes ver toda la información de tu usuario genial',
                        jóvenes: isViewingOwnProfile ? 'Tu información personal' : 'Información completa del usuario',
                        adultos: isViewingOwnProfile ? 'Tu información personal en el sistema' : 'Información detallada del usuario en el sistema',
                    })}
                    editHref={getEditHref()}
                    backHref={getBackHref()}
                    editText={getEditText()}
                    backText={getBackText()}
                />

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <InfoCard
                        title={getTextByMode({
                            niños: '👤 Información Personal',
                            jóvenes: '👤 Información Personal',
                            adultos: 'Información Personal',
                        })}
                        fields={personalFields}
                        columns={2}
                    />

                    <div className="space-y-6">
                        <InfoCard
                            title={getTextByMode({
                                niños: '🌟 Estado del Usuario',
                                jóvenes: '🌟 Estado',
                                adultos: 'Estado del Usuario',
                            })}
                            fields={statusFields}
                            columns={1}
                        />

                        <InfoCard
                            title={getTextByMode({
                                niños: '📅 Fechas Importantes',
                                jóvenes: '📅 Fechas',
                                adultos: 'Información de Fechas',
                            })}
                            fields={dateFields}
                            columns={1}
                        />

                        {rolesFields.length > 0 && (
                            <InfoCard
                                title={getTextByMode({
                                    niños: '🎭 Roles y Permisos',
                                    jóvenes: '🎭 Roles',
                                    adultos: 'Roles y Permisos',
                                })}
                                fields={rolesFields}
                                columns={1}
                            />
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
