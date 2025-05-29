import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useAppMode } from '@/contexts/AppModeContext';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useState, useEffect } from 'react';

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
    const [isLoading, setIsLoading] = useState(false);
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
            if (search !== filters.search || role !== filters.role || estado !== filters.estado) {
                router.get('/users', {
                    search,
                    role,
                    estado,
                    per_page: perPage,
                }, {
                    preserveState: true,
                    replace: true,
                });
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [search, role, estado]);

    const handlePerPageChange = (newPerPage: number) => {
        setPerPage(newPerPage);
        router.get('/users', {
            search,
            role,
            estado,
            per_page: newPerPage,
        }, {
            preserveState: true,
            replace: true,
        });
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
            setIsLoading(true);
            
            if (confirmDialog.action === 'toggle') {
                router.patch(`/users/${confirmDialog.user.id}/toggle-status`, {}, {
                    preserveScroll: true,
                    onFinish: () => {
                        setIsLoading(false);
                        setConfirmDialog({ isOpen: false });
                    },
                });
            } else if (confirmDialog.action === 'delete') {
                router.delete(`/users/${confirmDialog.user.id}`, {
                    preserveScroll: true,
                    onFinish: () => {
                        setIsLoading(false);
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
            'cliente': { label: 'Cliente', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' },
            'empleado': { label: 'Empleado', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' },
            'admin': { label: 'Administrador', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' },
            'super-admin': { label: 'Super Admin', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' },
            'Sin rol': { label: 'Sin rol', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' },
        };

        const roleInfo = roleMap[roleName as keyof typeof roleMap] || { 
            label: roleName, 
            color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' 
        };

        return (
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${roleInfo.color}`}>
                {roleInfo.label}
            </span>
        );
    };

    const getStatusBadge = (estado: string) => {
        return (
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                estado === 'activo' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
            }`}>
                {estado === 'activo' ? 'Activo' : 'Inactivo'}
            </span>
        );
    };

    return (
        <DashboardLayout title={getTextByMode({
            niños: '👥 ¡Mis Usuarios Geniales!',
            jóvenes: '👥 Users',
            adultos: 'Gestión de Usuarios'
        })}>
            <Head title="Usuarios" />
            
            <div className={`space-y-6 ${getModeClasses()}`}>
                {/* Header con botón de agregar */}
                <div className="flex justify-between items-center">
                    <div>
                        <p className={`text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: '¡Aquí puedes ver a todos los usuarios del sistema!',
                                jóvenes: 'Administra usuarios y sus roles en el sistema',
                                adultos: 'Administre usuarios del sistema y asigne roles apropiados'
                            })}
                        </p>
                    </div>
                    
                    <Link
                        href="/users/create"
                        className={`bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors ${getModeClasses()}`}
                    >
                        {getTextByMode({
                            niños: '➕ ¡Agregar Usuario!',
                            jóvenes: '➕ Nuevo Usuario',
                            adultos: '➕ Agregar Usuario'
                        })}
                    </Link>
                </div>

                {/* Filtros de búsqueda */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <input
                                type="text"
                                placeholder={getTextByMode({
                                    niños: '🔍 ¿Buscas algún usuario?',
                                    jóvenes: '🔍 Buscar usuario...',
                                    adultos: 'Buscar por nombre o email...'
                                })}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
                            />
                        </div>
                        <div>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
                            >
                                <option value="">Todos los roles</option>
                                {allRoles.map((roleOption) => (
                                    <option key={roleOption.id} value={roleOption.name}>
                                        {roleOption.name === 'cliente' ? 'Cliente' :
                                         roleOption.name === 'empleado' ? 'Empleado' :
                                         roleOption.name === 'admin' ? 'Administrador' :
                                         roleOption.name === 'super-admin' ? 'Super Administrador' :
                                         roleOption.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <select
                                value={estado}
                                onChange={(e) => setEstado(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
                            >
                                <option value="">Todos los estados</option>
                                <option value="activo">Activos</option>
                                <option value="inactivo">Inactivos</option>
                            </select>
                        </div>
                        <div>
                            <select
                                value={perPage}
                                onChange={(e) => handlePerPageChange(Number(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
                            >
                                <option value={10}>10 por página</option>
                                <option value={25}>25 por página</option>
                                <option value={50}>50 por página</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Tabla de usuarios */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                    {users.data.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="text-6xl mb-4">
                                {settings.ageMode === 'niños' ? '😔' : '👥'}
                            </div>
                            <h3 className={`text-lg font-medium text-gray-900 dark:text-gray-100 mb-2 ${getModeClasses()}`}>
                                {search || role || estado ? getTextByMode({
                                    niños: `¡No encontré usuarios con esos filtros!`,
                                    jóvenes: `No se encontraron usuarios para los filtros aplicados`,
                                    adultos: `No se encontraron usuarios que coincidan con los filtros`
                                }) : getTextByMode({
                                    niños: '¡No hay usuarios todavía!',
                                    jóvenes: 'No hay usuarios registrados',
                                    adultos: 'No se encontraron usuarios'
                                })}
                            </h3>
                            <p className={`text-gray-600 dark:text-gray-400 mb-4 ${getModeClasses()}`}>
                                {search || role || estado ? getTextByMode({
                                    niños: '¡Intenta cambiar los filtros!',
                                    jóvenes: 'Intenta con otros filtros de búsqueda',
                                    adultos: 'Intente con diferentes filtros de búsqueda'
                                }) : getTextByMode({
                                    niños: '¡Agrega tu primer usuario para empezar!',
                                    jóvenes: 'Comienza agregando tu primer usuario',
                                    adultos: 'Comience agregando el primer usuario al sistema'
                                })}
                            </p>
                            {!search && !role && !estado && (
                                <Link
                                    href="/users/create"
                                    className={`inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors ${getModeClasses()}`}
                                >
                                    ➕ {getTextByMode({
                                        niños: 'Agregar Primer Usuario',
                                        jóvenes: 'Agregar Usuario',
                                        adultos: 'Agregar Usuario'
                                    })}
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-900">
                                    <tr>
                                        <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${getModeClasses()}`}>
                                            {getTextByMode({
                                                niños: '👤 Usuario',
                                                jóvenes: '👤 User',
                                                adultos: 'Usuario'
                                            })}
                                        </th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${getModeClasses()}`}>
                                            {getTextByMode({
                                                niños: '📧 Email',
                                                jóvenes: '📧 Email',
                                                adultos: 'Correo Electrónico'
                                            })}
                                        </th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${getModeClasses()}`}>
                                            {getTextByMode({
                                                niños: '🎭 Rol',
                                                jóvenes: '🎭 Role',
                                                adultos: 'Rol'
                                            })}
                                        </th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${getModeClasses()}`}>
                                            {getTextByMode({
                                                niños: '📱 Teléfono',
                                                jóvenes: '📱 Phone',
                                                adultos: 'Teléfono'
                                            })}
                                        </th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${getModeClasses()}`}>
                                            {getTextByMode({
                                                niños: '⚡ Estado',
                                                jóvenes: '⚡ Status',
                                                adultos: 'Estado'
                                            })}
                                        </th>
                                        <th className={`px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${getModeClasses()}`}>
                                            {getTextByMode({
                                                niños: '🔧 Acciones',
                                                jóvenes: '🔧 Actions',
                                                adultos: 'Acciones'
                                            })}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {users.data.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className={`px-6 py-4 whitespace-nowrap ${getModeClasses()}`}>
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-medium">
                                                            {user.nombre.charAt(0).toUpperCase()}
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                            {user.nombre}
                                                        </div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            {user.email_verified_at ? (
                                                                <span className="text-green-600">
                                                                    {settings.ageMode === 'niños' ? '✅ Verificado' : '✅ Verificado'}
                                                                </span>
                                                            ) : (
                                                                <span className="text-yellow-600">
                                                                    {settings.ageMode === 'niños' ? '⏳ Sin verificar' : '⏳ Sin verificar'}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                                {user.email}
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap ${getModeClasses()}`}>
                                                {getRoleBadge(user)}
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                                {user.celular || getTextByMode({
                                                    niños: '❌ Sin número',
                                                    jóvenes: '❌ No registrado',
                                                    adultos: 'No registrado'
                                                })}
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap ${getModeClasses()}`}>
                                                {getStatusBadge(user.estado)}
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${getModeClasses()}`}>
                                                <div className="flex justify-end space-x-2">
                                                    <Link
                                                        href={`/users/${user.id}`}
                                                        className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                                                        title={getTextByMode({
                                                            niños: 'Ver usuario',
                                                            jóvenes: 'Ver usuario',
                                                            adultos: 'Ver detalles'
                                                        })}
                                                    >
                                                        {settings.ageMode === 'niños' ? '👀' : '👁️'}
                                                    </Link>
                                                    <Link
                                                        href={`/users/${user.id}/edit`}
                                                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 ml-3"
                                                        title={getTextByMode({
                                                            niños: 'Editar usuario',
                                                            jóvenes: 'Editar usuario',
                                                            adultos: 'Editar información'
                                                        })}
                                                    >
                                                        {settings.ageMode === 'niños' ? '✏️' : '📝'}
                                                    </Link>
                                                    <button
                                                        onClick={() => handleToggleClick(user)}
                                                        disabled={isLoading}
                                                        className={`ml-3 ${
                                                            user.estado === 'activo' 
                                                                ? 'text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300' 
                                                                : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'
                                                        } disabled:opacity-50`}
                                                        title={getTextByMode({
                                                            niños: user.estado === 'activo' ? 'Desactivar' : 'Activar',
                                                            jóvenes: user.estado === 'activo' ? 'Deactivate' : 'Activate',
                                                            adultos: user.estado === 'activo' ? 'Desactivar' : 'Activar'
                                                        })}
                                                    >
                                                        {user.estado === 'activo' ? 
                                                            (settings.ageMode === 'niños' ? '⏸️' : '⏸️') : 
                                                            (settings.ageMode === 'niños' ? '▶️' : '▶️')
                                                        }
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(user)}
                                                        disabled={isLoading}
                                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 ml-3 disabled:opacity-50"
                                                        title={getTextByMode({
                                                            niños: 'Eliminar usuario',
                                                            jóvenes: 'Eliminar usuario',
                                                            adultos: 'Eliminar usuario'
                                                        })}
                                                    >
                                                        {settings.ageMode === 'niños' ? '🗑️' : '🗑️'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Paginación */}
                {users.data.length > 0 && users.links && users.meta && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                        <div className="flex justify-between items-center">
                            <div className={`text-sm text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: `Mostrando ${users.meta?.from || 1} a ${users.meta?.to || users.data.length} de ${users.meta?.total || users.data.length} usuarios`,
                                    jóvenes: `Mostrando ${users.meta?.from || 1} a ${users.meta?.to || users.data.length} de ${users.meta?.total || users.data.length} usuarios`,
                                    adultos: `Mostrando ${users.meta?.from || 1} a ${users.meta?.to || users.data.length} de ${users.meta?.total || users.data.length} usuarios`
                                })}
                            </div>
                            <div className="flex space-x-1">
                                {users.links?.map((link, index) => (
                                    link.url ? (
                                        <Link
                                            key={index}
                                            href={link.url}
                                            data={{ search, role, estado, per_page: perPage }}
                                            className={`px-3 py-2 text-sm rounded-md transition-colors ${
                                                link.active 
                                                    ? 'bg-purple-600 text-white' 
                                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                            } ${getModeClasses()}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span
                                            key={index}
                                            className={`px-3 py-2 text-sm rounded-md text-gray-400 dark:text-gray-600 ${getModeClasses()}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    )
                                )) || []}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Confirm Dialog */}
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title={confirmDialog.action === 'delete' 
                    ? getTextByMode({
                        niños: '¿Eliminar usuario?',
                        jóvenes: '¿Eliminar usuario?',
                        adultos: 'Confirmar eliminación'
                    })
                    : getTextByMode({
                        niños: '¿Cambiar estado?',
                        jóvenes: '¿Cambiar estado?',
                        adultos: 'Confirmar cambio de estado'
                    })
                }
                message={
                    confirmDialog.user && confirmDialog.action === 'delete'
                        ? getTextByMode({
                            niños: `¿Estás seguro de que quieres eliminar a ${confirmDialog.user.nombre}? ¡No podrás recuperarlo después!`,
                            jóvenes: `¿Eliminar a ${confirmDialog.user.nombre}? Esta acción no se puede deshacer.`,
                            adultos: `¿Está seguro de que desea eliminar el usuario "${confirmDialog.user.nombre}"? Esta acción no se puede deshacer.`
                        })
                        : confirmDialog.user
                        ? getTextByMode({
                            niños: `¿${confirmDialog.user.estado === 'activo' ? 'Desactivar' : 'Activar'} a ${confirmDialog.user.nombre}?`,
                            jóvenes: `¿${confirmDialog.user.estado === 'activo' ? 'Desactivar' : 'Activar'} a ${confirmDialog.user.nombre}?`,
                            adultos: `¿Está seguro de que desea ${confirmDialog.user.estado === 'activo' ? 'desactivar' : 'activar'} al usuario "${confirmDialog.user.nombre}"?`
                        })
                        : ''
                }
                confirmText={
                    confirmDialog.action === 'delete' 
                        ? getTextByMode({
                            niños: '🗑️ Sí, eliminar',
                            jóvenes: 'Eliminar',
                            adultos: 'Eliminar'
                        })
                        : getTextByMode({
                            niños: confirmDialog.user?.estado === 'activo' ? '⏸️ Desactivar' : '▶️ Activar',
                            jóvenes: confirmDialog.user?.estado === 'activo' ? 'Desactivar' : 'Activar',
                            adultos: confirmDialog.user?.estado === 'activo' ? 'Desactivar' : 'Activar'
                        })
                }
                cancelText={getTextByMode({
                    niños: 'No, cancelar',
                    jóvenes: 'Cancelar',
                    adultos: 'Cancelar'
                })}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                type={confirmDialog.action === 'delete' ? 'danger' : 'warning'}
            />
        </DashboardLayout>
    );
} 