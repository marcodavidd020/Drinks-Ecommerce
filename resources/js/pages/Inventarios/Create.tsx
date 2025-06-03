import { FormButtons, FormPage, FormSection } from '@/components/Form';
import { useAppMode } from '@/contexts/AppModeContext';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

interface Producto {
    id: number;
    nombre: string;
    cod_producto: string;
    precio_venta: number;
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
    const { settings } = useAppMode();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        producto_id: '',
        almacen_id: '',
        stock: '',
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        post('/inventarios', {
            onSuccess: () => {
                reset('producto_id', 'almacen_id', 'stock');
                setIsSubmitting(false);
            },
            onError: () => {
                setIsSubmitting(false);
            },
        });
    };

    const productoOptions = [
        { value: '', label: '-- Seleccione un producto --' },
        ...productos.map((producto) => ({
            value: producto.id.toString(),
            label: `${producto.nombre} (${producto.cod_producto})`,
        })),
    ];

    const almacenOptions = [
        { value: '', label: '-- Seleccione un almacén --' },
        ...almacenes.map((almacen) => ({
            value: almacen.id.toString(),
            label: `${almacen.nombre} (${almacen.ubicacion})`,
        })),
    ];

    // Configuración de campos para FormSection
    const inventarioFields = [
        {
            type: 'select' as const,
            name: 'producto_id',
            label: getTextByMode({
                niños: '📦 Producto',
                jóvenes: 'Producto',
                adultos: 'Producto',
            }),
            value: data.producto_id,
            onChange: (value: string) => setData('producto_id', value),
            options: productoOptions,
            span: 2 as const,
            required: true,
            error: errors.producto_id
        },
        {
            type: 'select' as const,
            name: 'almacen_id',
            label: getTextByMode({
                niños: '🏬 Almacén',
                jóvenes: 'Almacén',
                adultos: 'Almacén',
            }),
            value: data.almacen_id,
            onChange: (value: string) => setData('almacen_id', value),
            options: almacenOptions,
            span: 2 as const,
            required: true,
            error: errors.almacen_id
        },
        {
            type: 'number' as const,
            name: 'stock',
            label: getTextByMode({
                niños: '📊 Cantidad',
                jóvenes: 'Stock',
                adultos: 'Stock Inicial',
            }),
            value: data.stock,
            onChange: (value: string) => setData('stock', value),
            placeholder: 'Cantidad en stock',
            min: 0,
            step: '1',
            required: true,
            error: errors.stock
        }
    ];

    return (
        <DashboardLayout
            title={getTextByMode({
                niños: '📦 Agregar Producto al Inventario',
                jóvenes: 'Agregar al Inventario',
                adultos: 'Registrar Producto en Inventario',
            })}
        >
            <Head title="Agregar Producto al Inventario" />

            <FormPage
                title={getTextByMode({
                    niños: '📦 ¡Agregar un Producto al Inventario!',
                    jóvenes: 'Agregar Producto al Inventario',
                    adultos: 'Registrar Producto en Inventario',
                })}
                description={getTextByMode({
                    niños: '¡Aquí puedes añadir un producto a un almacén!',
                    jóvenes: 'Agrega un producto al inventario de un almacén',
                    adultos: 'Complete el formulario para registrar un producto en el inventario',
                })}
                backHref="/inventarios"
                backText={getTextByMode({
                    niños: '¡Volver al Inventario!',
                    jóvenes: 'Volver al Inventario',
                    adultos: 'Volver al Inventario',
                })}
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <FormSection
                        title={getTextByMode({
                            niños: '📦 Datos del Producto',
                            jóvenes: 'Información del Producto',
                            adultos: 'Información del Producto',
                        })}
                        fields={inventarioFields}
                        columns={2}
                    />

                    <FormButtons
                        isProcessing={processing || isSubmitting}
                        submitLabel={getTextByMode({
                            niños: '💾 ¡Agregar al Inventario!',
                            jóvenes: '💾 Agregar Producto',
                            adultos: 'Registrar en Inventario',
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
