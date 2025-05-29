import { useAppMode } from '@/contexts/AppModeContext';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

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
}

interface ClienteEditProps {
    cliente: Cliente;
}

export default function ClienteEdit({ cliente }: ClienteEditProps) {
    const { settings } = useAppMode();

    const { data, setData, put, processing, errors } = useForm({
        nombre: cliente.user.nombre,
        email: cliente.user.email,
        celular: cliente.user.celular || '',
        nit: cliente.nit || '',
        telefono: cliente.telefono || '',
        fecha_nacimiento: cliente.fecha_nacimiento || '',
        genero: cliente.genero || '',
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
        put(`/clientes/${cliente.id}`);
    };

    return (
        <DashboardLayout
            title={getTextByMode({
                niños: '✏️ Editar Amigo Cliente',
                jóvenes: '✏️ Editar Cliente',
                adultos: 'Editar Cliente',
            })}
        >
            <Head title="Editar Cliente" />

            <div className={`space-y-6 ${getModeClasses()}`}>
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/clientes"
                            className={`font-medium text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 ${getModeClasses()}`}
                        >
                            ←{' '}
                            {getTextByMode({
                                niños: 'Volver a la lista',
                                jóvenes: 'Volver a la lista',
                                adultos: 'Volver a la lista',
                            })}
                        </Link>
                    </div>
                    <p className={`mt-2 text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>
                        {getTextByMode({
                            niños: 'Actualiza la información de tu amigo cliente',
                            jóvenes: 'Actualiza la información del cliente',
                            adultos: 'Modifique la información del cliente en el sistema',
                        })}
                    </p>
                </div>

                {/* Formulario */}
                <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Nombre */}
                            <div>
                                <label
                                    htmlFor="nombre"
                                    className={`mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 ${getModeClasses()}`}
                                >
                                    {getTextByMode({
                                        niños: '😊 Nombre del amigo',
                                        jóvenes: '👤 Nombre completo',
                                        adultos: 'Nombre completo',
                                    })}
                                </label>
                                <input
                                    id="nombre"
                                    type="text"
                                    value={data.nombre}
                                    onChange={(e) => setData('nombre', e.target.value)}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                    required
                                />
                                {errors.nombre && <p className="mt-1 text-xs text-red-500">{errors.nombre}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className={`mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 ${getModeClasses()}`}
                                >
                                    {getTextByMode({
                                        niños: '📧 Email del amigo',
                                        jóvenes: '📧 Correo electrónico',
                                        adultos: 'Correo electrónico',
                                    })}
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                    required
                                />
                                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                            </div>

                            {/* Celular */}
                            <div>
                                <label
                                    htmlFor="celular"
                                    className={`mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 ${getModeClasses()}`}
                                >
                                    {getTextByMode({
                                        niños: '📱 Celular del amigo',
                                        jóvenes: '📱 Número celular',
                                        adultos: 'Número celular',
                                    })}
                                </label>
                                <input
                                    id="celular"
                                    type="tel"
                                    value={data.celular}
                                    onChange={(e) => setData('celular', e.target.value)}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                />
                                {errors.celular && <p className="mt-1 text-xs text-red-500">{errors.celular}</p>}
                            </div>

                            {/* NIT */}
                            <div>
                                <label
                                    htmlFor="nit"
                                    className={`mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 ${getModeClasses()}`}
                                >
                                    {getTextByMode({
                                        niños: '🆔 Documento del amigo',
                                        jóvenes: '🆔 NIT/Documento',
                                        adultos: 'NIT/Documento de identidad',
                                    })}
                                </label>
                                <input
                                    id="nit"
                                    type="text"
                                    value={data.nit}
                                    onChange={(e) => setData('nit', e.target.value)}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                />
                                {errors.nit && <p className="mt-1 text-xs text-red-500">{errors.nit}</p>}
                            </div>

                            {/* Teléfono */}
                            <div>
                                <label
                                    htmlFor="telefono"
                                    className={`mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 ${getModeClasses()}`}
                                >
                                    {getTextByMode({
                                        niños: '📞 Teléfono fijo',
                                        jóvenes: '📞 Teléfono fijo',
                                        adultos: 'Teléfono fijo',
                                    })}
                                </label>
                                <input
                                    id="telefono"
                                    type="tel"
                                    value={data.telefono}
                                    onChange={(e) => setData('telefono', e.target.value)}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                />
                                {errors.telefono && <p className="mt-1 text-xs text-red-500">{errors.telefono}</p>}
                            </div>

                            {/* Fecha nacimiento */}
                            <div>
                                <label
                                    htmlFor="fecha_nacimiento"
                                    className={`mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 ${getModeClasses()}`}
                                >
                                    {getTextByMode({
                                        niños: '🎂 Cumpleaños',
                                        jóvenes: '🎂 Fecha de nacimiento',
                                        adultos: 'Fecha de nacimiento',
                                    })}
                                </label>
                                <input
                                    id="fecha_nacimiento"
                                    type="date"
                                    value={data.fecha_nacimiento}
                                    onChange={(e) => setData('fecha_nacimiento', e.target.value)}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                />
                                {errors.fecha_nacimiento && <p className="mt-1 text-xs text-red-500">{errors.fecha_nacimiento}</p>}
                            </div>

                            {/* Género */}
                            <div>
                                <label
                                    htmlFor="genero"
                                    className={`mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 ${getModeClasses()}`}
                                >
                                    {getTextByMode({
                                        niños: '👫 Género',
                                        jóvenes: '👫 Género',
                                        adultos: 'Género',
                                    })}
                                </label>
                                <select
                                    id="genero"
                                    value={data.genero}
                                    onChange={(e) => setData('genero', e.target.value)}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                >
                                    <option value="">Seleccionar género</option>
                                    <option value="masculino">Masculino</option>
                                    <option value="femenino">Femenino</option>
                                    <option value="otro">Otro</option>
                                    <option value="prefiero_no_decir">Prefiero no decir</option>
                                </select>
                                {errors.genero && <p className="mt-1 text-xs text-red-500">{errors.genero}</p>}
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex justify-end space-x-3">
                            <a
                                href="/clientes"
                                className={`rounded-md border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 ${getModeClasses()}`}
                            >
                                {getTextByMode({
                                    niños: '❌ Cancelar',
                                    jóvenes: 'Cancelar',
                                    adultos: 'Cancelar',
                                })}
                            </a>
                            <button
                                type="submit"
                                disabled={processing}
                                className={`rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400 ${getModeClasses()}`}
                            >
                                {processing
                                    ? getTextByMode({
                                          niños: '💾 Guardando...',
                                          jóvenes: 'Guardando...',
                                          adultos: 'Guardando...',
                                      })
                                    : getTextByMode({
                                          niños: '💾 Guardar Cambios',
                                          jóvenes: 'Guardar Cambios',
                                          adultos: 'Guardar Cambios',
                                      })}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}
