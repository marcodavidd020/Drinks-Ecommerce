<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
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
     * Relación polimórfica con Pqrsona o Pempresa
     */
    public function proveedorable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Relación con NotaCompra
     */
    public function notasCompra(): HasMany
    {
        return $this->hasMany(NotaCompra::class);
    }

    /**
     * Verificar si es persona
     */
    public function esPersona(): bool
    {
        return $this->tipo === 'persona';
    }

    /**
     * Verificar si es empresa
     */
    public function esEmpresa(): bool
    {
        return $this->tipo === 'empresa';
    }

    /**
     * Obtener nombre para mostrar
     */
    public function getNombreDisplayAttribute(): string
    {
        if ($this->proveedorable) {
            return $this->proveedorable->nombre_display;
        }
        return $this->nombre;
    }
}
