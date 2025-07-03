import { FormButtons, FormPage, InputField, SelectField } from '@/components/Form';
import { useAppModeText } from '@/hooks/useAppModeText';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface User {
    id: number;
    nombre: string;
    email: string;
    celular?: string;
    genero?: string;
    role?: string;
    estado: 'activo' | 'inactivo';
    roles?: Array<{ id: number; name: string }>;
}

interface Role {
    id: number;
    name: string;
    description?: string;
}

interface EditUserProps {
    user: User;
    roles: Role[];
    currentRole?: string;
}

export default function EditUser({ user, roles, currentRole }: EditUserProps) {
    const { getTextByMode, getModeClasses } = useAppModeText();
    const { data, setData, put, processing, errors } = useForm({
        nombre: user.nombre,
        email: user.email,
        password: '',
        password_confirmation: '',
        celular: user.celular || '',
        genero: user.genero || '',
        role: currentRole || user.roles?.[0]?.name || '',
        estado: user.estado,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        console.log('Iniciando actualización de usuario...');
        console.log('Datos a enviar:', data);
        console.log('URL:', `/users/${user.id}`);
        
        put(`/users/${user.id}`, {
            onStart: () => {
                console.log('Iniciando request...');
            },
            onProgress: (progress) => {
                console.log('Progreso:', progress);
            },
            onSuccess: (response) => {
                console.log('Usuario actualizado exitosamente');
                console.log('Respuesta:', response);
            },
            onError: (errors) => {
                console.log('Error al actualizar usuario:', errors);
            },
            onFinish: () => {
                console.log('Request terminado');
            }
        });
    };

    return (
        <DashboardLayout
            title={getTextByMode({
                niños: '✏️ ¡Editar Usuario!',
                jóvenes: '✏️ Editar Usuario',
                adultos: 'Editar Usuario',
            })}
        >
            <Head title={`Editar ${user.nombre}`} />

            <FormPage onSubmit={submit} processing={processing}>
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
                                        niños: '🔒 Nueva Contraseña',
                                        jóvenes: '🔒 Nueva Contraseña',
                                        adultos: 'Nueva Contraseña',
                                    })}
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder={getTextByMode({
                                        niños: 'Déjalo vacío si no quieres cambiar',
                                        jóvenes: 'Opcional - solo si quieres cambiarla',
                                        adultos: 'Opcional - Dejar vacío para mantener la actual',
                                    })}
                                    error={errors.password}
                                />

                                <InputField
                                    label={getTextByMode({
                                        niños: '🔒 Confirmar Nueva Contraseña',
                                        jóvenes: '🔒 Confirmar Nueva Contraseña',
                                        adultos: 'Confirmar Nueva Contraseña',
                                    })}
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder={getTextByMode({
                                        niños: 'Repite la nueva contraseña',
                                        jóvenes: 'Confirma la nueva contraseña',
                                        adultos: 'Confirme la nueva contraseña',
                                    })}
                                    error={errors.password_confirmation}
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
                                        niños: '👑 Rol de Usuario',
                                        jóvenes: '👑 Rol del Usuario',
                                        adultos: 'Rol del Usuario',
                                    })}
                                    value={data.role}
                                    onChange={(e) => setData('role', e.target.value)}
                                    placeholder={getTextByMode({
                                        niños: '¿Qué puede hacer este usuario?',
                                        jóvenes: 'Selecciona un rol',
                                        adultos: 'Seleccione un rol',
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
                                        niños: '🚦 Estado del Usuario',
                                        jóvenes: '🚦 Estado',
                                        adultos: 'Estado',
                                    })}
                                    value={data.estado}
                                    onChange={(e) => setData('estado', e.target.value as 'activo' | 'inactivo')}
                                    placeholder={getTextByMode({
                                        niños: '¿Está activo o inactivo?',
                                        jóvenes: 'Selecciona el estado',
                                        adultos: 'Seleccione el estado del usuario',
                                    })}
                                    options={[
                                        { value: 'activo', label: getTextByMode({
                                            niños: '✅ Activo - Puede usar el sistema',
                                            jóvenes: '✅ Activo',
                                            adultos: 'Activo',
                                        })},
                                        { value: 'inactivo', label: getTextByMode({
                                            niños: '❌ Inactivo - No puede usar el sistema',
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

                    <FormButtons
                        showCancel
                        cancelText={getTextByMode({
                            niños: '❌ Cancelar',
                            jóvenes: 'Cancelar',
                            adultos: 'Cancelar',
                        })}
                        submitText={getTextByMode({
                            niños: '💾 ¡Guardar Cambios!',
                            jóvenes: 'Actualizar Usuario',
                            adultos: 'Actualizar Usuario',
                        })}
                    />
                </div>
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
