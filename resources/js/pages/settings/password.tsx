import InputError from '@/components/input-error';
import DashboardLayout from '@/layouts/DashboardLayout';
import SettingsLayout from '@/layouts/settings/layout';
import { Transition } from '@headlessui/react';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';
import { useAppModeText } from '@/hooks/useAppModeText';

import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Password() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);
    const { getTextByMode } = useAppModeText();

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <DashboardLayout>
            <Head title={getTextByMode({
                niños: '🔐 Cambiar Contraseña',
                jóvenes: '🔐 Password Settings',
                adultos: 'Configuración de Contraseña'
            })} />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall 
                        title={getTextByMode({
                            niños: '🔐 Cambiar tu Contraseña Secreta',
                            jóvenes: '🔐 Actualizar Contraseña',
                            adultos: 'Actualizar Contraseña'
                        })} 
                        description={getTextByMode({
                            niños: '¡Asegúrate de usar una contraseña súper segura y difícil de adivinar!',
                            jóvenes: 'Asegúrate de usar una contraseña larga y segura',
                            adultos: 'Asegúrese de que su cuenta utilice una contraseña larga y aleatoria para mantenerse segura'
                        })} 
                    />

                    <form onSubmit={updatePassword} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="current_password">
                                {getTextByMode({
                                    niños: '🔑 Tu Contraseña Actual',
                                    jóvenes: '🔑 Contraseña Actual',
                                    adultos: 'Contraseña Actual'
                                })}
                            </Label>

                            <Input
                                id="current_password"
                                ref={currentPasswordInput}
                                value={data.current_password}
                                onChange={(e) => setData('current_password', e.target.value)}
                                type="password"
                                className="mt-1 block w-full"
                                autoComplete="current-password"
                                placeholder={getTextByMode({
                                    niños: 'Tu contraseña de ahora',
                                    jóvenes: 'Contraseña actual',
                                    adultos: 'Contraseña actual'
                                })}
                            />

                            <InputError message={errors.current_password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">
                                {getTextByMode({
                                    niños: '🆕 Nueva Contraseña Súper Segura',
                                    jóvenes: '🆕 Nueva Contraseña',
                                    adultos: 'Nueva Contraseña'
                                })}
                            </Label>

                            <Input
                                id="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                type="password"
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                placeholder={getTextByMode({
                                    niños: 'Inventa una contraseña nueva',
                                    jóvenes: 'Nueva contraseña',
                                    adultos: 'Nueva contraseña'
                                })}
                            />

                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">
                                {getTextByMode({
                                    niños: '🔄 Repite tu Nueva Contraseña',
                                    jóvenes: '🔄 Confirmar Contraseña',
                                    adultos: 'Confirmar Nueva Contraseña'
                                })}
                            </Label>

                            <Input
                                id="password_confirmation"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                type="password"
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                placeholder={getTextByMode({
                                    niños: 'Escribe la misma contraseña otra vez',
                                    jóvenes: 'Confirmar nueva contraseña',
                                    adultos: 'Confirmar nueva contraseña'
                                })}
                            />

                            <InputError message={errors.password_confirmation} />
                        </div>

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>
                                {getTextByMode({
                                    niños: '💾 ¡Guardar Nueva Contraseña!',
                                    jóvenes: '💾 Guardar Contraseña',
                                    adultos: 'Guardar Contraseña'
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
                                        niños: '✅ ¡Contraseña cambiada!',
                                        jóvenes: '✅ Contraseña actualizada',
                                        adultos: '✅ Contraseña guardada exitosamente'
                                    })}
                                </p>
                            </Transition>
                        </div>
                    </form>
                </div>
            </SettingsLayout>
        </DashboardLayout>
    );
}
