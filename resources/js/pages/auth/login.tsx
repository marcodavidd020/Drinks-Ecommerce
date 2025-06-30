import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, ShoppingBag, Users, TrendingUp } from 'lucide-react';
import { FormEventHandler } from 'react';
import { useAppModeText } from '@/hooks/useAppModeText';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { getTextByMode } = useAppModeText();
    
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const title = getTextByMode({
        niños: '🎪 ¡Bienvenido de vuelta!',
        jóvenes: '🔥 Accede a tu cuenta',
        adultos: 'Iniciar Sesión'
    });

    const description = getTextByMode({
        niños: '¡Vamos a explorar productos geniales juntos! 🌟',
        jóvenes: 'Accede para descubrir las mejores ofertas y productos',
        adultos: 'Ingresa tu email y contraseña para acceder a tu cuenta'
    });

    return (
        <AuthLayout title={title} description={description}>
            <Head title={getTextByMode({
                niños: 'Entrar',
                jóvenes: 'Login',
                adultos: 'Iniciar Sesión'
            })} />

            {/* Status de éxito */}
            {status && (
                <div className="mb-6 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-green-800 dark:text-green-200 text-adaptive">{status}</span>
                    </div>
                </div>
            )}

            {/* Beneficios rápidos */}
            <div className="mb-6 grid grid-cols-3 gap-4">
                <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <ShoppingBag className="h-6 w-6 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                    <p className="text-xs font-medium text-blue-800 dark:text-blue-200 text-adaptive">
                        {getTextByMode({
                            niños: '🛒 Comprar',
                            jóvenes: 'Shopping',
                            adultos: 'Compras'
                        })}
                    </p>
                </div>
                <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-600 dark:text-green-400" />
                    <p className="text-xs font-medium text-green-800 dark:text-green-200 text-adaptive">
                        {getTextByMode({
                            niños: '💸 Ofertas',
                            jóvenes: 'Ofertas',
                            adultos: 'Promociones'
                        })}
                    </p>
                </div>
                <div className="text-center p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                    <Users className="h-6 w-6 mx-auto mb-2 text-purple-600 dark:text-purple-400" />
                    <p className="text-xs font-medium text-purple-800 dark:text-purple-200 text-adaptive">
                        {getTextByMode({
                            niños: '👥 Amigos',
                            jóvenes: 'Social',
                            adultos: 'Comunidad'
                        })}
                    </p>
                </div>
            </div>

            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-adaptive">
                            {getTextByMode({
                                niños: '📧 Tu email',
                                jóvenes: 'Email',
                                adultos: 'Correo Electrónico'
                            })}
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder={getTextByMode({
                                niños: 'tuemailgenial@gmail.com',
                                jóvenes: 'tu.email@ejemplo.com',
                                adultos: 'correo@ejemplo.com'
                            })}
                            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-adaptive text-adaptive border-adaptive"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password" className="text-adaptive">
                                {getTextByMode({
                                    niños: '🔐 Tu contraseña secreta',
                                    jóvenes: 'Contraseña',
                                    adultos: 'Contraseña'
                                })}
                            </Label>
                            {canResetPassword && (
                                <TextLink 
                                    href={route('password.request')} 
                                    className="ml-auto text-sm link-adaptive transition-colors" 
                                    tabIndex={5}
                                >
                                    {getTextByMode({
                                        niños: '😅 ¿La olvidaste?',
                                        jóvenes: '¿Olvidaste tu contraseña?',
                                        adultos: '¿Olvidaste tu contraseña?'
                                    })}
                                </TextLink>
                            )}
                        </div>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder={getTextByMode({
                                niños: 'Tu contraseña súper secreta',
                                jóvenes: 'Tu contraseña',
                                adultos: 'Ingresa tu contraseña'
                            })}
                            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-adaptive text-adaptive border-adaptive"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center space-x-3">
                        <Checkbox
                            id="remember"
                            name="remember"
                            checked={data.remember}
                            onClick={() => setData('remember', !data.remember)}
                            tabIndex={3}
                        />
                        <Label htmlFor="remember" className="text-sm text-adaptive">
                            {getTextByMode({
                                niños: '🧠 ¡Recuérdame!',
                                jóvenes: 'Recordarme',
                                adultos: 'Mantener sesión iniciada'
                            })}
                        </Label>
                    </div>

                    <Button 
                        type="submit" 
                        className="mt-4 w-full h-12 text-lg font-semibold transition-all duration-200 hover:scale-[1.02] btn-adaptive"
                        tabIndex={4} 
                        disabled={processing}
                    >
                        {processing && <LoaderCircle className="h-5 w-5 animate-spin mr-2" />}
                        {processing ? (
                            getTextByMode({
                                niños: '🔄 Entrando...',
                                jóvenes: 'Accediendo...',
                                adultos: 'Iniciando sesión...'
                            })
                        ) : (
                            getTextByMode({
                                niños: '🚀 ¡Entrar!',
                                jóvenes: '🔥 Acceder',
                                adultos: 'Iniciar Sesión'
                            })
                        )}
                    </Button>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-adaptive" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-adaptive px-2 text-adaptive-secondary">
                            {getTextByMode({
                                niños: '¿Primera vez aquí?',
                                jóvenes: '¿Nuevo usuario?',
                                adultos: 'o'
                            })}
                        </span>
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-sm text-adaptive-secondary mb-3">
                        {getTextByMode({
                            niños: '¿Aún no tienes una cuenta? ¡Créala ahora! 🎉',
                            jóvenes: '¿No tienes cuenta? ¡Únete ahora!',
                            adultos: '¿No tienes una cuenta?'
                        })}
                    </p>
                    <TextLink 
                        href={route('register')} 
                        tabIndex={6}
                        className="inline-flex items-center justify-center w-full px-4 py-3 btn-adaptive-secondary rounded-md shadow-sm text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
                    >
                        {getTextByMode({
                            niños: '🌟 ¡Crear mi cuenta!',
                            jóvenes: '✨ Registrarse',
                            adultos: 'Crear Cuenta Nueva'
                        })}
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
