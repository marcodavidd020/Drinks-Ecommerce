import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Droplets, Zap, Star } from 'lucide-react';
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
        niños: '🧃 ¡Bienvenido a BebiFresh!',
        jóvenes: '💧 Accede a BebiFresh',
        adultos: 'Iniciar Sesión en BebiFresh'
    });

    const description = getTextByMode({
        niños: '¡Vamos a explorar bebidas súper refrescantes juntos! 🌟',
        jóvenes: 'Accede para descubrir las mejores bebidas y ofertas',
        adultos: 'Ingresa tu email y contraseña para acceder a tu cuenta de BebiFresh'
    });

    return (
        <AuthLayout title={title} description={description}>
            <Head title={getTextByMode({
                niños: 'Entrar - BebiFresh',
                jóvenes: 'Login - BebiFresh',
                adultos: 'Iniciar Sesión - BebiFresh'
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

            {/* Beneficios de BebiFresh */}
            <div className="mb-6 grid grid-cols-3 gap-4">
                <div className="text-center p-3 rounded-lg bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800">
                    <Droplets className="h-6 w-6 mx-auto mb-2 text-cyan-600 dark:text-cyan-400" />
                    <p className="text-xs font-medium text-cyan-800 dark:text-cyan-200 text-adaptive">
                        {getTextByMode({
                            niños: '🧃 Bebidas',
                            jóvenes: 'Frescura',
                            adultos: 'Hidratación'
                        })}
                    </p>
                </div>
                <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <Zap className="h-6 w-6 mx-auto mb-2 text-green-600 dark:text-green-400" />
                    <p className="text-xs font-medium text-green-800 dark:text-green-200 text-adaptive">
                        {getTextByMode({
                            niños: '⚡ Energía',
                            jóvenes: 'Ofertas',
                            adultos: 'Promociones'
                        })}
                    </p>
                </div>
                <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <Star className="h-6 w-6 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                    <p className="text-xs font-medium text-blue-800 dark:text-blue-200 text-adaptive">
                        {getTextByMode({
                            niños: '⭐ Premium',
                            jóvenes: 'Calidad',
                            adultos: 'Experiencia'
                        })}
                    </p>
                </div>
            </div>

            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-adaptive">
                            {getTextByMode({
                                niños: '📧 Tu email de BebiFresh',
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
                            className="transition-all duration-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-adaptive text-adaptive border-adaptive"
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
                                    className="ml-auto text-sm text-cyan-600 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-200 transition-colors" 
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
                            className="transition-all duration-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-adaptive text-adaptive border-adaptive"
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
                                niños: '🧠 ¡Recuérdame en BebiFresh!',
                                jóvenes: 'Recordarme',
                                adultos: 'Mantener sesión iniciada'
                            })}
                        </Label>
                    </div>

                    <Button 
                        type="submit" 
                        className="mt-4 w-full h-12 text-lg font-semibold transition-all duration-200 hover:scale-[1.02] bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                        tabIndex={4} 
                        disabled={processing}
                    >
                        {processing && <LoaderCircle className="h-5 w-5 animate-spin mr-2" />}
                        {processing ? (
                            getTextByMode({
                                niños: '🔄 Entrando a BebiFresh...',
                                jóvenes: 'Accediendo...',
                                adultos: 'Iniciando sesión...'
                            })
                        ) : (
                            getTextByMode({
                                niños: '🧃 ¡Entrar a BebiFresh!',
                                jóvenes: '💧 Acceder',
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
                                niños: '¿Primera vez en BebiFresh?',
                                jóvenes: '¿Nuevo en BebiFresh?',
                                adultos: 'o'
                            })}
                        </span>
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-sm text-adaptive-secondary mb-3">
                        {getTextByMode({
                            niños: '¿Aún no tienes una cuenta en BebiFresh? ¡Créala ahora y disfruta bebidas increíbles! 🌿',
                            jóvenes: '¿No tienes cuenta? ¡Únete a BebiFresh ahora!',
                            adultos: '¿No tienes una cuenta en BebiFresh?'
                        })}
                    </p>
                    <TextLink 
                        href={route('register')} 
                        tabIndex={6}
                        className="inline-flex items-center justify-center w-full px-4 py-3 border border-cyan-200 dark:border-cyan-700 rounded-md shadow-sm text-sm font-medium text-cyan-700 dark:text-cyan-300 bg-white dark:bg-gray-800 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-all duration-200 hover:scale-[1.02]"
                    >
                        {getTextByMode({
                            niños: '🌟 ¡Unirme a BebiFresh!',
                            jóvenes: '✨ Registrarse en BebiFresh',
                            adultos: 'Crear Cuenta en BebiFresh'
                        })}
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
