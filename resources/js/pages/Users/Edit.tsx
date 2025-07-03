import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { InputField } from '../../components/Form/InputField';
import { SelectField } from '../../components/Form/SelectField';
import { FormButtons } from '../../components/Form';

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
    const { data, setData, put, processing, errors } = useForm({
        nombre: user.nombre || '',
        email: user.email || '',
        password: '',
        password_confirmation: '',
        celular: user.celular || '',
        genero: user.genero || '',
        role: user.roles?.[0]?.name || currentRole || '',
        estado: user.estado || 'activo',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        console.log('Form submitted!', data);
        put(`/users/${user.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                console.log('Update successful!');
            },
            onError: (errors) => {
                console.log('Update errors:', errors);
            }
        });
    };

    return (
        <DashboardLayout title="Editar Usuario">
            <Head title={`Editar ${user.nombre}`} />

            <div className="max-w-2xl mx-auto">
                <form onSubmit={submit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    <div className="space-y-6">
                        <InputField
                            label="Nombre Completo"
                            type="text"
                            value={data.nombre}
                            onChange={(e) => setData('nombre', e.target.value)}
                            error={errors.nombre}
                            required
                        />

                        <InputField
                            label="Correo Electrónico"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            error={errors.email}
                            required
                        />

                        <InputField
                            label="Nueva Contraseña"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            error={errors.password}
                            placeholder="Dejar vacío para mantener la actual"
                        />

                        <InputField
                            label="Confirmar Nueva Contraseña"
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            error={errors.password_confirmation}
                            placeholder="Confirmar nueva contraseña"
                        />

                        <InputField
                            label="Número de Celular"
                            type="text"
                            value={data.celular}
                            onChange={(e) => setData('celular', e.target.value)}
                            error={errors.celular}
                            placeholder="+591 70123456"
                        />

                        <SelectField
                            label="Género"
                            value={data.genero}
                            onChange={(e) => setData('genero', e.target.value)}
                            options={[
                                { value: '', label: 'Seleccionar...' },
                                { value: 'masculino', label: 'Masculino' },
                                { value: 'femenino', label: 'Femenino' },
                                { value: 'otro', label: 'Prefiero no especificar' }
                            ]}
                            error={errors.genero}
                        />

                        <SelectField
                            label="Rol del Usuario"
                            value={data.role}
                            onChange={(e) => setData('role', e.target.value)}
                            options={roles.map(role => ({
                                value: role.name,
                                label: role.name
                            }))}
                            error={errors.role}
                            required
                        />

                        <SelectField
                            label="Estado"
                            value={data.estado}
                            onChange={(e) => setData('estado', e.target.value as 'activo' | 'inactivo')}
                            options={[
                                { value: 'activo', label: 'Activo' },
                                { value: 'inactivo', label: 'Inactivo' }
                            ]}
                            error={errors.estado}
                            required
                        />
                    </div>

                    <FormButtons 
                        processing={processing}
                        showCancel={true}
                        cancelText="Cancelar"
                        submitText="Actualizar Usuario"
                    />
                </form>
            </div>
        </DashboardLayout>
    );
}
