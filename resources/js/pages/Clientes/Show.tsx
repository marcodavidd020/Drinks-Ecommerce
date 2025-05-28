import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useAppMode } from '@/contexts/AppModeContext';

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
    telefono?: string;
    fecha_nacimiento?: string;
    genero?: string;
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
            day: 'numeric'
        });
    };

    return (
        <DashboardLayout title={getTextByMode({
            niños: '👀 Ver Amigo Cliente',
            jóvenes: '👀 Ver Cliente',
            adultos: 'Detalles del Cliente'
        })}>
            <Head title={`Cliente: ${cliente.user.nombre}`} />
            
            <div className={`space-y-6 ${getModeClasses()}`}>
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className={`text-3xl font-bold text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: `👀 Información de ${cliente.user.nombre}`,
                                jóvenes: `Detalles de ${cliente.user.nombre}`,
                                adultos: `Información del Cliente`
                            })}
                        </h1>
                        <p className={`text-gray-600 dark:text-gray-400 mt-2 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: 'Aquí puedes ver toda la información de tu amigo cliente',
                                jóvenes: 'Información completa del cliente',
                                adultos: 'Información detallada del cliente en el sistema'
                            })}
                        </p>
                    </div>
                    
                    <div className="flex space-x-3">
                        <Link
                            href={`/clientes/${cliente.id}/edit`}
                            className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${getModeClasses()}`}
                        >
                            <span>✏️</span>
                            <span>{getTextByMode({
                                niños: 'Editar',
                                jóvenes: 'Editar',
                                adultos: 'Editar'
                            })}</span>
                        </Link>
                        <Link
                            href="/clientes"
                            className={`bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${getModeClasses()}`}
                        >
                            <span>⬅️</span>
                            <span>{getTextByMode({
                                niños: 'Volver',
                                jóvenes: 'Volver',
                                adultos: 'Volver'
                            })}</span>
                        </Link>
                    </div>
                </div>

                {/* Información del cliente */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Información personal */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h2 className={`text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: '😊 Información Personal',
                                jóvenes: '👤 Información Personal',
                                adultos: 'Información Personal'
                            })}
                        </h2>
                        
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0 h-16 w-16">
                                    <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
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
                                            adultos: 'Cliente'
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium text-gray-500 dark:text-gray-400 ${getModeClasses()}`}>
                                        {getTextByMode({
                                            niños: '📧 Email',
                                            jóvenes: '📧 Email',
                                            adultos: 'Correo Electrónico'
                                        })}
                                    </label>
                                    <p className={`text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                        {cliente.user.email}
                                    </p>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium text-gray-500 dark:text-gray-400 ${getModeClasses()}`}>
                                        {getTextByMode({
                                            niños: '📱 Celular',
                                            jóvenes: '📱 Celular',
                                            adultos: 'Número Celular'
                                        })}
                                    </label>
                                    <p className={`text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                        {cliente.user.celular || getTextByMode({
                                            niños: '❌ Sin número',
                                            jóvenes: 'No registrado',
                                            adultos: 'No registrado'
                                        })}
                                    </p>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium text-gray-500 dark:text-gray-400 ${getModeClasses()}`}>
                                        {getTextByMode({
                                            niños: '🆔 Documento',
                                            jóvenes: '🆔 NIT/Documento',
                                            adultos: 'NIT/Documento'
                                        })}
                                    </label>
                                    <p className={`text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                        {cliente.nit || getTextByMode({
                                            niños: '❌ Sin documento',
                                            jóvenes: 'No registrado',
                                            adultos: 'No registrado'
                                        })}
                                    </p>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium text-gray-500 dark:text-gray-400 ${getModeClasses()}`}>
                                        {getTextByMode({
                                            niños: '📞 Teléfono',
                                            jóvenes: '📞 Teléfono',
                                            adultos: 'Teléfono Fijo'
                                        })}
                                    </label>
                                    <p className={`text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                        {cliente.telefono || getTextByMode({
                                            niños: '❌ Sin teléfono',
                                            jóvenes: 'No registrado',
                                            adultos: 'No registrado'
                                        })}
                                    </p>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium text-gray-500 dark:text-gray-400 ${getModeClasses()}`}>
                                        {getTextByMode({
                                            niños: '🎂 Cumpleaños',
                                            jóvenes: '🎂 Fecha de Nacimiento',
                                            adultos: 'Fecha de Nacimiento'
                                        })}
                                    </label>
                                    <p className={`text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                        {cliente.fecha_nacimiento ? 
                                            formatDate(cliente.fecha_nacimiento) : 
                                            getTextByMode({
                                                niños: '❌ Sin fecha',
                                                jóvenes: 'No registrada',
                                                adultos: 'No registrada'
                                            })
                                        }
                                    </p>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium text-gray-500 dark:text-gray-400 ${getModeClasses()}`}>
                                        {getTextByMode({
                                            niños: '👫 Género',
                                            jóvenes: '👫 Género',
                                            adultos: 'Género'
                                        })}
                                    </label>
                                    <p className={`text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                        {cliente.genero ? 
                                            cliente.genero.charAt(0).toUpperCase() + cliente.genero.slice(1).replace('_', ' ') : 
                                            getTextByMode({
                                                niños: '❌ Sin especificar',
                                                jóvenes: 'No especificado',
                                                adultos: 'No especificado'
                                            })
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Información del sistema */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h2 className={`text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: '⚙️ Información del Sistema',
                                jóvenes: '⚙️ Info del Sistema',
                                adultos: 'Información del Sistema'
                            })}
                        </h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium text-gray-500 dark:text-gray-400 ${getModeClasses()}`}>
                                    {getTextByMode({
                                        niños: '📅 Fecha de Registro',
                                        jóvenes: '📅 Registrado el',
                                        adultos: 'Fecha de Registro'
                                    })}
                                </label>
                                <p className={`text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                    {formatDate(cliente.created_at)}
                                </p>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium text-gray-500 dark:text-gray-400 ${getModeClasses()}`}>
                                    {getTextByMode({
                                        niños: '🔄 Última Actualización',
                                        jóvenes: '🔄 Actualizado el',
                                        adultos: 'Última Actualización'
                                    })}
                                </label>
                                <p className={`text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                    {formatDate(cliente.updated_at)}
                                </p>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium text-gray-500 dark:text-gray-400 ${getModeClasses()}`}>
                                    {getTextByMode({
                                        niños: '🆔 ID en el Sistema',
                                        jóvenes: '🆔 ID Cliente',
                                        adultos: 'ID del Cliente'
                                    })}
                                </label>
                                <p className={`text-gray-900 dark:text-gray-100 font-mono ${getModeClasses()}`}>
                                    #{cliente.id}
                                </p>
                            </div>
                        </div>

                        {/* Estadísticas básicas */}
                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <h3 className={`text-lg font-medium text-gray-900 dark:text-gray-100 mb-3 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '📊 Estadísticas del Amigo',
                                    jóvenes: '📊 Estadísticas',
                                    adultos: 'Estadísticas del Cliente'
                                })}
                            </h3>
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                                    <p className={`text-2xl font-bold text-blue-600 dark:text-blue-400 ${getModeClasses()}`}>0</p>
                                    <p className={`text-sm text-blue-600 dark:text-blue-400 ${getModeClasses()}`}>
                                        {getTextByMode({
                                            niños: 'Compras',
                                            jóvenes: 'Órdenes',
                                            adultos: 'Órdenes'
                                        })}
                                    </p>
                                </div>
                                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                                    <p className={`text-2xl font-bold text-green-600 dark:text-green-400 ${getModeClasses()}`}>$0</p>
                                    <p className={`text-sm text-green-600 dark:text-green-400 ${getModeClasses()}`}>
                                        {getTextByMode({
                                            niños: 'Gastado',
                                            jóvenes: 'Total',
                                            adultos: 'Total Gastado'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
} 