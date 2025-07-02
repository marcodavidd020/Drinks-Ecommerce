import { FormButtons, FormPage, InputField, SelectField } from '@/components/Form';
import { useAppModeText } from '@/hooks/useAppModeText';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Role {
    id: number;
    name: string;
    description?: string;
}

interface CreateUserProps {
    roles: Role[];
}

export default function CreateUser({ roles }: CreateUserProps) {
    const { getTextByMode, getModeClasses } = useAppModeText();
    
    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        email: '',
        password: '',
        password_confirmation: '',
        celular: '',
        genero: '',
        role: '',
        estado: 'activo',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/users');
    };

    return (
        <DashboardLayout
            title={getTextByMode({
                niños: '➕ ¡Crear Usuario Nuevo!',
                jóvenes: '➕ Crear Usuario',
                adultos: 'Crear Nuevo Usuario',
            })}
        >
            <Head title="Crear Usuario" />

            <FormPage
                title={getTextByMode({
                    niños: '🎉 ¡Crear Usuario Súper Genial!',
                    jóvenes: '✨ Crear Nuevo Usuario',
                    adultos: 'Crear Nuevo Usuario',
                })}
                description={getTextByMode({
                    niños: '¡Completa todos los campos para crear un usuario increíble!',
                    jóvenes: 'Completa la información para crear el nuevo usuario',
                    adultos: 'Complete la información requerida para crear el nuevo usuario',
                })}
                backHref="/users"
                backText={getTextByMode({
                    niños: '¡Volver a la lista!',
                    jóvenes: 'Volver a usuarios',
                    adultos: 'Volver a usuarios',
                })}
            >
                <form onSubmit={submit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                        <div className={`grid gap-6 ${getModeClasses()}`}>
                            <div className="grid gap-4">
                                <div className="space-y-4">
                                    <InputField
                                        label={getTextByMode({
                                            niños: '✏️ Nombre Completo',
                                            jóvenes: '👤 Nombre',
                                            adultos: 'Nombre Completo',
                                        })}
                                        type="text"
                                        value={data.nombre}
                                        onChange={(e) => setData('nombre', e.target.value)}
                                        placeholder={getTextByMode({
                                            niños: 'Escribe el nombre completo',
                                            jóvenes: 'Nombre del usuario',
                                            adultos: 'Ingrese el nombre completo del usuario',
                                        })}
                                        error={errors.nombre}
                                        required
                                    />

                                    <InputField
                                        label={getTextByMode({
                                            niños: '📧 Email',
                                            jóvenes: '📧 Correo Electrónico',
                                            adultos: 'Correo Electrónico',
                                        })}
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder={getTextByMode({
                                            niños: 'usuario@ejemplo.com',
                                            jóvenes: 'correo@ejemplo.com',
                                            adultos: 'usuario@dominio.com',
                                        })}
                                        error={errors.email}
                                        required
                                    />

                                    <InputField
                                        label={getTextByMode({
                                            niños: '🔒 Contraseña',
                                            jóvenes: '🔒 Contraseña',
                                            adultos: 'Contraseña',
                                        })}
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder={getTextByMode({
                                            niños: 'Una contraseña segura',
                                            jóvenes: 'Contraseña segura',
                                            adultos: 'Ingrese una contraseña segura',
                                        })}
                                        error={errors.password}
                                        required
                                    />

                                    <InputField
                                        label={getTextByMode({
                                            niños: '🔒 Confirmar Contraseña',
                                            jóvenes: '🔒 Confirmar Contraseña',
                                            adultos: 'Confirmar Contraseña',
                                        })}
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder={getTextByMode({
                                            niños: 'Escribe la misma contraseña',
                                            jóvenes: 'Repite la contraseña',
                                            adultos: 'Confirme la contraseña',
                                        })}
                                        error={errors.password_confirmation}
                                        required
                                    />

                                    <InputField
                                        label={getTextByMode({
                                            niños: '📱 Celular',
                                            jóvenes: '📱 Número de Teléfono',
                                            adultos: 'Número de Celular',
                                        })}
                                        type="text"
                                        value={data.celular}
                                        onChange={(e) => setData('celular', e.target.value)}
                                        placeholder={getTextByMode({
                                            niños: '+591 70123456',
                                            jóvenes: '+591 70123456',
                                            adultos: '+591 70123456',
                                        })}
                                        error={errors.celular}
                                    />

                                    <SelectField
                                        label={getTextByMode({
                                            niños: '👩‍❤️‍👨 Género',
                                            jóvenes: '👤 Género',
                                            adultos: 'Género',
                                        })}
                                        value={data.genero}
                                        onChange={(e) => setData('genero', e.target.value)}
                                        placeholder={getTextByMode({
                                            niños: 'Selecciona una opción',
                                            jóvenes: 'Selecciona género',
                                            adultos: 'Seleccione género',
                                        })}
                                        options={[
                                            { value: 'masculino', label: getTextByMode({
                                                niños: '👨 Masculino',
                                                jóvenes: 'Masculino',
                                                adultos: 'Masculino',
                                            })},
                                            { value: 'femenino', label: getTextByMode({
                                                niños: '👩 Femenino',
                                                jóvenes: 'Femenino',
                                                adultos: 'Femenino',
                                            })},
                                            { value: 'otro', label: getTextByMode({
                                                niños: '🤷 No quiero decir',
                                                jóvenes: 'Prefiero no especificar',
                                                adultos: 'Prefiero no especificar',
                                            })}
                                        ]}
                                        error={errors.genero}
                                    />

                                    <SelectField
                                        label={getTextByMode({
                                            niños: '👑 Rol del Usuario',
                                            jóvenes: '👑 Rol',
                                            adultos: 'Rol del Usuario',
                                        })}
                                        value={data.role}
                                        onChange={(e) => setData('role', e.target.value)}
                                        placeholder={getTextByMode({
                                            niños: '¿Qué permisos tendrá?',
                                            jóvenes: 'Selecciona un rol',
                                            adultos: 'Seleccione el rol del usuario',
                                        })}
                                        options={roles.map(role => ({
                                            value: role.name,
                                            label: getTextByMode({
                                                niños: `${getRoleIcon(role.name)} ${getRoleLabel(role.name)}`,
                                                jóvenes: `${getRoleIcon(role.name)} ${getRoleLabel(role.name)}`,
                                                adultos: getRoleLabel(role.name),
                                            })
                                        }))}
                                        error={errors.role}
                                        required
                                    />

                                    <SelectField
                                        label={getTextByMode({
                                            niños: '✅ Estado',
                                            jóvenes: '✅ Estado del Usuario',
                                            adultos: 'Estado del Usuario',
                                        })}
                                        value={data.estado}
                                        onChange={(e) => setData('estado', e.target.value)}
                                        placeholder={getTextByMode({
                                            niños: '¿Está activo o inactivo?',
                                            jóvenes: 'Selecciona el estado',
                                            adultos: 'Seleccione el estado del usuario',
                                        })}
                                        options={[
                                            { value: 'activo', label: getTextByMode({
                                                niños: '✅ Activo',
                                                jóvenes: '✅ Activo',
                                                adultos: 'Activo',
                                            })},
                                            { value: 'inactivo', label: getTextByMode({
                                                niños: '❌ Inactivo',
                                                jóvenes: '❌ Inactivo',
                                                adultos: 'Inactivo',
                                            })}
                                        ]}
                                        error={errors.estado}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <FormButtons
                        showCancel
                        cancelText={getTextByMode({
                            niños: '❌ Cancelar',
                            jóvenes: 'Cancelar',
                            adultos: 'Cancelar',
                        })}
                        submitText={getTextByMode({
                            niños: '💾 ¡Guardar Usuario!',
                            jóvenes: 'Crear Usuario',
                            adultos: 'Crear Usuario',
                        })}
                    />
                </form>
            </FormPage>
        </DashboardLayout>
    );
}

// Función helper para obtener etiquetas de roles
function getRoleLabel(roleName: string): string {
    const labels: Record<string, string> = {
        'admin': 'Administrador',
        'cliente': 'Cliente',
        'empleado': 'Empleado',
        'organizador': 'Organizador',
        'vendedor': 'Vendedor',
        'almacenista': 'Almacenista',
    };
    return labels[roleName] || roleName;
}

// Función helper para obtener iconos de roles
function getRoleIcon(roleName: string): string {
    const icons: Record<string, string> = {
        'admin': '🛡️',
        'cliente': '👤',
        'empleado': '👷',
        'organizador': '🎯',
        'vendedor': '💼',
        'almacenista': '📦',
    };
    return icons[roleName] || '👤';
}
