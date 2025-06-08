<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Carrito extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'cliente_id',
        'fecha',
        'total',
        'estado',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'fecha' => 'date',
        'total' => 'decimal:2',
    ];

    /**
     * Relación con Cliente
     */
    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class);
    }

    /**
     * Relación con DetalleCarrito
     */
    public function detalles(): HasMany
    {
        return $this->hasMany(DetalleCarrito::class);
    }

    /**
     * Calcular el total del carrito
     */
    public function calcularTotal(): float
    {
        return $this->detalles()->sum('subtotal');
    }

    /**
     * Verificar si el carrito está activo
     */
    public function estaActivo(): bool
    {
        return $this->estado === 'activo';
    }

    /**
     * Obtener cantidad total de productos en el carrito
     */
    public function getTotalProductosAttribute(): int
    {
        return $this->detalles()->sum('cantidad');
    }
}
