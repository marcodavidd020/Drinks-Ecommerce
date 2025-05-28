import { Head, Link, router } from '@inertiajs/react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useAppMode } from '@/contexts/AppModeContext';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useState, useEffect } from 'react';

interface Proveedor {
    id: number;
    nombre: string;
    telefono?: string;
    email?: string;
    direccion?: string;
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
        per_page: number;
    };
}

export default function ProveedoresIndex({ proveedores, filters }: ProveedoresIndexProps) {
    const { settings } = useAppMode();
    const [search, setSearch] = useState(filters.search);
    const [perPage, setPerPage] = useState(filters.per_page);
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        proveedor?: Proveedor;
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
                router.get('/proveedores', {
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
        router.get('/proveedores', {
            search,
            per_page: newPerPage,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleDeleteClick = (proveedor: Proveedor) => {
        setConfirmDialog({
            isOpen: true,
            proveedor,
        });
    };

    const handleDeleteConfirm = () => {
        if (confirmDialog.proveedor) {
            router.delete(`/proveedores/${confirmDialog.proveedor.id}`, {
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
            niños: '🏭 ¡Mis Amigos Proveedores!',
            jóvenes: '🏭 Proveedores',
            adultos: 'Gestión de Proveedores'
        })}>
            <Head title="Proveedores" />
            
            <div className={`space-y-6 ${getModeClasses()}`}>
                {/* Filtros de búsqueda */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder={getTextByMode({
                                    niños: '🔍 ¿Buscas algún proveedor?',
                                    jóvenes: '🔍 Buscar proveedor...',
                                    adultos: 'Buscar proveedor por nombre, email o teléfono...'
                                })}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <select
                                value={perPage}
                                onChange={(e) => handlePerPageChange(Number(e.target.value))}
                                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
                            >
                                <option value={10}>10 por página</option>
                                <option value={25}>25 por página</option>
                                <option value={50}>50 por página</option>
                            </select>
                            
                            <Link
                                href="/proveedores/create"
                                className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${getModeClasses()}`}
                            >
                                {getTextByMode({
                                    niños: '➕ ¡Agregar!',
                                    jóvenes: '➕ Nuevo',
                                    adultos: '➕ Agregar'
                                })}
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Tabla de proveedores */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                    {proveedores.data.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="text-6xl mb-4">
                                {settings.ageMode === 'niños' ? '😔' : '🏭'}
                            </div>
                            <h3 className={`text-lg font-medium text-gray-900 dark:text-gray-100 mb-2 ${getModeClasses()}`}>
                                {search ? getTextByMode({
                                    niños: `¡No encontré proveedores con "${search}"!`,
                                    jóvenes: `No se encontraron proveedores para "${search}"`,
                                    adultos: `No se encontraron proveedores que coincidan con "${search}"`
                                }) : getTextByMode({
                                    niños: '¡No hay proveedores todavía!',
                                    jóvenes: 'No hay proveedores registrados',
                                    adultos: 'No se encontraron proveedores'
                                })}
                            </h3>
                            <p className={`text-gray-600 dark:text-gray-400 mb-4 ${getModeClasses()}`}>
                                {search ? getTextByMode({
                                    niños: '¡Intenta buscar algo diferente!',
                                    jóvenes: 'Intenta con otros términos de búsqueda',
                                    adultos: 'Intente con diferentes términos de búsqueda'
                                }) : getTextByMode({
                                    niños: '¡Agrega tu primer proveedor para empezar!',
                                    jóvenes: 'Comienza agregando tu primer proveedor',
                                    adultos: 'Comience agregando el primer proveedor al sistema'
                                })}
                            </p>
                            {!search && (
                                <Link
                                    href="/proveedores/create"
                                    className={`inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors ${getModeClasses()}`}
                                >
                                    ➕ {getTextByMode({
                                        niños: 'Agregar Primer Proveedor',
                                        jóvenes: 'Agregar Proveedor',
                                        adultos: 'Agregar Proveedor'
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
                                                niños: '🏭 Proveedor',
                                                jóvenes: '🏭 Proveedor',
                                                adultos: 'Proveedor'
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
                                                niños: '📧 Email',
                                                jóvenes: '📧 Email',
                                                adultos: 'Correo Electrónico'
                                            })}
                                        </th>
                                        <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${getModeClasses()}`}>
                                            {getTextByMode({
                                                niños: '📍 Dirección',
                                                jóvenes: '📍 Dirección',
                                                adultos: 'Dirección'
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
                                    {proveedores.data.map((proveedor) => (
                                        <tr key={proveedor.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className={`px-6 py-4 whitespace-nowrap ${getModeClasses()}`}>
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white font-medium">
                                                            {proveedor.nombre.charAt(0).toUpperCase()}
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                            {proveedor.nombre}
                                                        </div>
                                                        {proveedor.direccion && (
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                📍 {proveedor.direccion}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                                {proveedor.telefono || getTextByMode({
                                                    niños: '❌ Sin número',
                                                    jóvenes: '❌ No registrado',
                                                    adultos: 'No registrado'
                                                })}
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                                {proveedor.email || getTextByMode({
                                                    niños: '❌ Sin email',
                                                    jóvenes: '❌ No registrado',
                                                    adultos: 'No registrado'
                                                })}
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 ${getModeClasses()}`}>
                                                {proveedor.direccion || getTextByMode({
                                                    niños: '❓ Sin dirección',
                                                    jóvenes: '❓ No especificada',
                                                    adultos: 'No especificada'
                                                })}
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${getModeClasses()}`}>
                                                <div className="flex justify-end space-x-2">
                                                    <Link
                                                        href={`/proveedores/${proveedor.id}`}
                                                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                                        title={getTextByMode({
                                                            niños: 'Ver proveedor',
                                                            jóvenes: 'Ver proveedor',
                                                            adultos: 'Ver detalles'
                                                        })}
                                                    >
                                                        {settings.ageMode === 'niños' ? '👀' : '👁️'}
                                                    </Link>
                                                    <Link
                                                        href={`/proveedores/${proveedor.id}/edit`}
                                                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 ml-3"
                                                        title={getTextByMode({
                                                            niños: 'Editar proveedor',
                                                            jóvenes: 'Editar proveedor',
                                                            adultos: 'Editar información'
                                                        })}
                                                    >
                                                        {settings.ageMode === 'niños' ? '✏️' : '📝'}
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDeleteClick(proveedor)}
                                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 ml-3"
                                                        title={getTextByMode({
                                                            niños: 'Eliminar proveedor',
                                                            jóvenes: 'Eliminar proveedor',
                                                            adultos: 'Eliminar proveedor'
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
                {proveedores.data.length > 0 && proveedores.links && proveedores.meta && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                        <div className="flex justify-between items-center">
                            <div className={`text-sm text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: `Mostrando ${proveedores.meta?.from || 0} a ${proveedores.meta?.to || 0} de ${proveedores.meta?.total || 0} proveedores`,
                                    jóvenes: `Mostrando ${proveedores.meta?.from || 0} a ${proveedores.meta?.to || 0} de ${proveedores.meta?.total || 0} proveedores`,
                                    adultos: `Mostrando ${proveedores.meta?.from || 0} a ${proveedores.meta?.to || 0} de ${proveedores.meta?.total || 0} proveedores`
                                })}
                            </div>
                            <div className="flex space-x-1">
                                {proveedores.links.map((link, index) => (
                                    link.url ? (
                                        <Link
                                            key={index}
                                            href={link.url}
                                            data={{ search, per_page: perPage }}
                                            className={`px-3 py-2 text-sm rounded-md transition-colors ${
                                                link.active 
                                                    ? 'bg-green-600 text-white' 
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
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Confirm Dialog */}
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title={getTextByMode({
                    niños: '¿Eliminar proveedor?',
                    jóvenes: '¿Eliminar proveedor?',
                    adultos: 'Confirmar eliminación'
                })}
                message={
                    confirmDialog.proveedor
                        ? getTextByMode({
                            niños: `¿Estás seguro de que quieres eliminar a ${confirmDialog.proveedor.nombre}? ¡No podrás recuperarlo después!`,
                            jóvenes: `¿Eliminar a ${confirmDialog.proveedor.nombre}? Esta acción no se puede deshacer.`,
                            adultos: `¿Está seguro de que desea eliminar el proveedor "${confirmDialog.proveedor.nombre}"? Esta acción no se puede deshacer.`
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