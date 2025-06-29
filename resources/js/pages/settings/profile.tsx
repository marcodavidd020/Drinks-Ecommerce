import { type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { useAppModeText } from '@/hooks/useAppModeText';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DashboardLayout from '@/layouts/DashboardLayout';
import SettingsLayout from '@/layouts/settings/layout';

type ProfileForm = {
    name: string;
    email: string;
}

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;
    const { getTextByMode } = useAppModeText();

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<ProfileForm>>({
        name: auth.user.nombre,
        email: auth.user.email,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile.update'), {
            preserveScroll: true,
        });
    };

    return (
        <DashboardLayout>
            <Head title={getTextByMode({
                niños: '👤 Mi Perfil',
                jóvenes: '👤 Profile Settings',
                adultos: 'Configuración de Perfil'
            })} />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall 
                        title={getTextByMode({
                            niños: '👤 Mi Información Personal',
                            jóvenes: '👤 Información de Perfil',
                            adultos: 'Información del Perfil'
                        })} 
                        description={getTextByMode({
                            niños: 'Cambia tu nombre y correo electrónico aquí',
                            jóvenes: 'Actualiza tu nombre y dirección de email',
                            adultos: 'Actualice su nombre y dirección de correo electrónico'
                        })} 
                    />

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">
                                {getTextByMode({
                                    niños: '📝 Tu Nombre',
                                    jóvenes: '📝 Nombre',
                                    adultos: 'Nombre Completo'
                                })}
                            </Label>

                            <Input
                                id="name"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                autoComplete="name"
                                placeholder={getTextByMode({
                                    niños: '¿Cómo te llamas?',
                                    jóvenes: 'Tu nombre completo',
                                    adultos: 'Nombre completo'
                                })}
                            />

                            <InputError className="mt-2" message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">
                                {getTextByMode({
                                    niños: '📧 Tu Email',
                                    jóvenes: '📧 Correo Electrónico',
                                    adultos: 'Dirección de Correo Electrónico'
                                })}
                            </Label>

                            <Input
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoComplete="username"
                                placeholder={getTextByMode({
                                    niños: 'tuemail@ejemplo.com',
                                    jóvenes: 'tu@email.com',
                                    adultos: 'su@email.com'
                                })}
                            />

                            <InputError className="mt-2" message={errors.email} />
                        </div>

                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                            <div>
                                <p className="text-muted-foreground -mt-4 text-sm">
                                    {getTextByMode({
                                        niños: '📧 Tu email no está verificado. ',
                                        jóvenes: '📧 Tu dirección de email no está verificada. ',
                                        adultos: 'Su dirección de correo electrónico no está verificada. '
                                    })}
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                    >
                                        {getTextByMode({
                                            niños: '¡Haz clic aquí para verificarlo!',
                                            jóvenes: 'Click aquí para reenviar verificación',
                                            adultos: 'Haga clic aquí para reenviar el email de verificación'
                                        })}
                                    </Link>
                                </p>

                                {status === 'verification-link-sent' && (
                                    <div className="mt-2 text-sm font-medium text-green-600">
                                        {getTextByMode({
                                            niños: '¡Enviado! Revisa tu email 📧',
                                            jóvenes: 'Email de verificación enviado',
                                            adultos: 'Se ha enviado un nuevo enlace de verificación a su correo electrónico'
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>
                                {getTextByMode({
                                    niños: '💾 ¡Guardar!',
                                    jóvenes: '💾 Guardar',
                                    adultos: 'Guardar Cambios'
                                })}
                            </Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-green-600">
                                    {getTextByMode({
                                        niños: '✅ ¡Guardado!',
                                        jóvenes: '✅ Guardado',
                                        adultos: '✅ Guardado exitosamente'
                                    })}
                                </p>
                            </Transition>
                        </div>
                    </form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </DashboardLayout>
    );
}
