# Componentes de Formulario

## Visión General

Esta librería de componentes proporciona una forma consistente y reutilizable de crear formularios en toda la aplicación. Todos los componentes siguen automáticamente el tema oscuro/claro y se adaptan a los diferentes modos de edad (niños, jóvenes, adultos).

## Componentes Base

### Input
Componente base para inputs de texto, email, password, etc.

```tsx
import { Input } from '@/components/Form';

<Input 
    type="text" 
    placeholder="Escribe aquí..."
    error={hasError}
/>
```

### Select
Componente base para dropdowns/select.

```tsx
import { Select } from '@/components/Form';

<Select error={hasError}>
    <option value="">Seleccione una opción</option>
    <option value="1">Opción 1</option>
</Select>
```

### Textarea
Componente base para áreas de texto.

```tsx
import { Textarea } from '@/components/Form';

<Textarea 
    rows={4}
    placeholder="Descripción..."
    error={hasError}
/>
```

### Label
Componente para etiquetas de campos.

```tsx
import { Label } from '@/components/Form';

<Label htmlFor="campo" required>
    Nombre del Campo
</Label>
```

### ErrorMessage
Componente para mostrar mensajes de error.

```tsx
import { ErrorMessage } from '@/components/Form';

<ErrorMessage message={errors.campo} />
```

## Componentes Compuestos

### InputField
Combina Label + Input + ErrorMessage en un solo componente.

```tsx
import { InputField } from '@/components/Form';

<InputField
    label="Nombre Completo"
    type="text"
    value={data.nombre}
    onChange={(e) => setData('nombre', e.target.value)}
    placeholder="Ingrese su nombre"
    error={errors.nombre}
    required
/>
```

### SelectField
Combina Label + Select + ErrorMessage con soporte para opciones.

```tsx
import { SelectField } from '@/components/Form';

<SelectField
    label="Categoría"
    value={data.categoria_id}
    onChange={(e) => setData('categoria_id', e.target.value)}
    placeholder="Seleccione una categoría"
    options={[
        { value: '1', label: 'Categoría 1' },
        { value: '2', label: 'Categoría 2' }
    ]}
    error={errors.categoria_id}
    required
/>
```

### TextareaField
Combina Label + Textarea + ErrorMessage.

```tsx
import { TextareaField } from '@/components/Form';

<TextareaField
    label="Descripción"
    value={data.descripcion}
    onChange={(e) => setData('descripcion', e.target.value)}
    rows={4}
    placeholder="Ingrese una descripción"
    error={errors.descripcion}
/>
```

### PriceField
Campo especializado para precios con símbolo de moneda.

```tsx
import { PriceField } from '@/components/Form';

<PriceField
    label="Precio de Venta"
    value={data.precio_venta}
    onChange={(e) => setData('precio_venta', e.target.value)}
    placeholder="0.00"
    currency="$"
    error={errors.precio_venta}
    required
/>
```

### NumberField
Campo para números con opciones de configuración.

```tsx
import { NumberField } from '@/components/Form';

<NumberField
    label="Cantidad"
    value={data.cantidad}
    onChange={(e) => setData('cantidad', e.target.value)}
    placeholder="0"
    allowDecimals={false}
    allowNegative={false}
    error={errors.cantidad}
    required
/>
```

## Hook Auxiliar

### useAppModeText
Hook para manejar textos adaptativos según el modo de edad.

```tsx
import { useAppModeText } from '@/hooks/useAppModeText';

function MyComponent() {
    const { getTextByMode, getModeClasses, ageMode } = useAppModeText();

    return (
        <div className={getModeClasses()}>
            <h1>{getTextByMode({
                niños: '¡Hola pequeño!',
                jóvenes: 'Hola!',
                adultos: 'Bienvenido'
            })}</h1>
        </div>
    );
}
```

## Ejemplo Completo

```tsx
import { 
    FormPage, 
    FormButtons,
    InputField, 
    SelectField, 
    TextareaField, 
    PriceField 
} from '@/components/Form';
import { useAppModeText } from '@/hooks/useAppModeText';
import { useForm } from '@inertiajs/react';

export default function ProductoCreate({ categorias }) {
    const { getTextByMode } = useAppModeText();
    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        categoria_id: '',
        precio_venta: '',
        descripcion: ''
    });

    const submit = (e) => {
        e.preventDefault();
        post('/productos');
    };

    return (
        <FormPage
            title="Crear Producto"
            description="Complete la información del producto"
            backHref="/productos"
        >
            <form onSubmit={submit} className="space-y-6">
                <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <InputField
                            label={getTextByMode({
                                niños: '📝 Nombre del Producto',
                                jóvenes: 'Nombre',
                                adultos: 'Nombre del Producto'
                            })}
                            type="text"
                            value={data.nombre}
                            onChange={(e) => setData('nombre', e.target.value)}
                            error={errors.nombre}
                            required
                        />

                        <SelectField
                            label="Categoría"
                            value={data.categoria_id}
                            onChange={(e) => setData('categoria_id', e.target.value)}
                            placeholder="Seleccione una categoría"
                            options={categorias.map(cat => ({
                                value: cat.id.toString(),
                                label: cat.nombre
                            }))}
                            error={errors.categoria_id}
                            required
                        />

                        <PriceField
                            label="Precio de Venta"
                            value={data.precio_venta}
                            onChange={(e) => setData('precio_venta', e.target.value)}
                            error={errors.precio_venta}
                            required
                        />

                        <TextareaField
                            label="Descripción"
                            value={data.descripcion}
                            onChange={(e) => setData('descripcion', e.target.value)}
                            error={errors.descripcion}
                            containerClassName="sm:col-span-2"
                        />
                    </div>
                </div>

                <FormButtons
                    isProcessing={processing}
                    submitLabel="Crear Producto"
                    cancelHref="/productos"
                />
            </form>
        </FormPage>
    );
}
```

## Ventajas de la Refactorización

1. **Consistencia**: Todos los formularios siguen el mismo patrón visual
2. **Reutilización**: Menos código duplicado en toda la aplicación
3. **Mantenibilidad**: Cambios en estilos se aplican globalmente
4. **Accesibilidad**: Labels asociados correctamente con inputs
5. **Responsive**: Grid automático para layouts adaptativos
6. **Modo de edad**: Soporte automático para textos adaptativos
7. **Validación**: Manejo consistente de errores 