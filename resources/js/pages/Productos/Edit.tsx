import { FormButtons, FormSection } from '@/components/Form';
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
        return textos[settings.ageMode as keyof typeof textos] || textos.adultos;
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
                    <h1 className={`mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                        {getTextByMode({
                            niños: `✏️ Editar ${producto.nombre}`,
                            jóvenes: 'Editar Producto',
                            adultos: 'Editar Producto',
                        })}
                    </h1>
                    <p className={`mt-2 text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>
                        {getTextByMode({
                            niños: '¡Modifica la información de tu producto!',
                            jóvenes: 'Actualiza la información del producto',
                            adultos: 'Modifique la información del producto',
                        })}
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <FormSection
                            title={getTextByMode({
                                niños: '📝 Información Básica',
                                jóvenes: '📝 Información Básica',
                                adultos: 'Información Básica',
                            })}
                        >
                            <div className="space-y-4">
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

                                <div>
                                    <label
                                        htmlFor="descripcion"
                                        className={`mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 ${getModeClasses()}`}
                                    >
                                        {getTextByMode({
                                            niños: '📝 Descripción',
                                            jóvenes: '📝 Descripción',
                                            adultos: 'Descripción',
                                        })}
                                    </label>
                                    <textarea
                                        id="descripcion"
                                        value={data.descripcion}
                                        onChange={(e) => setData('descripcion', e.target.value)}
                                        rows={3}
                                        className={`w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 ${getModeClasses()}`}
                                        placeholder={getTextByMode({
                                            niños: 'Cuenta algo sobre tu producto',
                                            jóvenes: 'Descripción del producto',
                                            adultos: 'Ingrese una descripción del producto',
                                        })}
                                    ></textarea>
                                    {errors.descripcion && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.descripcion}</p>}
                                </div>
                            </div>
                        </FormSection>

                        <FormSection
                            title={getTextByMode({
                                niños: '💰 Precios y Foto',
                                jóvenes: '💰 Precios e Imagen',
                                adultos: 'Precios e Imagen',
                            })}
                        >
                            <div className="space-y-4">
                                <div>
                                    <label
                                        htmlFor="precio_compra"
                                        className={`mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 ${getModeClasses()}`}
                                    >
                                        {getTextByMode({
                                            niños: '💰 Precio de Compra',
                                            jóvenes: '💰 Precio de Compra',
                                            adultos: 'Precio de Compra',
                                        })}
                                    </label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <span className="text-gray-500 sm:text-sm">$</span>
                                        </div>
                                        <input
                                            id="precio_compra"
                                            type="number"
                                            value={data.precio_compra}
                                            onChange={(e) => setData('precio_compra', Number(e.target.value))}
                                            className={`w-full rounded-md border border-gray-300 py-2 pr-3 pl-7 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 ${getModeClasses()}`}
                                            placeholder="0.00"
                                            step="0.01"
                                            min="0"
                                        />
                                    </div>
                                    {errors.precio_compra && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.precio_compra}</p>}
                                </div>

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
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <span className="text-gray-500 sm:text-sm">$</span>
                                        </div>
                                        <input
                                            id="precio_venta"
                                            type="number"
                                            value={data.precio_venta}
                                            onChange={(e) => setData('precio_venta', Number(e.target.value))}
                                            className={`w-full rounded-md border border-gray-300 py-2 pr-3 pl-7 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 ${getModeClasses()}`}
                                            placeholder="0.00"
                                            step="0.01"
                                            min="0"
                                        />
                                    </div>
                                    {errors.precio_venta && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.precio_venta}</p>}
                                </div>

                                <div>
                                    <label
                                        htmlFor="imagen"
                                        className={`mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 ${getModeClasses()}`}
                                    >
                                        {getTextByMode({
                                            niños: '🖼️ Imagen',
                                            jóvenes: '🖼️ URL de la Imagen',
                                            adultos: 'URL de la Imagen',
                                        })}
                                    </label>
                                    <input
                                        id="imagen"
                                        type="text"
                                        value={data.imagen}
                                        onChange={(e) => setData('imagen', e.target.value)}
                                        className={`w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 ${getModeClasses()}`}
                                        placeholder={getTextByMode({
                                            niños: '¡Pon el enlace de tu imagen!',
                                            jóvenes: 'URL de la imagen',
                                            adultos: 'Ingrese la URL de la imagen',
                                        })}
                                    />
                                    {errors.imagen && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.imagen}</p>}
                                </div>

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
                                                alt={data.nombre}
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
                        </FormSection>
                    </div>

                    <FormButtons
                        isProcessing={processing}
                        submitLabel={getTextByMode({
                            niños: '💾 ¡Guardar Cambios!',
                            jóvenes: '💾 Guardar Cambios',
                            adultos: 'Guardar Cambios',
                        })}
                        cancelHref="/productos"
                        cancelLabel={getTextByMode({
                            niños: '❌ Cancelar',
                            jóvenes: 'Cancelar',
                            adultos: 'Cancelar',
                        })}
                    />
                </form>
            </div>
        </DashboardLayout>
    );
}
