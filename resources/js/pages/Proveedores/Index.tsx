import ConfirmDialog from '@/components/ConfirmDialog';
import { DataTable, PageHeader, Pagination, SearchFilters } from '@/components/DataTable';
import { useAppMode } from '@/contexts/AppModeContext';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

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
                router.get(
                    '/proveedores',
                    {
                        search,
                        per_page: perPage,
                    },
                    {
                        preserveState: true,
                        replace: true,
                    },
                );
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    const handlePerPageChange = (newPerPage: number) => {
        setPerPage(newPerPage);
        router.get(
            '/proveedores',
            {
                search,
                per_page: newPerPage,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
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

    // Configuración de filtros
    const searchFilters = [
        {
            type: 'search' as const,
            placeholder: getTextByMode({
                niños: '🔍 ¿Buscas algún proveedor?',
                jóvenes: '🔍 Buscar proveedor...',
                adultos: 'Buscar proveedor por nombre, email o teléfono...',
            }),
            value: search,
            onChange: setSearch,
            colSpan: 2,
        },
        {
            type: 'per_page' as const,
            value: perPage,
            onChange: handlePerPageChange,
        },
    ];

    // Configuración de columnas
    const columns = [
        {
            key: 'nombre',
            label: getTextByMode({
                niños: '🏭 Proveedor',
                jóvenes: '🏭 Proveedor',
                adultos: 'Proveedor',
            }),
            render: (nombre: string, proveedor: Proveedor) => (
                <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 font-medium text-white">
                            {nombre.charAt(0).toUpperCase()}
                        </div>
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{nombre}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            {settings.ageMode === 'niños' ? '🆔' : 'ID'}: #{proveedor.id}
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
            render: (email: string) =>
                email ||
                getTextByMode({
                    niños: '❌ Sin email',
                    jóvenes: '❌ No registrado',
                    adultos: 'No registrado',
                }),
            className: 'text-sm text-gray-900 dark:text-gray-100',
        },
        {
            key: 'telefono',
            label: getTextByMode({
                niños: '📞 Teléfono',
                jóvenes: '📞 Teléfono',
                adultos: 'Teléfono',
            }),
            render: (telefono: string) =>
                telefono ||
                getTextByMode({
                    niños: '❌ Sin número',
                    jóvenes: '❌ No registrado',
                    adultos: 'No registrado',
                }),
            className: 'text-sm text-gray-900 dark:text-gray-100',
        },
        {
            key: 'direccion',
            label: getTextByMode({
                niños: '🏠 Dirección',
                jóvenes: '🏠 Dirección',
                adultos: 'Dirección',
            }),
            render: (direccion: string) =>
                direccion ||
                getTextByMode({
                    niños: '❌ Sin dirección',
                    jóvenes: '❌ No registrada',
                    adultos: 'No registrada',
                }),
            className: 'text-sm text-gray-500 dark:text-gray-400',
        },
        {
            key: 'created_at',
            label: getTextByMode({
                niños: '📅 Registro',
                jóvenes: '📅 Registrado',
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
            href: '/proveedores/:id',
            icon: settings.ageMode === 'niños' ? '👀' : '👁️',
            title: getTextByMode({
                niños: 'Ver proveedor',
                jóvenes: 'Ver proveedor',
                adultos: 'Ver detalles',
            }),
            className: 'text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300',
        },
        {
            type: 'edit' as const,
            href: '/proveedores/:id/edit',
            icon: settings.ageMode === 'niños' ? '✏️' : '📝',
            title: getTextByMode({
                niños: 'Editar proveedor',
                jóvenes: 'Editar proveedor',
                adultos: 'Editar información',
            }),
            className: 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300',
        },
        {
            type: 'delete' as const,
            onClick: handleDeleteClick,
            icon: '🗑️',
            title: getTextByMode({
                niños: 'Eliminar proveedor',
                jóvenes: 'Eliminar proveedor',
                adultos: 'Eliminar proveedor',
            }),
            className: 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300',
        },
    ];

    // Estado vacío
    const emptyState = {
        icon: settings.ageMode === 'niños' ? '😔' : '🏭',
        title: search
            ? getTextByMode({
                  niños: `¡No encontré proveedores con "${search}"!`,
                  jóvenes: `No se encontraron proveedores para "${search}"`,
                  adultos: `No se encontraron proveedores que coincidan con "${search}"`,
              })
            : getTextByMode({
                  niños: '¡No hay proveedores todavía!',
                  jóvenes: 'No hay proveedores registrados',
                  adultos: 'No se encontraron proveedores',
              }),
        description: search
            ? getTextByMode({
                  niños: '¡Intenta buscar algo diferente!',
                  jóvenes: 'Intenta con otros términos de búsqueda',
                  adultos: 'Intente con diferentes términos de búsqueda',
              })
            : getTextByMode({
                  niños: '¡Agrega tu primer proveedor para empezar!',
                  jóvenes: 'Comienza agregando tu primer proveedor',
                  adultos: 'Comience agregando el primer proveedor al sistema',
              }),
        showAddButton: !search,
        addButtonText: `➕ ${getTextByMode({
            niños: 'Agregar Primer Proveedor',
            jóvenes: 'Agregar Proveedor',
            adultos: 'Agregar Proveedor',
        })}`,
        addButtonHref: '/proveedores/create',
    };

    return (
        <DashboardLayout
            title={getTextByMode({
                niños: '🏭 ¡Mis Amigos Proveedores!',
                jóvenes: '🏭 Proveedores',
                adultos: 'Gestión de Proveedores',
            })}
        >
            <Head title="Proveedores" />

            <div className={`space-y-6 ${getModeClasses()}`}>
                <PageHeader
                    title=""
                    description={getTextByMode({
                        niños: '¡Aquí puedes ver a todos tus amigos proveedores!',
                        jóvenes: 'Administra la información de tus proveedores',
                        adultos: 'Administre la información de todos los proveedores registrados',
                    })}
                    buttonText={getTextByMode({
                        niños: '➕ ¡Agregar Amigo!',
                        jóvenes: '➕ Nuevo Proveedor',
                        adultos: '➕ Agregar Proveedor',
                    })}
                    buttonHref="/proveedores/create"
                    buttonColor="green"
                />

                <SearchFilters filters={searchFilters} />

                <DataTable
                    data={proveedores.data}
                    columns={columns}
                    actions={actions}
                    emptyState={emptyState}
                    getItemKey={(proveedor) => proveedor.id}
                />

                {proveedores.data.length > 0 && proveedores.links && proveedores.meta && (
                    <Pagination
                        links={proveedores.links}
                        meta={proveedores.meta}
                        searchParams={{ search, per_page: perPage }}
                        entityName={getTextByMode({
                            niños: 'proveedores',
                            jóvenes: 'proveedores',
                            adultos: 'proveedores',
                        })}
                    />
                )}
            </div>

            {/* Confirm Dialog */}
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title={getTextByMode({
                    niños: '¿Eliminar proveedor?',
                    jóvenes: '¿Eliminar proveedor?',
                    adultos: 'Confirmar eliminación',
                })}
                message={
                    confirmDialog.proveedor
                        ? getTextByMode({
                              niños: `¿Estás seguro de que quieres eliminar a ${confirmDialog.proveedor.nombre}? ¡No podrás recuperarlo después!`,
                              jóvenes: `¿Eliminar a ${confirmDialog.proveedor.nombre}? Esta acción no se puede deshacer.`,
                              adultos: `¿Está seguro de que desea eliminar el proveedor "${confirmDialog.proveedor.nombre}"? Esta acción no se puede deshacer.`,
                          })
                        : ''
                }
                confirmText={getTextByMode({
                    niños: '🗑️ Sí, eliminar',
                    jóvenes: 'Eliminar',
                    adultos: 'Eliminar',
                })}
                cancelText={getTextByMode({
                    niños: 'No, cancelar',
                    jóvenes: 'Cancelar',
                    adultos: 'Cancelar',
                })}
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
                type="danger"
            />
        </DashboardLayout>
    );
}
