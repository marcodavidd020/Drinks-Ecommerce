import { Head, Link } from '@inertiajs/react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useAppMode } from '@/contexts/AppModeContext';
import { ShowHeader, InfoCard } from '@/components/Show';

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

    // Configuración de campos para InfoCard
    const infoBasicaFields = [
        {
            label: getTextByMode({
                niños: '🏭 Nombre',
                jóvenes: '🏭 Nombre',
                adultos: 'Nombre',
            }),
            value: (
                <div className="flex items-center space-x-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-lg font-bold text-white">
                        {getInitials(proveedor.nombre)}
                    </div>
                    <span className="font-medium">{proveedor.nombre}</span>
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
            value: proveedor.email || getTextByMode({
                niños: '❌ Sin email',
                jóvenes: 'No registrado',
                adultos: 'No registrado',
            })
        },
        {
            label: getTextByMode({
                niños: '📞 Teléfono',
                jóvenes: '📞 Teléfono',
                adultos: 'Número de Teléfono',
            }),
            value: proveedor.telefono || getTextByMode({
                niños: '❌ Sin teléfono',
                jóvenes: 'No registrado',
                adultos: 'No registrado',
            })
        },
        {
            label: getTextByMode({
                niños: '🏠 Dirección',
                jóvenes: '🏠 Dirección',
                adultos: 'Dirección',
            }),
            value: proveedor.direccion || getTextByMode({
                niños: '❌ Sin dirección',
                jóvenes: 'No registrada',
                adultos: 'No registrada',
            }),
            span: 2 as const
        }
    ];

    // Campos para empresas (si es empresa)
    const empresaFields = proveedor.tipo === 'empresa' || proveedor.razon_social || proveedor.nit ? [
        {
            label: getTextByMode({
                niños: '🏢 Tipo',
                jóvenes: '🏢 Tipo',
                adultos: 'Tipo de Proveedor',
            }),
            value: proveedor.tipo || 'Empresa'
        },
        {
            label: getTextByMode({
                niños: '📝 Razón Social',
                jóvenes: '📝 Razón Social',
                adultos: 'Razón Social',
            }),
            value: proveedor.razon_social || getTextByMode({
                niños: '❌ Sin razón social',
                jóvenes: 'No registrada',
                adultos: 'No registrada',
            })
        },
        {
            label: getTextByMode({
                niños: '🔢 NIT',
                jóvenes: '🔢 NIT',
                adultos: 'NIT/Identificación Fiscal',
            }),
            value: proveedor.nit || getTextByMode({
                niños: '❌ Sin NIT',
                jóvenes: 'No registrado',
                adultos: 'No registrado',
            })
        },
        {
            label: getTextByMode({
                niños: '👨‍💼 Representante Legal',
                jóvenes: '👨‍💼 Representante Legal',
                adultos: 'Representante Legal',
            }),
            value: proveedor.representante_legal || getTextByMode({
                niños: '❌ Sin representante',
                jóvenes: 'No registrado',
                adultos: 'No registrado',
            })
        }
    ] : [];

    // Campos para personas (si es persona)
    const personaFields = proveedor.tipo === 'persona' || proveedor.apellido || proveedor.nombre_completo ? [
        {
            label: getTextByMode({
                niños: '🧑 Tipo',
                jóvenes: '🧑 Tipo',
                adultos: 'Tipo de Proveedor',
            }),
            value: proveedor.tipo || 'Persona'
        },
        {
            label: getTextByMode({
                niños: '👤 Nombre Completo',
                jóvenes: '👤 Nombre Completo',
                adultos: 'Nombre Completo',
            }),
            value: proveedor.nombre_completo || `${proveedor.nombre} ${proveedor.apellido || ''}`
        },
        {
            label: getTextByMode({
                niños: '👨‍👩‍👧‍👦 Apellidos',
                jóvenes: '👨‍👩‍👧‍👦 Apellidos',
                adultos: 'Apellidos',
            }),
            value: proveedor.apellido || getTextByMode({
                niños: '❌ Sin apellidos',
                jóvenes: 'No registrados',
                adultos: 'No registrados',
            })
        }
    ] : [];

    // Campos de fechas
    const fechasFields = [
        {
            label: getTextByMode({
                niños: '📅 Fecha de Registro',
                jóvenes: '📅 Registrado',
                adultos: 'Fecha de Registro',
            }),
            value: formatDate(proveedor.created_at)
        },
        {
            label: getTextByMode({
                niños: '🔄 Última Actualización',
                jóvenes: '🔄 Actualizado',
                adultos: 'Última Actualización',
            }),
            value: formatDate(proveedor.updated_at)
        }
    ];

    return (
        <DashboardLayout title={getTextByMode({
            niños: '👀 Ver Proveedor Genial',
            jóvenes: '👀 Ver Proveedor',
            adultos: 'Detalles del Proveedor'
        })}>
            <Head title={`Proveedor: ${proveedor.nombre}`} />
            
            <div className={`space-y-6 ${getModeClasses()}`}>
                <ShowHeader
                    title={getTextByMode({
                        niños: `🏭 Información de ${proveedor.nombre}`,
                        jóvenes: `Detalles de ${proveedor.nombre}`,
                        adultos: `Información del Proveedor`
                    })}
                    description={getTextByMode({
                        niños: 'Aquí puedes ver toda la información de tu proveedor genial',
                        jóvenes: 'Información completa del proveedor',
                        adultos: 'Información detallada del proveedor en el sistema'
                    })}
                    editHref={`/proveedores/${proveedor.id}/edit`}
                    backHref="/proveedores"
                    editText={getTextByMode({
                        niños: '✏️ Editar',
                        jóvenes: 'Editar',
                        adultos: 'Editar'
                    })}
                    backText={getTextByMode({
                        niños: '⬅️ Volver',
                        jóvenes: 'Volver',
                        adultos: 'Volver'
                    })}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Información principal */}
                    <InfoCard
                        title={getTextByMode({
                            niños: '🏭 Información Principal',
                            jóvenes: '🏭 Información Principal',
                            adultos: 'Información Principal'
                        })}
                        fields={infoBasicaFields}
                        columns={2}
                    />

                    {/* Fechas */}
                    <InfoCard
                        title={getTextByMode({
                            niños: '📅 Fechas',
                            jóvenes: '📅 Fechas',
                            adultos: 'Información de Fechas'
                        })}
                        fields={fechasFields}
                        columns={2}
                    />
                </div>

                {/* Información adicional según tipo */}
                {empresaFields.length > 0 && (
                    <InfoCard
                        title={getTextByMode({
                            niños: '🏢 Datos de Empresa',
                            jóvenes: '🏢 Datos de Empresa',
                            adultos: 'Información de Empresa'
                        })}
                        fields={empresaFields}
                        columns={2}
                    />
                )}

                {personaFields.length > 0 && (
                    <InfoCard
                        title={getTextByMode({
                            niños: '👤 Datos Personales',
                            jóvenes: '👤 Datos Personales',
                            adultos: 'Información Personal'
                        })}
                        fields={personaFields}
                        columns={2}
                    />
                )}
            </div>
        </DashboardLayout>
    );
} 