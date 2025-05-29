import { useAppMode } from '@/contexts/AppModeContext';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { FormPage, FormSection, FormButtons } from '@/components/Form';

export default function ProveedorCreate() {
    const { settings } = useAppMode();

    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        telefono: '',
        email: '',
        direccion: '',
        tipo: '',
        razon_social: '',
        nit: '',
        representante_legal: '',
        apellido: '',
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

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/proveedores');
    };

    // Mostrar u ocultar campos según el tipo de proveedor
    const isTipoEmpresa = data.tipo === 'empresa';
    const isTipoPersona = data.tipo === 'persona';

    return (
        <DashboardLayout
            title={getTextByMode({
                niños: '➕ ¡Crear Proveedor Nuevo!',
                jóvenes: '➕ Crear Proveedor',
                adultos: 'Crear Nuevo Proveedor',
            })}
        >
            <Head title="Crear Proveedor" />

            <FormPage
                title={getTextByMode({
                    niños: '🎉 ¡Crear Proveedor Súper Genial!',
                    jóvenes: '✨ Crear Nuevo Proveedor',
                    adultos: 'Crear Nuevo Proveedor',
                })}
                description={getTextByMode({
                    niños: '¡Completa todos los campos para crear un proveedor increíble!',
                    jóvenes: 'Completa la información para crear el nuevo proveedor',
                    adultos: 'Complete la información requerida para crear el nuevo proveedor',
                })}
                backHref="/proveedores"
                backText={getTextByMode({
                    niños: '¡Volver a la lista!',
                    jóvenes: 'Volver a proveedores',
                    adultos: 'Volver a proveedores',
                })}
            >
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
                                    <label htmlFor="tipo" className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${getModeClasses()}`}>
                                        {getTextByMode({
                                            niños: '🏷️ ¿Qué tipo de proveedor es? *',
                                            jóvenes: '🏷️ Tipo de proveedor *',
                                            adultos: 'Tipo de proveedor *'
                                        })}
                                    </label>
                                    <select
                                        id="tipo"
                                        value={data.tipo}
                                        onChange={(e) => setData('tipo', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
                                        required
                                    >
                                        <option value="">
                                            {getTextByMode({
                                                niños: 'Selecciona un tipo...',
                                                jóvenes: 'Selecciona el tipo',
                                                adultos: 'Seleccione un tipo'
                                            })}
                                        </option>
                                        <option value="empresa">
                                            {getTextByMode({
                                                niños: '🏢 Empresa o Negocio',
                                                jóvenes: '🏢 Empresa',
                                                adultos: 'Empresa'
                                            })}
                                        </option>
                                        <option value="persona">
                                            {getTextByMode({
                                                niños: '👤 Persona',
                                                jóvenes: '👤 Persona Natural',
                                                adultos: 'Persona Natural'
                                            })}
                                        </option>
                                    </select>
                                    {errors.tipo && (
                                        <p className="text-red-500 text-xs mt-1">{errors.tipo}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="nombre" className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${getModeClasses()}`}>
                                        {getTextByMode({
                                            niños: isTipoPersona ? '👤 Nombre *' : '🏭 Nombre de la empresa *',
                                            jóvenes: isTipoPersona ? '👤 Nombre *' : '🏭 Nombre de la empresa *',
                                            adultos: isTipoPersona ? 'Nombre *' : 'Nombre de la empresa *'
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

                                {isTipoPersona && (
                                    <div>
                                        <label htmlFor="apellido" className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${getModeClasses()}`}>
                                            {getTextByMode({
                                                niños: '👨‍👩‍👧‍👦 Apellidos *',
                                                jóvenes: '👨‍👩‍👧‍👦 Apellidos *',
                                                adultos: 'Apellidos *'
                                            })}
                                        </label>
                                        <input
                                            id="apellido"
                                            type="text"
                                            value={data.apellido}
                                            onChange={(e) => setData('apellido', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
                                            required
                                        />
                                        {errors.apellido && (
                                            <p className="text-red-500 text-xs mt-1">{errors.apellido}</p>
                                        )}
                                    </div>
                                )}

                                <div>
                                    <label htmlFor="email" className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${getModeClasses()}`}>
                                        {getTextByMode({
                                            niños: '📧 Email',
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
                                            niños: '📞 Teléfono',
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
                                {isTipoEmpresa && (
                                    <>
                                        <div>
                                            <label htmlFor="razon_social" className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${getModeClasses()}`}>
                                                {getTextByMode({
                                                    niños: '📝 Razón Social',
                                                    jóvenes: '📝 Razón Social',
                                                    adultos: 'Razón Social'
                                                })}
                                            </label>
                                            <input
                                                id="razon_social"
                                                type="text"
                                                value={data.razon_social}
                                                onChange={(e) => setData('razon_social', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
                                            />
                                            {errors.razon_social && (
                                                <p className="text-red-500 text-xs mt-1">{errors.razon_social}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="nit" className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${getModeClasses()}`}>
                                                {getTextByMode({
                                                    niños: '🔢 NIT',
                                                    jóvenes: '🔢 NIT',
                                                    adultos: 'NIT/Identificación Fiscal'
                                                })}
                                            </label>
                                            <input
                                                id="nit"
                                                type="text"
                                                value={data.nit}
                                                onChange={(e) => setData('nit', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
                                            />
                                            {errors.nit && (
                                                <p className="text-red-500 text-xs mt-1">{errors.nit}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="representante_legal" className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${getModeClasses()}`}>
                                                {getTextByMode({
                                                    niños: '👨‍💼 Representante Legal',
                                                    jóvenes: '👨‍💼 Representante Legal',
                                                    adultos: 'Representante Legal'
                                                })}
                                            </label>
                                            <input
                                                id="representante_legal"
                                                type="text"
                                                value={data.representante_legal}
                                                onChange={(e) => setData('representante_legal', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
                                            />
                                            {errors.representante_legal && (
                                                <p className="text-red-500 text-xs mt-1">{errors.representante_legal}</p>
                                            )}
                                        </div>
                                    </>
                                )}

                                <div>
                                    <label htmlFor="direccion" className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${getModeClasses()}`}>
                                        {getTextByMode({
                                            niños: '📍 Dirección',
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
                                            jóvenes: 'Dirección completa...',
                                            adultos: 'Dirección completa'
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
                            niños: '💾 ¡Crear Proveedor!',
                            jóvenes: '💾 Crear Proveedor',
                            adultos: 'Crear Proveedor',
                        })}
                        cancelHref="/proveedores"
                        cancelLabel={getTextByMode({
                            niños: '❌ Cancelar',
                            jóvenes: 'Cancelar',
                            adultos: 'Cancelar',
                        })}
                    />
                </form>
            </FormPage>
        </DashboardLayout>
    );
} 