<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Proveedor extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'proveedores';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nombre',
        'telefono',
        'direccion',
        'email',
        'tipo',
        'proveedorable_id',
        'proveedorable_type',
    ];

    /**
     * Relación polimórfica - puede ser Persona o Empresa
     */
    public function proveedorable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Relación con User
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relación con Dirección
     */
    public function direccion(): HasOne
    {
        return $this->hasOne(Direccion::class);
    }

    /**
     * Relación con Productos
     */
    public function productos(): HasMany
    {
        return $this->hasMany(Producto::class);
    }

    /**
     * Relación con NotaCompra
     */
    public function notasCompra(): HasMany
    {
        return $this->hasMany(NotaCompra::class);
    }

    /**
     * Verificar si es una persona
     */
    public function esPersona(): bool
    {
        return $this->tipo === 'persona';
    }

    /**
     * Verificar si es una empresa
     */
    public function esEmpresa(): bool
    {
        return $this->tipo === 'empresa';
    }

    /**
     * Obtener datos completos del proveedor
     */
    public function getDatosCompletosAttribute(): array
    {
        $datos = [
            'id' => $this->id,
            'nombre' => $this->nombre,
            'telefono' => $this->telefono,
            'direccion' => $this->direccion,
            'email' => $this->email,
            'tipo' => $this->tipo,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];

        // Agregar datos específicos según el tipo
        if ($this->proveedorable) {
            if ($this->esPersona()) {
                $datos['apellido'] = $this->proveedorable->apellido ?? null;
                $datos['nombre_completo'] = trim($this->nombre . ' ' . ($this->proveedorable->apellido ?? ''));
            } elseif ($this->esEmpresa()) {
                $datos['razon_social'] = $this->proveedorable->razon_social ?? null;
                $datos['nit'] = $this->proveedorable->nit ?? null;
                $datos['representante_legal'] = $this->proveedorable->representante_legal ?? null;
            }
        }

        return $datos;
    }

    /**
     * Obtener nombre para mostrar
     */
    public function getNombreDisplayAttribute(): string
    {
        if ($this->proveedorable) {
            if ($this->esPersona()) {
                return trim($this->nombre . ' ' . ($this->proveedorable->apellido ?? ''));
            } elseif ($this->esEmpresa()) {
                return $this->proveedorable->razon_social ?? $this->nombre;
            }
        }
        
        return $this->nombre;
    }
}
