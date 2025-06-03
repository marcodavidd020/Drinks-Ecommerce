import { FormButtons, FormPage, InputField, SelectField, TextareaField, PriceField } from '@/components/Form';
import { useAppModeText } from '@/hooks/useAppModeText';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Producto {
    id: number;
    nombre: string;
    cod_producto: string;
}

interface PromocionCreateProps {
    productos: Producto[];
}

export default function PromocionCreate({ productos }: PromocionCreateProps) {
    const { getTextByMode, getModeClasses } = useAppModeText();

    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        descripcion: '',
        descuento: '',
        fecha_inicio: '',
        fecha_fin: '',
        tipo: '',
        producto_id: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/promociones');
    };

    return (
        <DashboardLayout
            title={getTextByMode({
                niños: '🎉 ¡Crear Promoción!',
                jóvenes: '🎉 Crear Promoción',
                adultos: 'Crear Nueva Promoción',
            })}
        >
            <Head title="Crear Promoción" />

            <FormPage
                title={getTextByMode({
                    niños: '🎊 ¡Crear Promoción Súper Genial!',
                    jóvenes: '✨ Crear Nueva Promoción',
                    adultos: 'Crear Nueva Promoción',
                })}
                description={getTextByMode({
                    niños: '¡Crea descuentos increíbles para los productos!',
                    jóvenes: 'Crea promociones y descuentos para productos',
                    adultos: 'Configure promociones y descuentos para los productos',
                })}
                backHref="/promociones"
                backText={getTextByMode({
                    niños: '¡Volver a promociones!',
                    jóvenes: 'Volver a promociones',
                    adultos: 'Volver a promociones',
                })}
            >
                <form onSubmit={submit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                            <h2 className={`mb-4 text-lg font-medium text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '📝 Información de la Promoción',
                                    jóvenes: '📝 Datos de la Promoción',
                                    adultos: 'Información de la Promoción',
                                })}
                            </h2>
                            <div className="space-y-4">
                                <InputField
                                    label={getTextByMode({
                                        niños: '🎁 Nombre de la Promoción',
                                        jóvenes: '🎁 Nombre de la Promoción',
                                        adultos: 'Nombre de la Promoción',
                                    })}
                                    type="text"
                                    value={data.nombre}
                                    onChange={(e) => setData('nombre', e.target.value)}
                                    placeholder={getTextByMode({
                                        niños: '¡Descuento Súper Genial!',
                                        jóvenes: 'Descuento de Verano',
                                        adultos: 'Ingrese el nombre de la promoción',
                                    })}
                                    error={errors.nombre}
                                    required
                                />

                                <TextareaField
                                    label={getTextByMode({
                                        niños: '📝 Descripción',
                                        jóvenes: '📝 Descripción',
                                        adultos: 'Descripción',
                                    })}
                                    value={data.descripcion}
                                    onChange={(e) => setData('descripcion', e.target.value)}
                                    rows={3}
                                    placeholder={getTextByMode({
                                        niños: 'Cuenta sobre tu promoción...',
                                        jóvenes: 'Descripción de la promoción',
                                        adultos: 'Descripción detallada de la promoción',
                                    })}
                                    error={errors.descripcion}
                                />

                                <SelectField
                                    label={getTextByMode({
                                        niños: '🏷️ Tipo de Promoción',
                                        jóvenes: '🏷️ Tipo de Promoción',
                                        adultos: 'Tipo de Promoción',
                                    })}
                                    value={data.tipo}
                                    onChange={(e) => setData('tipo', e.target.value)}
                                    placeholder={getTextByMode({
                                        niños: '¿Qué tipo es?',
                                        jóvenes: 'Selecciona un tipo',
                                        adultos: 'Seleccione el tipo de promoción',
                                    })}
                                    options={[
                                        { value: 'descuento', label: getTextByMode({
                                            niños: '💰 Descuento',
                                            jóvenes: '💰 Descuento',
                                            adultos: 'Descuento',
                                        })},
                                        { value: 'oferta', label: getTextByMode({
                                            niños: '🎯 Oferta Especial',
                                            jóvenes: '🎯 Oferta',
                                            adultos: 'Oferta Especial',
                                        })},
                                        { value: 'liquidacion', label: getTextByMode({
                                            niños: '🔥 ¡Liquidación!',
                                            jóvenes: '🔥 Liquidación',
                                            adultos: 'Liquidación',
                                        })}
                                    ]}
                                    error={errors.tipo}
                                    required
                                />

                                <PriceField
                                    label={getTextByMode({
                                        niños: '💰 Descuento (%)',
                                        jóvenes: '💰 Porcentaje de Descuento',
                                        adultos: 'Porcentaje de Descuento',
                                    })}
                                    value={data.descuento}
                                    onChange={(e) => setData('descuento', e.target.value)}
                                    placeholder="10"
                                    error={errors.descuento}
                                    required
                                />
                            </div>
                        </div>

                        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                            <h2 className={`mb-4 text-lg font-medium text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '📅 Fechas y Producto',
                                    jóvenes: '📅 Configuración',
                                    adultos: 'Configuración Adicional',
                                })}
                            </h2>
                            <div className="space-y-4">
                                <InputField
                                    label={getTextByMode({
                                        niños: '📅 ¿Cuándo empieza?',
                                        jóvenes: '📅 Fecha de Inicio',
                                        adultos: 'Fecha de Inicio',
                                    })}
                                    type="date"
                                    value={data.fecha_inicio}
                                    onChange={(e) => setData('fecha_inicio', e.target.value)}
                                    error={errors.fecha_inicio}
                                    required
                                />

                                <InputField
                                    label={getTextByMode({
                                        niños: '📅 ¿Cuándo termina?',
                                        jóvenes: '📅 Fecha de Fin',
                                        adultos: 'Fecha de Fin',
                                    })}
                                    type="date"
                                    value={data.fecha_fin}
                                    onChange={(e) => setData('fecha_fin', e.target.value)}
                                    error={errors.fecha_fin}
                                    required
                                />

                                <SelectField
                                    label={getTextByMode({
                                        niños: '📦 ¿Para qué producto?',
                                        jóvenes: '📦 Producto',
                                        adultos: 'Producto',
                                    })}
                                    value={data.producto_id}
                                    onChange={(e) => setData('producto_id', e.target.value)}
                                    placeholder={getTextByMode({
                                        niños: '¡Elige un producto!',
                                        jóvenes: 'Selecciona un producto',
                                        adultos: 'Seleccione un producto',
                                    })}
                                    options={productos.map(producto => ({
                                        value: producto.id.toString(),
                                        label: `${producto.nombre} (${producto.cod_producto})`
                                    }))}
                                    error={errors.producto_id}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <FormButtons
                        isProcessing={processing}
                        submitLabel={getTextByMode({
                            niños: '💾 ¡Crear Promoción!',
                            jóvenes: '💾 Crear Promoción',
                            adultos: 'Crear Promoción',
                        })}
                        cancelHref="/promociones"
                        cancelLabel={getTextByMode({
                            niños: '❌ Cancelar',
                            jóvenes: 'Cancelar',
                            adultos: 'Cancelar',
                        })}
                    />
                </form>
            </FormPage>
        </DashboardLayout>
    );
}
