import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, UserPlus, Shield, Gift, Star } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { useAppModeText } from '@/hooks/useAppModeText';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import AuthLayout from '@/layouts/auth-layout';

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    terms: boolean;
};

export default function Register() {
    const { getTextByMode } = useAppModeText();
    const [showPasswordTips, setShowPasswordTips] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        terms: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        if (!data.terms) {
            // Aquí podrías agregar validación de términos
            return;
        }
        
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const validatePassword = (password: string) => {
        const validations = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            number: /\d/.test(password),
        };
        
        return validations;
    };

    const passwordValidations = validatePassword(data.password);
    const passwordStrength = Object.values(passwordValidations).filter(Boolean).length;

    const title = getTextByMode({
        niños: '🎈 ¡Únete a la diversión!',
        jóvenes: '🚀 Crea tu cuenta',
        adultos: 'Crear Cuenta Nueva'
    });

    const description = getTextByMode({
        niños: '¡Crea tu cuenta y descubre un mundo de productos increíbles! 🌟',
        jóvenes: 'Únete para acceder a ofertas exclusivas y productos geniales',
        adultos: 'Completa el formulario para crear tu cuenta de cliente'
    });

    return (
        <AuthLayout title={title} description={description}>
            <Head title={getTextByMode({
                niños: 'Registrarse',
                jóvenes: 'Signup',
                adultos: 'Crear Cuenta'
            })} />

            {/* Beneficios de registrarse */}
            <div className="mb-6 grid grid-cols-2 gap-3">
                <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <Gift className="h-5 w-5 mx-auto mb-1 text-green-600 dark:text-green-400" />
                    <p className="text-xs font-medium text-green-800 dark:text-green-200 text-adaptive">
                        {getTextByMode({
                            niños: '🎁 Regalos',
                            jóvenes: 'Ofertas',
                            adultos: 'Promociones'
                        })}
                    </p>
                </div>
                <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <Star className="h-5 w-5 mx-auto mb-1 text-blue-600 dark:text-blue-400" />
                    <p className="text-xs font-medium text-blue-800 dark:text-blue-200 text-adaptive">
                        {getTextByMode({
                            niños: '⭐ Puntos',
                            jóvenes: 'Rewards',
                            adultos: 'Recompensas'
                        })}
                    </p>
                </div>
            </div>

            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="text-adaptive">
                            {getTextByMode({
                                niños: '👤 ¿Cómo te llamas?',
                                jóvenes: 'Tu nombre',
                                adultos: 'Nombre Completo'
                            })}
                        </Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder={getTextByMode({
                                niños: 'Tu nombre completo',
                                jóvenes: 'Ej: María García',
                                adultos: 'Ingresa tu nombre completo'
                            })}
                            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-adaptive text-adaptive border-adaptive"
                        />
                        <InputError message={errors.name} className="mt-1" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-adaptive">
                            {getTextByMode({
                                niños: '📧 Tu email favorito',
                                jóvenes: 'Email',
                                adultos: 'Correo Electrónico'
                            })}
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={2}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder={getTextByMode({
                                niños: 'tuemailgenial@gmail.com',
                                jóvenes: 'tu.email@ejemplo.com',
                                adultos: 'correo@ejemplo.com'
                            })}
                            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-adaptive text-adaptive border-adaptive"
                        />
                        <InputError message={errors.email} />
                        <p className="text-xs text-adaptive-muted">
                            {getTextByMode({
                                niños: 'Te enviaremos cosas geniales aquí 📬',
                                jóvenes: 'Para notificaciones y ofertas especiales',
                                adultos: 'Utilizaremos este email para comunicaciones importantes'
                            })}
                        </p>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password" className="text-adaptive">
                            {getTextByMode({
                                niños: '🔐 Crea una contraseña súper secreta',
                                jóvenes: 'Contraseña',
                                adultos: 'Contraseña'
                            })}
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={3}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            onFocus={() => setShowPasswordTips(true)}
                            disabled={processing}
                            placeholder={getTextByMode({
                                niños: 'Una contraseña súper fuerte',
                                jóvenes: 'Mínimo 8 caracteres',
                                adultos: 'Crea una contraseña segura'
                            })}
                            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-adaptive text-adaptive border-adaptive"
                        />
                        <InputError message={errors.password} />
                        
                        {/* Indicador de fuerza de contraseña */}
                        {showPasswordTips && data.password && (
                            <div className="mt-2 p-3 bg-adaptive-secondary rounded-lg border border-adaptive">
                                <div className="flex items-center space-x-2 mb-2">
                                    <Shield className="h-4 w-4 text-adaptive-secondary" />
                                    <span className="text-sm font-medium text-adaptive">
                                        {getTextByMode({
                                            niños: '🛡️ Fuerza de tu contraseña',
                                            jóvenes: 'Seguridad de contraseña',
                                            adultos: 'Fortaleza de la contraseña'
                                        })}
                                    </span>
                                </div>
                                <div className="grid grid-cols-4 gap-1 mb-2">
                                    {[1, 2, 3, 4].map((level) => (
                                        <div
                                            key={level}
                                            className={`h-2 rounded-full ${
                                                passwordStrength >= level
                                                    ? passwordStrength <= 2
                                                        ? 'bg-red-400'
                                                        : passwordStrength === 3
                                                        ? 'bg-yellow-400'
                                                        : 'bg-green-400'
                                                    : 'bg-gray-200 dark:bg-gray-600'
                                            }`}
                                        />
                                    ))}
                                </div>
                                <div className="space-y-1 text-xs">
                                    {Object.entries({
                                        length: getTextByMode({
                                            niños: '✅ Mínimo 8 caracteres',
                                            jóvenes: '8+ caracteres',
                                            adultos: 'Mínimo 8 caracteres'
                                        }),
                                        lowercase: getTextByMode({
                                            niños: '✅ Una letra pequeña (a-z)',
                                            jóvenes: 'Minúscula',
                                            adultos: 'Letra minúscula'
                                        }),
                                        uppercase: getTextByMode({
                                            niños: '✅ Una letra grande (A-Z)',
                                            jóvenes: 'Mayúscula',
                                            adultos: 'Letra mayúscula'
                                        }),
                                        number: getTextByMode({
                                            niños: '✅ Un número (0-9)',
                                            jóvenes: 'Número',
                                            adultos: 'Un número'
                                        }),
                                    }).map(([key, label]) => (
                                        <div
                                            key={key}
                                            className={`flex items-center space-x-2 text-adaptive ${
                                                passwordValidations[key as keyof typeof passwordValidations]
                                                    ? 'text-green-600 dark:text-green-400'
                                                    : 'text-adaptive-muted'
                                            }`}
                                        >
                                            <span>{passwordValidations[key as keyof typeof passwordValidations] ? '✓' : '○'}</span>
                                            <span>{label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation" className="text-adaptive">
                            {getTextByMode({
                                niños: '🔒 Repite tu contraseña secreta',
                                jóvenes: 'Confirmar contraseña',
                                adultos: 'Confirmar Contraseña'
                            })}
                        </Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={4}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder={getTextByMode({
                                niños: 'Escribe tu contraseña otra vez',
                                jóvenes: 'Repite tu contraseña',
                                adultos: 'Confirma tu contraseña'
                            })}
                            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-adaptive text-adaptive border-adaptive"
                        />
                        <InputError message={errors.password_confirmation} />
                        {data.password && data.password_confirmation && data.password !== data.password_confirmation && (
                            <p className="text-xs text-red-600 dark:text-red-400">
                                {getTextByMode({
                                    niños: '🤔 Las contraseñas no coinciden',
                                    jóvenes: 'Las contraseñas no coinciden',
                                    adultos: 'Las contraseñas no coinciden'
                                })}
                            </p>
                        )}
                        {data.password && data.password_confirmation && data.password === data.password_confirmation && (
                            <p className="text-xs text-green-600 dark:text-green-400">
                                {getTextByMode({
                                    niños: '🎉 ¡Perfecto! Las contraseñas coinciden',
                                    jóvenes: '✅ Contraseñas coinciden',
                                    adultos: '✓ Las contraseñas coinciden'
                                })}
                            </p>
                        )}
                    </div>

                    <div className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <Checkbox
                            id="terms"
                            name="terms"
                            checked={data.terms}
                            onClick={() => setData('terms', !data.terms)}
                            tabIndex={5}
                            className="mt-1"
                        />
                        <div className="space-y-1">
                            <Label htmlFor="terms" className="text-sm text-adaptive">
                                {getTextByMode({
                                    niños: '📜 Acepto las reglas del juego',
                                    jóvenes: 'Acepto términos y condiciones',
                                    adultos: 'Acepto los términos y condiciones'
                                })}
                            </Label>
                            <p className="text-xs text-adaptive-muted">
                                {getTextByMode({
                                    niños: 'Prometo usar la plataforma de manera divertida y segura 🤝',
                                    jóvenes: 'Al registrarte aceptas nuestras políticas de privacidad',
                                    adultos: 'Al crear una cuenta aceptas nuestros términos de servicio y política de privacidad'
                                })}
                            </p>
                        </div>
                    </div>

                    <Button 
                        type="submit" 
                        className={`mt-4 w-full h-12 text-lg font-semibold transition-all duration-200 hover:scale-[1.02] btn-adaptive ${
                            !data.terms ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        tabIndex={6} 
                        disabled={processing || !data.terms}
                    >
                        {processing && <LoaderCircle className="h-5 w-5 animate-spin mr-2" />}
                        <UserPlus className="h-5 w-5 mr-2" />
                        {processing ? (
                            getTextByMode({
                                niños: '🔄 Creando tu cuenta...',
                                jóvenes: 'Registrando...',
                                adultos: 'Creando cuenta...'
                            })
                        ) : (
                            getTextByMode({
                                niños: '🎉 ¡Crear mi cuenta!',
                                jóvenes: '🚀 Registrarse',
                                adultos: 'Crear Cuenta'
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
                                niños: '¿Ya tienes cuenta?',
                                jóvenes: '¿Ya eres miembro?',
                                adultos: 'o'
                            })}
                        </span>
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-sm text-adaptive-secondary mb-3">
                        {getTextByMode({
                            niños: '¿Ya tienes una cuenta? ¡Ingresa y divirtámonos! 🎮',
                            jóvenes: '¿Ya tienes cuenta? ¡Accede ahora!',
                            adultos: '¿Ya tienes una cuenta?'
                        })}
                    </p>
                    <TextLink 
                        href={route('login')} 
                        tabIndex={7}
                        className="inline-flex items-center justify-center w-full px-4 py-3 btn-adaptive-secondary rounded-md shadow-sm text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
                    >
                        {getTextByMode({
                            niños: '🚪 ¡Volver al login!',
                            jóvenes: '🔑 Iniciar sesión',
                            adultos: 'Iniciar Sesión'
                        })}
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
