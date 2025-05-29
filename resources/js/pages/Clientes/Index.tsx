import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useAppMode } from '@/contexts/AppModeContext';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useState, useEffect } from 'react';

interface Cliente {
    id: number;
    user: {
        id: number;
        nombre: string;
        email: string;
        celular?: string;
    };
    nit?: string;
    telefono?: string;
    fecha_nacimiento?: string;
    genero?: string;
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
        per_page: number;
    };
}

export default function ClientesIndex({ clientes, filters }: ClientesIndexProps) {
    const { settings } = useAppMode();
    const [search, setSearch] = useState(filters.search);
    const [perPage, setPerPage] = useState(filters.per_page);
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        cliente?: Cliente;
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
                router.get('/clientes', {
                    search,
                    per_page: perPage,
                }, {
                    preserveState: true,
                    replace: true,
                });
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    const handlePerPageChange = (newPerPage: number) => {
        setPerPage(newPerPage);
        router.get('/clientes', {
            search,
            per_page: newPerPage,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleDeleteClick = (cliente: Cliente) => {
        setConfirmDialog({
            isOpen: true,
            cliente,
        });
    };

    const handleDeleteConfirm = () => {
        if (confirmDialog.cliente) {
            router.delete(`/clientes/${confirmDialog.cliente.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setConfirmDialog({ isOpen: false });
                },
            });
        }
    };

    const handleDeleteCancel = () => {
        setConfirmDialog({ isOpen: false });
    };

    return (
        <DashboardLayout title={getTextByMode({
            niños: '👨‍💼 ¡Mis Amigos Clientes!',
            jóvenes: '👨‍💼 Clientes',
            adultos: 'Gestión de Clientes'
        })}>
            <Head title="Clientes" />
            
            <div className={`space-y-6 ${getModeClasses()}`}>
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <p className={`text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: '¡Aquí puedes ver a todos tus amigos clientes!',
                                jóvenes: 'Administra la información de tus clientes',
                                adultos: 'Administre la información de todos los clientes registrados'
                            })}
                        </p>
                    </div>
                    
                    <Link
                        href="/clientes/create"
                        className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors ${getModeClasses()}`}
                    >
                        {getTextByMode({
                            niños: '➕ ¡Agregar Amigo!',
                            jóvenes: '➕ Nuevo Cliente',
                            adultos: '➕ Agregar Cliente'
                        })}
                    </Link>
                </div>

                {/* Filtros de búsqueda */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder={getTextByMode({
                                    niños: '🔍 ¿Buscas algún amigo?',
                                    jóvenes: '🔍 Buscar cliente...',
                                    adultos: 'Buscar cliente por nombre, email o documento...'
                                })}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                            />
                        </div>
                        <div>
                            <select
                                value={perPage}
                                onChange={(e) => handlePerPageChange(Number(e.target.value))}
                                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                            >
                                <option value={10}>10 por página</option>
                                <option value={25}>25 por página</option>
                                <option value={50}>50 por página</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Tabla de clientes */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                    {clientes.data.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="text-6xl mb-4">
                                {settings.ageMode === 'niños' ? '😔' : '📋'}
                            </div>
                            <h3 className={`text-lg font-medium text-gray-900 dark:text-gray-100 mb-2 ${getModeClasses()}`}>
                                {search ? getTextByMode({
                                    niños: `¡No encontré amigos con "${search}"!`,
                                    jóvenes: `No se encontraron clientes para "${search}"`,
                                    adultos: `No se encontraron clientes que coincidan con "${search}"`
                                }) : getTextByMode({
                                    niños: '¡No hay amigos clientes todavía!',
                                    jóvenes: 'No hay clientes registrados',
                                    adultos: 'No se encontraron clientes'
                                })}
                            </h3>
                            <p className={`text-gray-600 dark:text-gray-400 mb-4 ${getModeClasses()}`}>
                                {search ? getTextByMode({
                                    niños: '¡Intenta buscar algo diferente!',
                                    jóvenes: 'Intenta con otros términos de búsqueda',
                                    adultos: 'Intente con diferentes términos de búsqueda'
                                }) : getTextByMode({
                                    niños: '¡Agrega tu primer amigo cliente para empezar!',
                                    jóvenes: 'Comienza agregando tu primer cliente',
                                    adultos: 'Comience agregando el primer cliente al sistema'
                                })}
                            </p>
                            {!search && (
                                <Link
                                    href="/clientes/create"
                                    className={`inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors ${getModeClasses()}`}
                                >
                                    ➕ {getTextByMode({
                                        niños: 'Agregar Primer Amigo',
                                        jóvenes: 'Agregar Cliente',
                                        adultos: 'Agregar Cliente'
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
                                                niños: '😊 Amigo',
                                                jóvenes: '👤 Cliente',
                                                adultos: 'Cliente'
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
                                                niños: '📞 Teléfono',
                                                jóvenes: '📞 Teléfono',
                                                adultos: 'Teléfono'
                                            })}
                                        </th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${getModeClasses()}`}>
                                            {getTextByMode({
                                                niños: '📅 Registro',
                                                jóvenes: '📅 Registrado',
                                                adultos: 'Fecha de Registro'
                                            })}
                                        </th>
                                        <th className={`px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${getModeClasses()}`}>
                                            {getTextByMode({
                                                niños: '⚡ Acciones',
                                                jóvenes: '⚡ Acciones',
                                                adultos: 'Acciones'
                                            })}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {clientes.data.map((cliente) => (
                                        <tr key={cliente.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className={`px-6 py-4 whitespace-nowrap ${getModeClasses()}`}>
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                                                            {cliente.user.nombre.charAt(0).toUpperCase()}
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                            {cliente.user.nombre}
                                                        </div>
                                                        {cliente.nit && (
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                {settings.ageMode === 'niños' ? '🆔' : 'ID'}: {cliente.nit}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                                {cliente.user.email}
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                                {cliente.user.celular || cliente.telefono || 
                                                getTextByMode({
                                                    niños: '❌ Sin número',
                                                    jóvenes: '❌ No registrado',
                                                    adultos: 'No registrado'
                                                })}
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 ${getModeClasses()}`}>
                                                {new Date(cliente.created_at).toLocaleDateString('es-CO')}
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${getModeClasses()}`}>
                                                <div className="flex justify-end space-x-2">
                                                    <Link
                                                        href={`/clientes/${cliente.id}`}
                                                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                                        title={getTextByMode({
                                                            niños: 'Ver amigo',
                                                            jóvenes: 'Ver cliente',
                                                            adultos: 'Ver detalles'
                                                        })}
                                                    >
                                                        {settings.ageMode === 'niños' ? '👀' : '👁️'}
                                                    </Link>
                                                    <Link
                                                        href={`/clientes/${cliente.id}/edit`}
                                                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 ml-3"
                                                        title={getTextByMode({
                                                            niños: 'Editar amigo',
                                                            jóvenes: 'Editar cliente',
                                                            adultos: 'Editar información'
                                                        })}
                                                    >
                                                        {settings.ageMode === 'niños' ? '✏️' : '📝'}
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDeleteClick(cliente)}
                                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 ml-3"
                                                        title={getTextByMode({
                                                            niños: 'Eliminar amigo',
                                                            jóvenes: 'Eliminar cliente',
                                                            adultos: 'Eliminar cliente'
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
                {clientes.data.length > 0 && clientes.links && clientes.meta && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                        <div className="flex justify-between items-center">
                            <div className={`text-sm text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: `Mostrando ${clientes.meta?.from || 0} a ${clientes.meta?.to || 0} de ${clientes.meta?.total || 0} amigos`,
                                    jóvenes: `Mostrando ${clientes.meta?.from || 0} a ${clientes.meta?.to || 0} de ${clientes.meta?.total || 0} clientes`,
                                    adultos: `Mostrando ${clientes.meta?.from || 0} a ${clientes.meta?.to || 0} de ${clientes.meta?.total || 0} clientes`
                                })}
                            </div>
                            <div className="flex space-x-1">
                                {clientes.links?.map((link, index) => (
                                    link.url ? (
                                        <Link
                                            key={index}
                                            href={link.url}
                                            data={{ search, per_page: perPage }}
                                            className={`px-3 py-2 text-sm rounded-md transition-colors ${
                                                link.active 
                                                    ? 'bg-blue-600 text-white' 
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
                title={getTextByMode({
                    niños: '¿Eliminar amigo?',
                    jóvenes: '¿Eliminar cliente?',
                    adultos: 'Confirmar eliminación'
                })}
                message={
                    confirmDialog.cliente
                        ? getTextByMode({
                            niños: `¿Estás seguro de que quieres eliminar a tu amigo ${confirmDialog.cliente.user.nombre}? ¡No podrás recuperarlo después!`,
                            jóvenes: `¿Eliminar a ${confirmDialog.cliente.user.nombre}? Esta acción no se puede deshacer.`,
                            adultos: `¿Está seguro de que desea eliminar el cliente "${confirmDialog.cliente.user.nombre}"? Esta acción no se puede deshacer.`
                        })
                        : ''
                }
                confirmText={getTextByMode({
                    niños: '🗑️ Sí, eliminar',
                    jóvenes: 'Eliminar',
                    adultos: 'Eliminar'
                })}
                cancelText={getTextByMode({
                    niños: 'No, cancelar',
                    jóvenes: 'Cancelar',
                    adultos: 'Cancelar'
                })}
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
                type="danger"
            />
        </DashboardLayout>
    );
} 