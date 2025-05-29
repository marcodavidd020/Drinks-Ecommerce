import { Head, useForm } from '@inertiajs/react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useAppMode } from '@/contexts/AppModeContext';
import { FormEvent } from 'react';
import { FormSection, FormButtons } from '@/components/Form';
import { Link } from '@inertiajs/react';

interface Proveedor {
    id: number;
    nombre: string;
    telefono?: string;
    email?: string;
    direccion?: string;
    tipo?: string;
    // Campos adicionales para empresas
    razon_social?: string;
    nit?: string;
    representante_legal?: string;
    // Campos adicionales para personas
    apellido?: string;
    nombre_completo?: string;
}

interface ProveedorEditProps {
    proveedor: Proveedor;
}

export default function ProveedorEdit({ proveedor }: ProveedorEditProps) {
    const { settings } = useAppMode();
    
    const { data, setData, put, processing, errors } = useForm({
        nombre: proveedor.nombre,
        telefono: proveedor.telefono || '',
        email: proveedor.email || '',
        direccion: proveedor.direccion || '',
        tipo: proveedor.tipo || '',
    });

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

    const submit = (e: FormEvent) => {
        e.preventDefault();
        put(`/proveedores/${proveedor.id}`);
    };

    return (
        <DashboardLayout title={getTextByMode({
            niños: '✏️ Editar Proveedor Genial',
            jóvenes: '✏️ Editar Proveedor',
            adultos: 'Editar Proveedor'
        })}>
            <Head title="Editar Proveedor" />
            
            <div className={`space-y-6 ${getModeClasses()}`}>
                <div className="mb-6">
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/proveedores"
                            className={`font-medium text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 ${getModeClasses()}`}
                        >
                            ←{' '}
                            {getTextByMode({
                                niños: '¡Volver a la lista!',
                                jóvenes: 'Volver a proveedores',
                                adultos: 'Volver a proveedores',
                            })}
                        </Link>
                    </div>
                    <h1 className={`text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2 ${getModeClasses()}`}>
                        {getTextByMode({
                            niños: '✏️ Editar información del proveedor',
                            jóvenes: '✏️ Editar Proveedor',
                            adultos: 'Editar Proveedor'
                        })}
                    </h1>
                    <p className={`text-gray-600 dark:text-gray-400 mt-2 ${getModeClasses()}`}>
                        {getTextByMode({
                            niños: 'Actualiza la información de tu proveedor genial',
                            jóvenes: 'Actualiza la información del proveedor',
                            adultos: 'Modifique la información del proveedor en el sistema'
                        })}
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <FormSection
                            title={getTextByMode({
                                niños: '📝 Información Principal',
                                jóvenes: '📝 Datos Principales',
                                adultos: 'Información Principal',
                            })}
                        >
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="nombre" className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${getModeClasses()}`}>
                                        {getTextByMode({
                                            niños: '🏭 Nombre del proveedor *',
                                            jóvenes: '🏭 Nombre de la empresa *',
                                            adultos: 'Nombre de la empresa *'
                                        })}
                                    </label>
                                    <input
                                        id="nombre"
                                        type="text"
                                        value={data.nombre}
                                        onChange={(e) => setData('nombre', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
                                        required
                                    />
                                    {errors.nombre && (
                                        <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="email" className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${getModeClasses()}`}>
                                        {getTextByMode({
                                            niños: '📧 Email del proveedor',
                                            jóvenes: '📧 Correo electrónico',
                                            adultos: 'Correo electrónico'
                                        })}
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="telefono" className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${getModeClasses()}`}>
                                        {getTextByMode({
                                            niños: '📞 Teléfono del proveedor',
                                            jóvenes: '📞 Número de teléfono',
                                            adultos: 'Número de teléfono'
                                        })}
                                    </label>
                                    <input
                                        id="telefono"
                                        type="tel"
                                        value={data.telefono}
                                        onChange={(e) => setData('telefono', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
                                    />
                                    {errors.telefono && (
                                        <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>
                                    )}
                                </div>
                            </div>
                        </FormSection>

                        <FormSection
                            title={getTextByMode({
                                niños: '🔍 Detalles Adicionales',
                                jóvenes: '🔍 Información Complementaria',
                                adultos: 'Información Complementaria',
                            })}
                        >
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="tipo" className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${getModeClasses()}`}>
                                        {getTextByMode({
                                            niños: '🏷️ ¿Qué tipo de proveedor es?',
                                            jóvenes: '🏷️ Tipo de proveedor',
                                            adultos: 'Tipo de proveedor'
                                        })}
                                    </label>
                                    <select
                                        id="tipo"
                                        value={data.tipo}
                                        onChange={(e) => setData('tipo', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
                                    >
                                        <option value="">Seleccionar tipo</option>
                                        <option value="Distribuidor">Distribuidor</option>
                                        <option value="Importador">Importador</option>
                                        <option value="Fabricante">Fabricante</option>
                                        <option value="Mayorista">Mayorista</option>
                                        <option value="Representante">Representante</option>
                                        <option value="Otro">Otro</option>
                                    </select>
                                    {errors.tipo && (
                                        <p className="text-red-500 text-xs mt-1">{errors.tipo}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="direccion" className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${getModeClasses()}`}>
                                        {getTextByMode({
                                            niños: '📍 Dirección del proveedor',
                                            jóvenes: '📍 Dirección',
                                            adultos: 'Dirección completa'
                                        })}
                                    </label>
                                    <textarea
                                        id="direccion"
                                        value={data.direccion}
                                        onChange={(e) => setData('direccion', e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
                                        placeholder={getTextByMode({
                                            niños: 'Escribe la dirección completa aquí...',
                                            jóvenes: 'Dirección completa de la empresa...',
                                            adultos: 'Dirección completa de la empresa'
                                        })}
                                    />
                                    {errors.direccion && (
                                        <p className="text-red-500 text-xs mt-1">{errors.direccion}</p>
                                    )}
                                </div>
                            </div>
                        </FormSection>
                    </div>

                    <FormButtons
                        isProcessing={processing}
                        submitLabel={getTextByMode({
                            niños: '💾 ¡Guardar Cambios!',
                            jóvenes: '💾 Guardar Cambios',
                            adultos: 'Guardar Cambios',
                        })}
                        cancelHref="/proveedores"
                        cancelLabel={getTextByMode({
                            niños: '❌ Cancelar',
                            jóvenes: 'Cancelar',
                            adultos: 'Cancelar',
                        })}
                    />
                </form>
            </div>
        </DashboardLayout>
    );
} 