<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

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
    ];

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
     * Obtener nombre para mostrar
     */
    public function getNombreDisplayAttribute(): string
    {
        return $this->razon_social ?: $this->user->nombre;
    }
}
