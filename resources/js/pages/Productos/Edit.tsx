import { useAppMode } from '@/contexts/AppModeContext';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Producto {
    id: number;
    cod_producto: string;
    nombre: string;
    descripcion?: string;
    precio_compra: number;
    precio_venta: number;
    imagen?: string;
    categoria_id: number;
    categoria: {
        id: number;
        nombre: string;
    };
    created_at: string;
    updated_at: string;
}

interface Categoria {
    id: number;
    nombre: string;
}

interface ProductoEditProps {
    producto: Producto;
    categorias: Categoria[];
}

export default function ProductoEdit({ producto, categorias }: ProductoEditProps) {
    const { settings } = useAppMode();

    const { data, setData, patch, processing, errors } = useForm({
        cod_producto: producto.cod_producto,
        nombre: producto.nombre,
        descripcion: producto.descripcion || '',
        precio_compra: producto.precio_compra,
        precio_venta: producto.precio_venta,
        imagen: producto.imagen || '',
        categoria_id: producto.categoria_id,
    });

    const getTextByMode = (textos: { niños: string; jóvenes: string; adultos: string }) => {
        return textos[settings.ageMode] || textos.adultos;
    };

    const getModeClasses = () => {
        switch (settings.ageMode) {
            case 'niños':
                return 'font-comic text-adaptive-kids';
            case 'jóvenes':
                return 'font-modern text-adaptive-teen';
            default:
                return 'font-classic text-adaptive-adult';
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(`/productos/${producto.id}`, {
            preserveScroll: true,
        });
    };

    return (
        <DashboardLayout
            title={getTextByMode({
                niños: `✏️ Editando ${producto.nombre}`,
                jóvenes: `✏️ Editar Producto`,
                adultos: `Editar Producto`,
            })}
        >
            <Head title={`Editar Producto: ${producto.nombre}`} />

            <div className={`space-y-6 ${getModeClasses()}`}>
                {/* Header con navegación */}
                <div className="mb-6">
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/productos"
                            className={`font-medium text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 ${getModeClasses()}`}
                        >
                            ←{' '}
                            {getTextByMode({
                                niños: '¡Volver a la lista!',
                                jóvenes: 'Volver a productos',
                                adultos: 'Volver a productos',
                            })}
                        </Link>
                    </div>
                    <p className={`mt-2 text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>
                        {getTextByMode({
                            niños: '¡Modifica la información de tu producto!',
                            jóvenes: 'Actualiza la información del producto',
                            adultos: 'Modifique la información del producto',
                        })}
                    </p>
                </div>

                {/* Formulario */}
                <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {/* Información básica */}
                            <div className="space-y-4">
                                <h3 className={`text-lg font-semibold text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                    {getTextByMode({
                                        niños: '📝 Información Básica',
                                        jóvenes: '📝 Información Básica',
                                        adultos: 'Información Básica',
                                    })}
                                </h3>

                                {/* Código del producto */}
                                <div>
                                    <label
                                        htmlFor="cod_producto"
                                        className={`mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 ${getModeClasses()}`}
                                    >
                                        {getTextByMode({
                                            niños: '🏷️ Código del Producto',
                                            jóvenes: '🏷️ Código',
                                            adultos: 'Código del Producto',
                                        })}
                                    </label>
                                    <input
                                        id="cod_producto"
                                        type="text"
                                        value={data.cod_producto}
                                        onChange={(e) => setData('cod_producto', e.target.value)}
                                        className={`w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 ${getModeClasses()}`}
                                        placeholder={getTextByMode({
                                            niños: 'Ej: PROD001',
                                            jóvenes: 'Código del producto',
                                            adultos: 'Ingrese el código del producto',
                                        })}
                                    />
                                    {errors.cod_producto && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.cod_producto}</p>}
                                </div>

                                {/* Nombre */}
                                <div>
                                    <label
                                        htmlFor="nombre"
                                        className={`mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 ${getModeClasses()}`}
                                    >
                                        {getTextByMode({
                                            niños: '📦 Nombre del Producto',
                                            jóvenes: '📦 Nombre',
                                            adultos: 'Nombre del Producto',
                                        })}
                                    </label>
                                    <input
                                        id="nombre"
                                        type="text"
                                        value={data.nombre}
                                        onChange={(e) => setData('nombre', e.target.value)}
                                        className={`w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 ${getModeClasses()}`}
                                        placeholder={getTextByMode({
                                            niños: '¿Cómo se llama tu producto?',
                                            jóvenes: 'Nombre del producto',
                                            adultos: 'Ingrese el nombre del producto',
                                        })}
                                    />
                                    {errors.nombre && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.nombre}</p>}
                                </div>

                                {/* Categoría */}
                                <div>
                                    <label
                                        htmlFor="categoria_id"
                                        className={`mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 ${getModeClasses()}`}
                                    >
                                        {getTextByMode({
                                            niños: '📂 Categoría',
                                            jóvenes: '📂 Categoría',
                                            adultos: 'Categoría',
                                        })}
                                    </label>
                                    <select
                                        id="categoria_id"
                                        value={data.categoria_id}
                                        onChange={(e) => setData('categoria_id', Number(e.target.value))}
                                        className={`w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 ${getModeClasses()}`}
                                    >
                                        <option value="">
                                            {getTextByMode({
                                                niños: '¿A qué categoría pertenece?',
                                                jóvenes: 'Selecciona una categoría',
                                                adultos: 'Seleccione una categoría',
                                            })}
                                        </option>
                                        {categorias.map((categoria) => (
                                            <option key={categoria.id} value={categoria.id}>
                                                {categoria.nombre}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.categoria_id && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.categoria_id}</p>}
                                </div>

                                {/* Descripción */}
                                <div>
                                    <label
                                        htmlFor="descripcion"
                                        className={`mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 ${getModeClasses()}`}
                                    >
                                        {getTextByMode({
                                            niños: '📝 Descripción (Opcional)',
                                            jóvenes: '📝 Descripción',
                                            adultos: 'Descripción',
                                        })}
                                    </label>
                                    <textarea
                                        id="descripcion"
                                        rows={3}
                                        value={data.descripcion}
                                        onChange={(e) => setData('descripcion', e.target.value)}
                                        className={`w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 ${getModeClasses()}`}
                                        placeholder={getTextByMode({
                                            niños: '¡Cuéntanos sobre tu producto!',
                                            jóvenes: 'Describe el producto...',
                                            adultos: 'Ingrese una descripción del producto',
                                        })}
                                    />
                                    {errors.descripcion && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.descripcion}</p>}
                                </div>
                            </div>

                            {/* Precios e imagen */}
                            <div className="space-y-4">
                                <h3 className={`text-lg font-semibold text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                    {getTextByMode({
                                        niños: '💰 Precios e Imagen',
                                        jóvenes: '💰 Precios e Imagen',
                                        adultos: 'Precios e Imagen',
                                    })}
                                </h3>

                                {/* Precio de compra */}
                                <div>
                                    <label
                                        htmlFor="precio_compra"
                                        className={`mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 ${getModeClasses()}`}
                                    >
                                        {getTextByMode({
                                            niños: '💵 Precio de Compra',
                                            jóvenes: '💵 Precio de Compra',
                                            adultos: 'Precio de Compra',
                                        })}
                                    </label>
                                    <input
                                        id="precio_compra"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.precio_compra}
                                        onChange={(e) => setData('precio_compra', Number(e.target.value))}
                                        className={`w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 ${getModeClasses()}`}
                                        placeholder="0.00"
                                    />
                                    {errors.precio_compra && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.precio_compra}</p>}
                                </div>

                                {/* Precio de venta */}
                                <div>
                                    <label
                                        htmlFor="precio_venta"
                                        className={`mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 ${getModeClasses()}`}
                                    >
                                        {getTextByMode({
                                            niños: '💲 Precio de Venta',
                                            jóvenes: '💲 Precio de Venta',
                                            adultos: 'Precio de Venta',
                                        })}
                                    </label>
                                    <input
                                        id="precio_venta"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.precio_venta}
                                        onChange={(e) => setData('precio_venta', Number(e.target.value))}
                                        className={`w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 ${getModeClasses()}`}
                                        placeholder="0.00"
                                    />
                                    {errors.precio_venta && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.precio_venta}</p>}
                                </div>

                                {/* Imagen */}
                                <div>
                                    <label
                                        htmlFor="imagen"
                                        className={`mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 ${getModeClasses()}`}
                                    >
                                        {getTextByMode({
                                            niños: '🖼️ Imagen (URL)',
                                            jóvenes: '🖼️ URL de Imagen',
                                            adultos: 'URL de la Imagen',
                                        })}
                                    </label>
                                    <input
                                        id="imagen"
                                        type="url"
                                        value={data.imagen}
                                        onChange={(e) => setData('imagen', e.target.value)}
                                        className={`w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 ${getModeClasses()}`}
                                        placeholder={getTextByMode({
                                            niños: 'https://ejemplo.com/imagen.jpg',
                                            jóvenes: 'URL de la imagen',
                                            adultos: 'Ingrese la URL de la imagen',
                                        })}
                                    />
                                    {errors.imagen && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.imagen}</p>}
                                </div>

                                {/* Vista previa de imagen */}
                                {data.imagen && (
                                    <div>
                                        <p className={`mb-2 text-sm font-medium text-gray-700 dark:text-gray-300 ${getModeClasses()}`}>
                                            {getTextByMode({
                                                niños: '👀 Vista Previa',
                                                jóvenes: '👀 Vista Previa',
                                                adultos: 'Vista Previa',
                                            })}
                                        </p>
                                        <div className="h-32 w-32 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
                                            <img
                                                src={data.imagen}
                                                alt="Vista previa"
                                                className="h-full w-full object-cover"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex justify-end space-x-4 border-t border-gray-200 pt-6 dark:border-gray-700">
                            <Link
                                href="/productos"
                                className={`rounded-md border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 ${getModeClasses()}`}
                            >
                                {getTextByMode({
                                    niños: '❌ Cancelar',
                                    jóvenes: 'Cancelar',
                                    adultos: 'Cancelar',
                                })}
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className={`rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400 ${getModeClasses()}`}
                            >
                                {processing
                                    ? getTextByMode({
                                          niños: '⏳ Guardando...',
                                          jóvenes: 'Guardando...',
                                          adultos: 'Guardando...',
                                      })
                                    : getTextByMode({
                                          niños: '💾 Guardar Cambios',
                                          jóvenes: '💾 Actualizar',
                                          adultos: 'Actualizar Producto',
                                      })}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}
