import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, UserPlus, Shield, Zap, Droplets } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { useAppModeText } from '@/hooks/useAppModeText';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { SelectField } from '@/components/Form';
import AuthLayout from '@/layouts/auth-layout';

type RegisterForm = {
    nombre: string;
    celular: string;
    email: string;
    genero: string;
    password: string;
    password_confirmation: string;
    terms: boolean;
};

export default function Register() {
    const { getTextByMode } = useAppModeText();
    const [showPasswordTips, setShowPasswordTips] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        nombre: '',
        celular: '',
        email: '',
        genero: '',
        password: '',
        password_confirmation: '',
        terms: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        if (!data.terms) {
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
        niños: '🧃 ¡Únete a Arturo!',
        jóvenes: '💧 Crea tu cuenta en Arturo',
        adultos: 'Únete a Arturo'
    });

    const description = getTextByMode({
        niños: '¡Crea tu cuenta y descubre bebidas súper refrescantes! 🌿✨',
        jóvenes: 'Accede a las mejores bebidas, ofertas exclusivas y promociones',
        adultos: 'Regístrate para acceder a nuestro catálogo completo de bebidas refrescantes'
    });

    return (
        <AuthLayout title={title} description={description}>
            <Head title={getTextByMode({
                niños: 'Registro Arturo',
                jóvenes: 'Signup - Arturo',
                adultos: 'Crear Cuenta - Arturo'
            })} />

            {/* Beneficios de Arturo */}
            <div className="mb-6 grid grid-cols-2 gap-3">
                <div className="text-center p-3 rounded-lg bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800">
                    <Droplets className="h-5 w-5 mx-auto mb-1 text-cyan-600 dark:text-cyan-400" />
                    <p className="text-xs font-medium text-cyan-800 dark:text-cyan-200">
                        {getTextByMode({
                            niños: '🧃 Bebidas',
                            jóvenes: 'Frescura',
                            adultos: 'Variedad'
                        })}
                    </p>
                </div>
                <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <Zap className="h-5 w-5 mx-auto mb-1 text-green-600 dark:text-green-400" />
                    <p className="text-xs font-medium text-green-800 dark:text-green-200">
                        {getTextByMode({
                            niños: '⚡ Energía',
                            jóvenes: 'Ofertas',
                            adultos: 'Descuentos'
                        })}
                    </p>
                </div>
            </div>

            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="nombre" className="text-adaptive">
                            {getTextByMode({
                                niños: '👤 ¿Cómo te llamas?',
                                jóvenes: 'Tu nombre',
                                adultos: 'Nombre Completo'
                            })}
                        </Label>
                        <Input
                            id="nombre"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.nombre}
                            onChange={(e) => setData('nombre', e.target.value)}
                            disabled={processing}
                            placeholder={getTextByMode({
                                niños: 'Tu nombre completo',
                                jóvenes: 'Ej: María García',
                                adultos: 'Ingresa tu nombre completo'
                            })}
                            className="transition-all duration-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-adaptive text-adaptive border-adaptive"
                        />
                        <InputError message={errors.nombre} className="mt-1" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="celular" className="text-adaptive">
                            {getTextByMode({
                                niños: '📱 Tu número de celular',
                                jóvenes: 'Celular',
                                adultos: 'Número de Celular'
                            })}
                        </Label>
                        <Input
                            id="celular"
                            type="tel"
                            tabIndex={2}
                            autoComplete="tel"
                            value={data.celular}
                            onChange={(e) => setData('celular', e.target.value)}
                            disabled={processing}
                            placeholder={getTextByMode({
                                niños: '3001234567',
                                jóvenes: 'Ej: 3001234567',
                                adultos: 'Número de contacto'
                            })}
                            className="transition-all duration-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-adaptive text-adaptive border-adaptive"
                        />
                        <InputError message={errors.celular} />
                        <p className="text-xs text-adaptive-muted">
                            {getTextByMode({
                                niños: 'Para avisarte cuando lleguen bebidas nuevas 📞',
                                jóvenes: 'Para notificaciones de pedidos (opcional)',
                                adultos: 'Número de contacto para notificaciones (opcional)'
                            })}
                        </p>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="genero" className="text-adaptive">
                            {getTextByMode({
                                niños: '🎭 ¿Cómo te identificas?',
                                jóvenes: 'Género',
                                adultos: 'Género'
                            })}
                        </Label>
                        <select
                            id="genero"
                            value={data.genero}
                            onChange={(e) => setData('genero', e.target.value)}
                            disabled={processing}
                            tabIndex={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-adaptive text-adaptive border-adaptive"
                        >
                            <option value="">
                                {getTextByMode({
                                    niños: 'Selecciona una opción',
                                    jóvenes: 'Elige tu género',
                                    adultos: 'Selecciona tu género'
                                })}
                            </option>
                            <option value="masculino">
                                {getTextByMode({
                                    niños: '👦 Masculino',
                                    jóvenes: 'Masculino',
                                    adultos: 'Masculino'
                                })}
                            </option>
                            <option value="femenino">
                                {getTextByMode({
                                    niños: '👧 Femenino',
                                    jóvenes: 'Femenino',
                                    adultos: 'Femenino'
                                })}
                            </option>
                            <option value="otro">
                                {getTextByMode({
                                    niños: '🌈 Otro',
                                    jóvenes: 'Otro',
                                    adultos: 'Otro'
                                })}
                            </option>
                        </select>
                        <InputError message={errors.genero} />
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
                            tabIndex={4}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder={getTextByMode({
                                niños: 'tuemailgenial@gmail.com',
                                jóvenes: 'tu.email@ejemplo.com',
                                adultos: 'correo@ejemplo.com'
                            })}
                            className="transition-all duration-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-adaptive text-adaptive border-adaptive"
                        />
                        <InputError message={errors.email} />
                        <p className="text-xs text-adaptive-muted">
                            {getTextByMode({
                                niños: 'Te enviaremos ofertas de bebidas refrescantes 🧃',
                                jóvenes: 'Para ofertas exclusivas de Arturo',
                                adultos: 'Para comunicaciones y promociones de Arturo'
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
                            tabIndex={5}
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
                            className="transition-all duration-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-adaptive text-adaptive border-adaptive"
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
                            tabIndex={6}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder={getTextByMode({
                                niños: 'Escribe tu contraseña otra vez',
                                jóvenes: 'Repite tu contraseña',
                                adultos: 'Confirma tu contraseña'
                            })}
                            className="transition-all duration-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-adaptive text-adaptive border-adaptive"
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

                    <div className="flex items-start space-x-3 p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg border border-cyan-200 dark:border-cyan-800">
                        <Checkbox
                            id="terms"
                            name="terms"
                            checked={data.terms}
                            onClick={() => setData('terms', !data.terms)}
                            tabIndex={7}
                            className="mt-1"
                        />
                        <div className="space-y-1">
                            <Label htmlFor="terms" className="text-sm text-adaptive">
                                {getTextByMode({
                                    niños: '📜 Acepto las reglas de Arturo',
                                    jóvenes: 'Acepto términos de Arturo',
                                    adultos: 'Acepto los términos y condiciones de Arturo'
                                })}
                            </Label>
                            <p className="text-xs text-adaptive-muted">
                                {getTextByMode({
                                    niños: 'Prometo disfrutar las bebidas de manera responsable 🧃🤝',
                                    jóvenes: 'Al registrarte aceptas nuestras políticas de Arturo',
                                    adultos: 'Al crear una cuenta aceptas nuestros términos de servicio y política de privacidad de Arturo'
                                })}
                            </p>
                        </div>
                    </div>

                    <Button 
                        type="submit" 
                        className={`mt-4 w-full h-12 text-lg font-semibold transition-all duration-200 hover:scale-[1.02] bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white ${
                            !data.terms ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        tabIndex={8} 
                        disabled={processing || !data.terms}
                    >
                        {processing && <LoaderCircle className="h-5 w-5 animate-spin mr-2" />}
                        <UserPlus className="h-5 w-5 mr-2" />
                        {processing ? (
                            getTextByMode({
                                niños: '🔄 Creando tu cuenta en Arturo...',
                                jóvenes: 'Registrando en Arturo...',
                                adultos: 'Creando cuenta en Arturo...'
                            })
                        ) : (
                            getTextByMode({
                                niños: '🧃 ¡Unirme a Arturo!',
                                jóvenes: '💧 Registrarse en Arturo',
                                adultos: 'Crear Cuenta en Arturo'
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
                                niños: '¿Ya tienes cuenta en Arturo?',
                                jóvenes: '¿Ya eres miembro?',
                                adultos: 'o'
                            })}
                        </span>
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-sm text-adaptive-secondary mb-3">
                        {getTextByMode({
                            niños: '¿Ya tienes una cuenta en Arturo? ¡Ingresa y sigamos refrescándonos! 🌿',
                            jóvenes: '¿Ya tienes cuenta? ¡Accede a Arturo ahora!',
                            adultos: '¿Ya tienes una cuenta en Arturo?'
                        })}
                    </p>
                    <TextLink 
                        href={route('login')} 
                        tabIndex={9}
                        className="inline-flex items-center justify-center w-full px-4 py-3 border border-cyan-200 dark:border-cyan-700 rounded-md shadow-sm text-sm font-medium text-cyan-700 dark:text-cyan-300 bg-white dark:bg-gray-800 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-all duration-200 hover:scale-[1.02]"
                    >
                        {getTextByMode({
                            niños: '🚪 ¡Entrar a Arturo!',
                            jóvenes: '🔑 Iniciar sesión',
                            adultos: 'Iniciar Sesión'
                        })}
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
