import { useAppMode } from '@/contexts/AppModeContext';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import { ShowHeader, InfoCard } from '@/components/Show';

interface User {
    id: number;
    nombre: string;
    email: string;
    celular?: string;
}

interface Cliente {
    id: number;
    user: User;
    nit?: string;
    created_at: string;
    updated_at: string;
}

interface ClienteShowProps {
    cliente: Cliente;
}

export default function ClienteShow({ cliente }: ClienteShowProps) {
    const { settings } = useAppMode();

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
        return new Date(dateString).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    // Información personal del cliente
    const personalFields = [
        {
            label: getTextByMode({
                niños: '📧 Email',
                jóvenes: '📧 Email',
                adultos: 'Correo Electrónico',
            }),
            value: cliente.user.email,
            icon: '📧'
        },
        {
            label: getTextByMode({
                niños: '📱 Celular',
                jóvenes: '📱 Celular',
                adultos: 'Número Celular',
            }),
            value: cliente.user.celular || getTextByMode({
                niños: '❌ Sin número',
                jóvenes: 'No registrado',
                adultos: 'No registrado',
            }),
            icon: '📱'
        },
        {
            label: getTextByMode({
                niños: '🆔 Documento',
                jóvenes: '🆔 NIT/Documento',
                adultos: 'NIT/Documento',
            }),
            value: cliente.nit || getTextByMode({
                niños: '❌ Sin documento',
                jóvenes: 'No registrado',
                adultos: 'No registrado',
            }),
            icon: '🆔'
        },
    ];

    // Información del sistema
    const systemFields = [
        {
            label: getTextByMode({
                niños: '📅 Fecha de Registro',
                jóvenes: '📅 Registrado el',
                adultos: 'Fecha de Registro',
            }),
            value: formatDate(cliente.created_at),
            icon: '📅'
        },
        {
            label: getTextByMode({
                niños: '🔄 Última Actualización',
                jóvenes: '🔄 Actualizado el',
                adultos: 'Última Actualización',
            }),
            value: formatDate(cliente.updated_at),
            icon: '🔄'
        },
        {
            label: getTextByMode({
                niños: '🆔 ID en el Sistema',
                jóvenes: '🆔 ID Cliente',
                adultos: 'ID del Cliente',
            }),
            value: `#${cliente.id}`,
            icon: '🆔'
        }
    ];

    return (
        <DashboardLayout
            title={getTextByMode({
                niños: '👀 Ver Amigo Cliente',
                jóvenes: '👀 Ver Cliente',
                adultos: 'Detalles del Cliente',
            })}
        >
            <Head title={`Cliente: ${cliente.user.nombre}`} />

            <div className={`space-y-6 ${getModeClasses()}`}>
                <ShowHeader
                    title={getTextByMode({
                        niños: `👀 Información de ${cliente.user.nombre}`,
                        jóvenes: `Detalles de ${cliente.user.nombre}`,
                        adultos: `Información del Cliente`,
                    })}
                    description={getTextByMode({
                        niños: 'Aquí puedes ver toda la información de tu amigo cliente',
                        jóvenes: 'Información completa del cliente',
                        adultos: 'Información detallada del cliente en el sistema',
                    })}
                    editHref={`/clientes/${cliente.id}/edit`}
                    backHref="/clientes"
                />

                {/* Información del cliente */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Avatar y nombre */}
                    <InfoCard
                        title={getTextByMode({
                            niños: '😊 Información Personal',
                            jóvenes: '👤 Información Personal',
                            adultos: 'Información Personal',
                        })}
                        fields={[
                            {
                                label: '',
                                value: (
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div className="h-16 w-16 flex-shrink-0">
                                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500 text-2xl font-bold text-white">
                                                {cliente.user.nombre.charAt(0).toUpperCase()}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className={`text-lg font-medium text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                                {cliente.user.nombre}
                                            </h3>
                                            <p className={`text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>
                                                {getTextByMode({
                                                    niños: '👨‍💼 Mi amigo cliente',
                                                    jóvenes: '👨‍💼 Cliente',
                                                    adultos: 'Cliente',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                ),
                                span: 2
                            },
                            ...personalFields
                        ]}
                        columns={2}
                    />

                    {/* Información del sistema */}
                    <InfoCard
                        title={getTextByMode({
                            niños: '⚙️ Información del Sistema',
                            jóvenes: '⚙️ Info del Sistema',
                            adultos: 'Información del Sistema',
                        })}
                        fields={[
                            ...systemFields,
                            {
                                label: getTextByMode({
                                    niños: '📊 Estadísticas del Amigo',
                                    jóvenes: '📊 Estadísticas',
                                    adultos: 'Estadísticas del Cliente',
                                }),
                                value: (
                                    <div className="grid grid-cols-2 gap-4 text-center mt-4">
                                        <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                                            <p className={`text-2xl font-bold text-blue-600 dark:text-blue-400 ${getModeClasses()}`}>0</p>
                                            <p className={`text-sm text-blue-600 dark:text-blue-400 ${getModeClasses()}`}>
                                                {getTextByMode({
                                                    niños: 'Compras',
                                                    jóvenes: 'Órdenes',
                                                    adultos: 'Órdenes',
                                                })}
                                            </p>
                                        </div>
                                        <div className="rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
                                            <p className={`text-2xl font-bold text-green-600 dark:text-green-400 ${getModeClasses()}`}>Bs 0</p>
                                            <p className={`text-sm text-green-600 dark:text-green-400 ${getModeClasses()}`}>
                                                {getTextByMode({
                                                    niños: 'Gastado',
                                                    jóvenes: 'Total',
                                                    adultos: 'Total Gastado',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                ),
                                span: 2
                            }
                        ]}
                        columns={1}
                    />
                </div>
            </div>
        </DashboardLayout>
    );
}
