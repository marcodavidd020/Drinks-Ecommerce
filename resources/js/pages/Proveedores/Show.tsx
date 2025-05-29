import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useAppMode } from '@/contexts/AppModeContext';

interface Proveedor {
    id: number;
    nombre: string;
    telefono?: string;
    email?: string;
    direccion?: string;
    tipo?: string;
    created_at: string;
    updated_at: string;
    // Campos adicionales para empresas
    razon_social?: string;
    nit?: string;
    representante_legal?: string;
    // Campos adicionales para personas
    apellido?: string;
    nombre_completo?: string;
}

interface ProveedorShowProps {
    proveedor: Proveedor;
}

export default function ProveedorShow({ proveedor }: ProveedorShowProps) {
    const { settings } = useAppMode();

    // Validación para evitar errores si proveedor no está definido
    if (!proveedor) {
        return (
            <DashboardLayout title="Error">
                <Head title="Error - Proveedor no encontrado" />
                <div className="flex items-center justify-center min-h-96">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                            Proveedor no encontrado
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            El proveedor que estás buscando no existe o ha sido eliminado.
                        </p>
                        <Link
                            href="/proveedores"
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            Volver a Proveedores
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
            minute: '2-digit'
        });
    };

    // Función helper para obtener iniciales seguras
    const getInitials = (name?: string) => {
        if (!name) return '?';
        return name.charAt(0).toUpperCase();
    };

    return (
        <DashboardLayout title={getTextByMode({
            niños: '👀 Ver Proveedor Genial',
            jóvenes: '👀 Ver Proveedor',
            adultos: 'Detalles del Proveedor'
        })}>
            <Head title={`Proveedor: ${proveedor.nombre}`} />
            
            <div className={`space-y-6 ${getModeClasses()}`}>
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className={`text-3xl font-bold text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: `🏭 Información de ${proveedor.nombre}`,
                                jóvenes: `Detalles de ${proveedor.nombre}`,
                                adultos: `Información del Proveedor`
                            })}
                        </h1>
                        <p className={`text-gray-600 dark:text-gray-400 mt-2 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: 'Aquí puedes ver toda la información de tu proveedor genial',
                                jóvenes: 'Información completa del proveedor',
                                adultos: 'Información detallada del proveedor en el sistema'
                            })}
                        </p>
                    </div>
                    
                    <div className="flex space-x-3">
                        <Link
                            href={`/proveedores/${proveedor.id}/edit`}
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
                            href="/proveedores"
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

                {/* Información del proveedor */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Información principal */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h2 className={`text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: '🏭 Información Principal',
                                jóvenes: '🏭 Información Principal',
                                adultos: 'Información Principal'
                            })}
                        </h2>
                        
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0 h-16 w-16">
                                    <div className="h-16 w-16 rounded-full bg-green-500 flex items-center justify-center text-white text-2xl font-bold">
                                        {getInitials(proveedor.nombre)}
                                    </div>
                                </div>
                                <div>
                                    <h3 className={`text-lg font-medium text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                        {proveedor.nombre}
                                    </h3>
                                    <p className={`text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>
                                        {proveedor.tipo || getTextByMode({
                                            niños: '🏭 Mi proveedor genial',
                                            jóvenes: '🏭 Proveedor',
                                            adultos: 'Proveedor'
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
                                        {proveedor.email || getTextByMode({
                                            niños: '❌ Sin email',
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
                                            adultos: 'Número de Teléfono'
                                        })}
                                    </label>
                                    <p className={`text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                        {proveedor.telefono || getTextByMode({
                                            niños: '❌ Sin número',
                                            jóvenes: 'No registrado',
                                            adultos: 'No registrado'
                                        })}
                                    </p>
                                </div>

                                <div className="sm:col-span-2">
                                    <label className={`block text-sm font-medium text-gray-500 dark:text-gray-400 ${getModeClasses()}`}>
                                        {getTextByMode({
                                            niños: '📍 Dirección',
                                            jóvenes: '📍 Dirección',
                                            adultos: 'Dirección'
                                        })}
                                    </label>
                                    <p className={`text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                        {proveedor.direccion || getTextByMode({
                                            niños: '❌ Sin dirección',
                                            jóvenes: 'No especificada',
                                            adultos: 'No especificada'
                                        })}
                                    </p>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium text-gray-500 dark:text-gray-400 ${getModeClasses()}`}>
                                        {getTextByMode({
                                            niños: '🏷️ Tipo de Proveedor',
                                            jóvenes: '🏷️ Tipo',
                                            adultos: 'Tipo de Proveedor'
                                        })}
                                    </label>
                                    <p className={`text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                        {proveedor.tipo || getTextByMode({
                                            niños: '❓ Sin especificar',
                                            jóvenes: 'No especificado',
                                            adultos: 'No especificado'
                                        })}
                                    </p>
                                </div>

                                {/* Información específica para empresas */}
                                {proveedor.tipo === 'empresa' && (
                                    <>
                                        {proveedor.razon_social && (
                                            <div>
                                                <label className={`block text-sm font-medium text-gray-500 dark:text-gray-400 ${getModeClasses()}`}>
                                                    {getTextByMode({
                                                        niños: '🏢 Razón Social',
                                                        jóvenes: '🏢 Razón Social',
                                                        adultos: 'Razón Social'
                                                    })}
                                                </label>
                                                <p className={`text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                                    {proveedor.razon_social}
                                                </p>
                                            </div>
                                        )}
                                        
                                        {proveedor.nit && (
                                            <div>
                                                <label className={`block text-sm font-medium text-gray-500 dark:text-gray-400 ${getModeClasses()}`}>
                                                    {getTextByMode({
                                                        niños: '🆔 NIT',
                                                        jóvenes: '🆔 NIT',
                                                        adultos: 'NIT'
                                                    })}
                                                </label>
                                                <p className={`text-gray-900 dark:text-gray-100 font-mono ${getModeClasses()}`}>
                                                    {proveedor.nit}
                                                </p>
                                            </div>
                                        )}
                                        
                                        {proveedor.representante_legal && (
                                            <div className="sm:col-span-2">
                                                <label className={`block text-sm font-medium text-gray-500 dark:text-gray-400 ${getModeClasses()}`}>
                                                    {getTextByMode({
                                                        niños: '👤 Representante Legal',
                                                        jóvenes: '👤 Representante',
                                                        adultos: 'Representante Legal'
                                                    })}
                                                </label>
                                                <p className={`text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                                    {proveedor.representante_legal}
                                                </p>
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* Información específica para personas */}
                                {proveedor.tipo === 'persona' && proveedor.apellido && (
                                    <div>
                                        <label className={`block text-sm font-medium text-gray-500 dark:text-gray-400 ${getModeClasses()}`}>
                                            {getTextByMode({
                                                niños: '👤 Apellido',
                                                jóvenes: '👤 Apellido',
                                                adultos: 'Apellido'
                                            })}
                                        </label>
                                        <p className={`text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                            {proveedor.apellido}
                                        </p>
                                    </div>
                                )}
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
                                    {formatDate(proveedor.created_at)}
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
                                    {formatDate(proveedor.updated_at)}
                                </p>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium text-gray-500 dark:text-gray-400 ${getModeClasses()}`}>
                                    {getTextByMode({
                                        niños: '🆔 ID en el Sistema',
                                        jóvenes: '🆔 ID Proveedor',
                                        adultos: 'ID del Proveedor'
                                    })}
                                </label>
                                <p className={`text-gray-900 dark:text-gray-100 font-mono ${getModeClasses()}`}>
                                    #{proveedor.id}
                                </p>
                            </div>
                        </div>

                        {/* Estadísticas básicas */}
                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <h3 className={`text-lg font-medium text-gray-900 dark:text-gray-100 mb-3 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '📊 Estadísticas del Proveedor',
                                    jóvenes: '📊 Estadísticas',
                                    adultos: 'Estadísticas del Proveedor'
                                })}
                            </h3>
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                                    <p className={`text-2xl font-bold text-green-600 dark:text-green-400 ${getModeClasses()}`}>0</p>
                                    <p className={`text-sm text-green-600 dark:text-green-400 ${getModeClasses()}`}>
                                        {getTextByMode({
                                            niños: 'Productos',
                                            jóvenes: 'Productos',
                                            adultos: 'Productos'
                                        })}
                                    </p>
                                </div>
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                                    <p className={`text-2xl font-bold text-blue-600 dark:text-blue-400 ${getModeClasses()}`}>$0</p>
                                    <p className={`text-sm text-blue-600 dark:text-blue-400 ${getModeClasses()}`}>
                                        {getTextByMode({
                                            niños: 'Compras',
                                            jóvenes: 'Total Compras',
                                            adultos: 'Total Compras'
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