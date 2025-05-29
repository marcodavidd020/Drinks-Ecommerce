import { useAppMode } from '@/contexts/AppModeContext';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';

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
}

export default function UserShow({ user }: UserShowProps) {
    const { settings } = useAppMode();

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
                            href="/users"
                            className="rounded-lg bg-purple-600 px-4 py-2 font-medium text-white transition-colors hover:bg-purple-700"
                        >
                            Volver a Usuarios
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
                {/* Header con botones de acción */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className={`text-3xl font-bold text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: `👀 Información de ${user.nombre}`,
                                jóvenes: `Detalles de ${user.nombre}`,
                                adultos: `Información del Usuario`,
                            })}
                        </h1>
                        <p className={`mt-2 text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: 'Aquí puedes ver toda la información de tu usuario genial',
                                jóvenes: 'Información completa del usuario',
                                adultos: 'Información detallada del usuario en el sistema',
                            })}
                        </p>
                    </div>

                    <div className="flex space-x-3">
                        <Link
                            href={`/users/${user.id}/edit`}
                            className={`flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 ${getModeClasses()}`}
                        >
                            <span>✏️</span>
                            <span>
                                {getTextByMode({
                                    niños: 'Editar',
                                    jóvenes: 'Editar',
                                    adultos: 'Editar',
                                })}
                            </span>
                        </Link>
                        <Link
                            href="/users"
                            className={`flex items-center space-x-2 rounded-lg bg-gray-500 px-4 py-2 font-medium text-white transition-colors hover:bg-gray-600 ${getModeClasses()}`}
                        >
                            <span>⬅️</span>
                            <span>
                                {getTextByMode({
                                    niños: 'Volver',
                                    jóvenes: 'Volver',
                                    adultos: 'Volver',
                                })}
                            </span>
                        </Link>
                    </div>
                </div>

                {/* Información del usuario */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Información principal */}
                    <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                        <h2 className={`mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: '👤 Información Principal',
                                jóvenes: '👤 Información Principal',
                                adultos: 'Información Principal',
                            })}
                        </h2>

                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <div className="h-16 w-16 flex-shrink-0">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-500 text-2xl font-bold text-white">
                                        {getInitials(user.nombre)}
                                    </div>
                                </div>
                                <div>
                                    <h3 className={`text-lg font-medium text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>{user.nombre}</h3>
                                    <div className="mt-1 flex items-center space-x-2">
                                        {getRoleBadge(user.role_principal)}
                                        {getStatusBadge(user.estado)}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className={`block text-sm font-medium text-gray-500 dark:text-gray-400 ${getModeClasses()}`}>
                                        {getTextByMode({
                                            niños: '📧 Email',
                                            jóvenes: '📧 Email',
                                            adultos: 'Correo Electrónico',
                                        })}
                                    </label>
                                    <p className={`text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>{user.email}</p>
                                    {user.email_verified_at ? (
                                        <span className="text-xs text-green-600">
                                            ✅{' '}
                                            {getTextByMode({
                                                niños: 'Verificado',
                                                jóvenes: 'Verificado',
                                                adultos: 'Email verificado',
                                            })}
                                        </span>
                                    ) : (
                                        <span className="text-xs text-yellow-600">
                                            ⏳{' '}
                                            {getTextByMode({
                                                niños: 'Sin verificar',
                                                jóvenes: 'Sin verificar',
                                                adultos: 'Email sin verificar',
                                            })}
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium text-gray-500 dark:text-gray-400 ${getModeClasses()}`}>
                                        {getTextByMode({
                                            niños: '📱 Teléfono',
                                            jóvenes: '📱 Teléfono',
                                            adultos: 'Número de Teléfono',
                                        })}
                                    </label>
                                    <p className={`text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                        {user.celular ||
                                            getTextByMode({
                                                niños: '❌ Sin teléfono',
                                                jóvenes: 'No registrado',
                                                adultos: 'No registrado',
                                            })}
                                    </p>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium text-gray-500 dark:text-gray-400 ${getModeClasses()}`}>
                                        {getTextByMode({
                                            niños: '🧑‍🤝‍🧑 Género',
                                            jóvenes: '🧑‍🤝‍🧑 Género',
                                            adultos: 'Género',
                                        })}
                                    </label>
                                    <p className={`text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                        {user.genero === 'masculino'
                                            ? getTextByMode({
                                                  niños: '👨 Masculino',
                                                  jóvenes: '👨 Masculino',
                                                  adultos: 'Masculino',
                                              })
                                            : user.genero === 'femenino'
                                              ? getTextByMode({
                                                    niños: '👩 Femenino',
                                                    jóvenes: '👩 Femenino',
                                                    adultos: 'Femenino',
                                                })
                                              : user.genero === 'otro'
                                                ? getTextByMode({
                                                      niños: '🧑 Otro',
                                                      jóvenes: '🧑 Otro',
                                                      adultos: 'Otro',
                                                  })
                                                : getTextByMode({
                                                      niños: '❓ No especificado',
                                                      jóvenes: 'No especificado',
                                                      adultos: 'No especificado',
                                                  })}
                                    </p>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium text-gray-500 dark:text-gray-400 ${getModeClasses()}`}>
                                        {getTextByMode({
                                            niños: '🎭 Roles',
                                            jóvenes: '🎭 Roles',
                                            adultos: 'Roles Asignados',
                                        })}
                                    </label>
                                    <div className="space-y-1">
                                        {user.roles_nombres && user.roles_nombres.length > 0 ? (
                                            user.roles_nombres.map((role, index) => <div key={index}>{getRoleBadge(role)}</div>)
                                        ) : (
                                            <span className="text-sm text-gray-500">
                                                {getTextByMode({
                                                    niños: '❌ Sin roles',
                                                    jóvenes: 'Sin roles asignados',
                                                    adultos: 'Sin roles asignados',
                                                })}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Información del sistema */}
                    <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                        <h2 className={`mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: '⚙️ Información del Sistema',
                                jóvenes: '⚙️ Info del Sistema',
                                adultos: 'Información del Sistema',
                            })}
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium text-gray-500 dark:text-gray-400 ${getModeClasses()}`}>
                                    {getTextByMode({
                                        niños: '📅 Fecha de Registro',
                                        jóvenes: '📅 Registrado el',
                                        adultos: 'Fecha de Registro',
                                    })}
                                </label>
                                <p className={`text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>{formatDate(user.created_at)}</p>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium text-gray-500 dark:text-gray-400 ${getModeClasses()}`}>
                                    {getTextByMode({
                                        niños: '🔄 Última Actualización',
                                        jóvenes: '🔄 Actualizado el',
                                        adultos: 'Última Modificación',
                                    })}
                                </label>
                                <p className={`text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>{formatDate(user.updated_at)}</p>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium text-gray-500 dark:text-gray-400 ${getModeClasses()}`}>
                                    {getTextByMode({
                                        niños: '🆔 ID del Usuario',
                                        jóvenes: '🆔 ID',
                                        adultos: 'ID del Usuario',
                                    })}
                                </label>
                                <p className={`font-mono text-sm text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>#{user.id}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
