import { FormButtons, FormPage, InputField, SelectField, TextareaField, PriceField } from '@/components/Form';
import { useAppModeText } from '@/hooks/useAppModeText';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Categoria {
    id: number;
    nombre: string;
}

interface ProductoCreateProps {
    categorias: Categoria[];
}

export default function ProductoCreate({ categorias }: ProductoCreateProps) {
    const { getTextByMode, getModeClasses } = useAppModeText();

    const { data, setData, post, processing, errors } = useForm({
        cod_producto: '',
        nombre: '',
        descripcion: '',
        precio_compra: '',
        precio_venta: '',
        imagen: '',
        categoria_id: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/productos');
    };

    return (
        <DashboardLayout
            title={getTextByMode({
                niños: '➕ ¡Crear Producto Nuevo!',
                jóvenes: '➕ Crear Producto',
                adultos: 'Crear Nuevo Producto',
            })}
        >
            <Head title="Crear Producto" />

            <FormPage
                title={getTextByMode({
                    niños: '🎉 ¡Crear Producto Súper Genial!',
                    jóvenes: '✨ Crear Nuevo Producto',
                    adultos: 'Crear Nuevo Producto',
                })}
                description={getTextByMode({
                    niños: '¡Completa todos los campos para crear un producto increíble!',
                    jóvenes: 'Completa la información para crear el nuevo producto',
                    adultos: 'Complete la información requerida para crear el nuevo producto',
                })}
                backHref="/productos"
                backText={getTextByMode({
                    niños: '¡Volver a la lista!',
                    jóvenes: 'Volver a productos',
                    adultos: 'Volver a productos',
                })}
            >
                <form onSubmit={submit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                            <h2 className={`mb-4 text-lg font-medium text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '📝 Información Básica',
                                    jóvenes: '📝 Información Básica',
                                    adultos: 'Información Básica',
                                })}
                            </h2>
                            <div className="space-y-4">
                                <InputField
                                    label={getTextByMode({
                                        niños: '🏷️ Código del Producto',
                                        jóvenes: '🏷️ Código',
                                        adultos: 'Código del Producto',
                                    })}
                                    type="text"
                                    value={data.cod_producto}
                                    onChange={(e) => setData('cod_producto', e.target.value)}
                                    placeholder={getTextByMode({
                                        niños: 'Ej: PROD001',
                                        jóvenes: 'Código del producto',
                                        adultos: 'Ingrese el código del producto',
                                    })}
                                    error={errors.cod_producto}
                                    required
                                />

                                <InputField
                                    label={getTextByMode({
                                        niños: '📦 Nombre del Producto',
                                        jóvenes: '📦 Nombre',
                                        adultos: 'Nombre del Producto',
                                    })}
                                    type="text"
                                    value={data.nombre}
                                    onChange={(e) => setData('nombre', e.target.value)}
                                    placeholder={getTextByMode({
                                        niños: '¿Cómo se llama tu producto?',
                                        jóvenes: 'Nombre del producto',
                                        adultos: 'Ingrese el nombre del producto',
                                    })}
                                    error={errors.nombre}
                                    required
                                />

                                <SelectField
                                    label={getTextByMode({
                                        niños: '📂 Categoría',
                                        jóvenes: '📂 Categoría',
                                        adultos: 'Categoría',
                                    })}
                                    value={data.categoria_id}
                                    onChange={(e) => setData('categoria_id', e.target.value)}
                                    placeholder={getTextByMode({
                                        niños: '¿A qué categoría pertenece?',
                                        jóvenes: 'Selecciona una categoría',
                                        adultos: 'Seleccione una categoría',
                                    })}
                                    options={categorias.map(categoria => ({
                                        value: categoria.id.toString(),
                                        label: categoria.nombre
                                    }))}
                                    error={errors.categoria_id}
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
                                        niños: 'Cuenta algo sobre tu producto',
                                        jóvenes: 'Descripción del producto',
                                        adultos: 'Ingrese una descripción del producto',
                                    })}
                                    error={errors.descripcion}
                                />
                            </div>
                        </div>

                        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                            <h2 className={`mb-4 text-lg font-medium text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '💰 Precios y Foto',
                                    jóvenes: '💰 Precios e Imagen',
                                    adultos: 'Precios e Imagen',
                                })}
                            </h2>
                            <div className="space-y-4">
                                <PriceField
                                    label={getTextByMode({
                                        niños: '💰 Precio de Compra',
                                        jóvenes: '💰 Precio de Compra',
                                        adultos: 'Precio de Compra',
                                    })}
                                    value={data.precio_compra}
                                    onChange={(e) => setData('precio_compra', e.target.value)}
                                    placeholder="0.00"
                                    error={errors.precio_compra}
                                    required
                                />

                                <PriceField
                                    label={getTextByMode({
                                        niños: '💲 Precio de Venta',
                                        jóvenes: '💲 Precio de Venta',
                                        adultos: 'Precio de Venta',
                                    })}
                                    value={data.precio_venta}
                                    onChange={(e) => setData('precio_venta', e.target.value)}
                                    placeholder="0.00"
                                    error={errors.precio_venta}
                                    required
                                />

                                <InputField
                                    label={getTextByMode({
                                        niños: '🖼️ Imagen',
                                        jóvenes: '🖼️ URL de la Imagen',
                                        adultos: 'URL de la Imagen',
                                    })}
                                    type="text"
                                    value={data.imagen}
                                    onChange={(e) => setData('imagen', e.target.value)}
                                    placeholder={getTextByMode({
                                        niños: '¡Pon el enlace de tu imagen!',
                                        jóvenes: 'URL de la imagen',
                                        adultos: 'Ingrese la URL de la imagen',
                                    })}
                                    error={errors.imagen}
                                />

                                {/* Vista previa de la imagen */}
                                {data.imagen && (
                                    <div className="mt-2">
                                        <p className={`mb-1 text-sm font-medium text-gray-700 dark:text-gray-300 ${getModeClasses()}`}>
                                            {getTextByMode({
                                                niños: '👁️ Vista Previa',
                                                jóvenes: '👁️ Vista Previa',
                                                adultos: 'Vista Previa',
                                            })}
                                        </p>
                                        <div className="flex justify-center rounded-lg border border-gray-300 bg-gray-50 p-2 dark:border-gray-600 dark:bg-gray-700">
                                            <img
                                                src={data.imagen}
                                                alt={data.nombre || 'Producto'}
                                                className="h-32 w-auto object-contain"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Error';
                                                    (e.target as HTMLImageElement).alt = 'Error al cargar la imagen';
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <FormButtons
                        isProcessing={processing}
                        submitLabel={getTextByMode({
                            niños: '💾 ¡Crear Producto!',
                            jóvenes: '💾 Crear Producto',
                            adultos: 'Crear Producto',
                        })}
                        cancelHref="/productos"
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
