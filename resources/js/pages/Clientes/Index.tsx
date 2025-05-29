import { Head, router } from '@inertiajs/react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useAppMode } from '@/contexts/AppModeContext';
import ConfirmDialog from '@/components/ConfirmDialog';
import { DataTable, PageHeader, SearchFilters, Pagination } from '@/components/DataTable';
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

    // Configuración de filtros
    const searchFilters = [
        {
            type: 'search' as const,
            placeholder: getTextByMode({
                niños: '🔍 ¿Buscas algún amigo?',
                jóvenes: '🔍 Buscar cliente...',
                adultos: 'Buscar cliente por nombre, email o documento...'
            }),
            value: search,
            onChange: setSearch,
            colSpan: 2
        },
        {
            type: 'per_page' as const,
            value: perPage,
            onChange: handlePerPageChange
        }
    ];

    // Configuración de columnas
    const columns = [
        {
            key: 'user',
            label: getTextByMode({
                niños: '😊 Amigo',
                jóvenes: '👤 Cliente', 
                adultos: 'Cliente'
            }),
            render: (user: any, cliente: Cliente) => (
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                            {user.nombre.charAt(0).toUpperCase()}
                        </div>
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {user.nombre}
                        </div>
                        {cliente.nit && (
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                {settings.ageMode === 'niños' ? '🆔' : 'ID'}: {cliente.nit}
                            </div>
                        )}
                    </div>
                </div>
            )
        },
        {
            key: 'email',
            label: getTextByMode({
                niños: '📧 Email',
                jóvenes: '📧 Email',
                adultos: 'Correo Electrónico'
            }),
            render: (email: string, cliente: Cliente) => cliente.user.email,
            className: 'text-sm text-gray-900 dark:text-gray-100'
        },
        {
            key: 'telefono',
            label: getTextByMode({
                niños: '📞 Teléfono',
                jóvenes: '📞 Teléfono', 
                adultos: 'Teléfono'
            }),
            render: (telefono: string, cliente: Cliente) => (
                cliente.user.celular || cliente.telefono || 
                getTextByMode({
                    niños: '❌ Sin número',
                    jóvenes: '❌ No registrado',
                    adultos: 'No registrado'
                })
            ),
            className: 'text-sm text-gray-900 dark:text-gray-100'
        },
        {
            key: 'created_at',
            label: getTextByMode({
                niños: '📅 Registro',
                jóvenes: '📅 Registrado',
                adultos: 'Fecha de Registro'
            }),
            render: (created_at: string) => new Date(created_at).toLocaleDateString('es-CO'),
            className: 'text-sm text-gray-500 dark:text-gray-400'
        }
    ];

    // Configuración de acciones
    const actions = [
        {
            type: 'view' as const,
            href: '/clientes/:id',
            icon: settings.ageMode === 'niños' ? '👀' : '👁️',
            title: getTextByMode({
                niños: 'Ver amigo',
                jóvenes: 'Ver cliente',
                adultos: 'Ver detalles'
            }),
            className: 'text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300'
        },
        {
            type: 'edit' as const,
            href: '/clientes/:id/edit',
            icon: settings.ageMode === 'niños' ? '✏️' : '📝',
            title: getTextByMode({
                niños: 'Editar amigo',
                jóvenes: 'Editar cliente',
                adultos: 'Editar información'
            }),
            className: 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'
        },
        {
            type: 'delete' as const,
            onClick: handleDeleteClick,
            icon: '🗑️',
            title: getTextByMode({
                niños: 'Eliminar amigo',
                jóvenes: 'Eliminar cliente',
                adultos: 'Eliminar cliente'
            }),
            className: 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300'
        }
    ];

    // Estado vacío
    const emptyState = {
        icon: settings.ageMode === 'niños' ? '😔' : '📋',
        title: search ? getTextByMode({
            niños: `¡No encontré amigos con "${search}"!`,
            jóvenes: `No se encontraron clientes para "${search}"`,
            adultos: `No se encontraron clientes que coincidan con "${search}"`
        }) : getTextByMode({
            niños: '¡No hay amigos clientes todavía!',
            jóvenes: 'No hay clientes registrados',
            adultos: 'No se encontraron clientes'
        }),
        description: search ? getTextByMode({
            niños: '¡Intenta buscar algo diferente!',
            jóvenes: 'Intenta con otros términos de búsqueda',
            adultos: 'Intente con diferentes términos de búsqueda'
        }) : getTextByMode({
            niños: '¡Agrega tu primer amigo cliente para empezar!',
            jóvenes: 'Comienza agregando tu primer cliente',
            adultos: 'Comience agregando el primer cliente al sistema'
        }),
        showAddButton: !search,
        addButtonText: `➕ ${getTextByMode({
            niños: 'Agregar Primer Amigo',
            jóvenes: 'Agregar Cliente',
            adultos: 'Agregar Cliente'
        })}`,
        addButtonHref: '/clientes/create'
    };

    return (
        <DashboardLayout title={getTextByMode({
            niños: '👨‍💼 ¡Mis Amigos Clientes!',
            jóvenes: '👨‍💼 Clientes',
            adultos: 'Gestión de Clientes'
        })}>
            <Head title="Clientes" />
            
            <div className={`space-y-6 ${getModeClasses()}`}>
                <PageHeader
                    title=""
                    description={getTextByMode({
                        niños: '¡Aquí puedes ver a todos tus amigos clientes!',
                        jóvenes: 'Administra la información de tus clientes',
                        adultos: 'Administre la información de todos los clientes registrados'
                    })}
                    buttonText={getTextByMode({
                        niños: '➕ ¡Agregar Amigo!',
                        jóvenes: '➕ Nuevo Cliente',
                        adultos: '➕ Agregar Cliente'
                    })}
                    buttonHref="/clientes/create"
                    buttonColor="blue"
                />

                <SearchFilters filters={searchFilters} />

                <DataTable
                    data={clientes.data}
                    columns={columns}
                    actions={actions}
                    emptyState={emptyState}
                    getItemKey={(cliente) => cliente.id}
                />

                {clientes.data.length > 0 && clientes.links && clientes.meta && (
                    <Pagination
                        links={clientes.links}
                        meta={clientes.meta}
                        searchParams={{ search, per_page: perPage }}
                        entityName={getTextByMode({
                            niños: 'amigos',
                            jóvenes: 'clientes',
                            adultos: 'clientes'
                        })}
                    />
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