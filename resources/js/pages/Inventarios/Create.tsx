import { FormButtons, FormPage, SelectField, NumberField } from '@/components/Form';
import { useAppModeText } from '@/hooks/useAppModeText';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Producto {
    id: number;
    nombre: string;
    cod_producto: string;
}

interface Almacen {
    id: number;
    nombre: string;
    ubicacion: string;
}

interface InventariosCreateProps {
    productos: Producto[];
    almacenes: Almacen[];
}

export default function InventariosCreate({ productos, almacenes }: InventariosCreateProps) {
    const { getTextByMode, getModeClasses } = useAppModeText();

    const { data, setData, post, processing, errors } = useForm({
        producto_id: '',
        almacen_id: '',
        stock: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/inventarios');
    };

    return (
        <DashboardLayout
            title={getTextByMode({
                niños: '📦 ¡Crear Inventario!',
                jóvenes: 'Crear Inventario',
                adultos: 'Crear Nuevo Inventario',
            })}
        >
            <Head title="Crear Inventario" />

            <FormPage
                title={getTextByMode({
                    niños: '🎉 ¡Crear Inventario Súper Genial!',
                    jóvenes: '✨ Crear Nuevo Inventario',
                    adultos: 'Crear Nuevo Inventario',
                })}
                description={getTextByMode({
                    niños: '¡Agrega productos a los almacenes!',
                    jóvenes: 'Asigna productos a un almacén',
                    adultos: 'Asigne un producto a un almacén con su cantidad inicial',
                })}
                backHref="/inventarios"
                backText={getTextByMode({
                    niños: '¡Volver a inventario!',
                    jóvenes: 'Volver a inventario',
                    adultos: 'Volver a inventario',
                })}
            >
                <form onSubmit={submit} className="space-y-6">
                    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                        <h2 className={`mb-4 text-lg font-medium text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: '📋 Información del Inventario',
                                jóvenes: '📋 Datos del Inventario',
                                adultos: 'Información del Inventario',
                            })}
                        </h2>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <SelectField
                                label={getTextByMode({
                                    niños: '📦 ¿Qué producto?',
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

                            <SelectField
                                label={getTextByMode({
                                    niños: '🏬 ¿En qué almacén?',
                                    jóvenes: '🏬 Almacén',
                                    adultos: 'Almacén',
                                })}
                                value={data.almacen_id}
                                onChange={(e) => setData('almacen_id', e.target.value)}
                                placeholder={getTextByMode({
                                    niños: '¡Elige un almacén!',
                                    jóvenes: 'Selecciona un almacén',
                                    adultos: 'Seleccione un almacén',
                                })}
                                options={almacenes.map(almacen => ({
                                    value: almacen.id.toString(),
                                    label: `${almacen.nombre} (${almacen.ubicacion})`
                                }))}
                                error={errors.almacen_id}
                                required
                            />

                            <NumberField
                                label={getTextByMode({
                                    niños: '📊 ¿Cuántos hay?',
                                    jóvenes: '📊 Cantidad en Stock',
                                    adultos: 'Cantidad en Stock',
                                })}
                                value={data.stock}
                                onChange={(e) => setData('stock', e.target.value)}
                                placeholder={getTextByMode({
                                    niños: 'Ej: 10, 20, 30...',
                                    jóvenes: 'Cantidad inicial',
                                    adultos: 'Ingrese la cantidad inicial',
                                })}
                                integerOnly
                                error={errors.stock}
                                containerClassName="sm:col-span-2"
                                required
                            />
                        </div>
                    </div>

                    <FormButtons
                        isProcessing={processing}
                        submitLabel={getTextByMode({
                            niños: '💾 ¡Crear Inventario!',
                            jóvenes: '💾 Crear Inventario',
                            adultos: 'Crear Inventario',
                        })}
                        cancelHref="/inventarios"
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
