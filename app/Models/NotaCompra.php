<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class NotaCompra extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'nota_compra';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'proveedor_id',
        'fecha',
        'total',
        'estado',
        'observaciones',
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
     * Relación con Proveedor
     */
    public function proveedor(): BelongsTo
    {
        return $this->belongsTo(Proveedor::class);
    }

    /**
     * Relación con DetalleCompra
     */
    public function detalles(): HasMany
    {
        return $this->hasMany(DetalleCompra::class);
    }

    /**
     * Calcular el total de la compra
     */
    public function calcularTotal(): float
    {
        return $this->detalles()->sum('total');
    }

    /**
     * Verificar si la compra está recibida
     */
    public function estaRecibida(): bool
    {
        return $this->estado === 'recibida';
    }

    /**
     * Verificar si la compra está pendiente
     */
    public function estaPendiente(): bool
    {
        return $this->estado === 'pendiente';
    }

    /**
     * Verificar si la compra está cancelada
     */
    public function estaCancelada(): bool
    {
        return $this->estado === 'cancelada';
    }

    /**
     * Obtener cantidad total de productos comprados
     */
    public function getTotalProductosAttribute(): int
    {
        return $this->detalles()->sum('cantidad');
    }

    /**
     * Completar la compra
     */
    public function completar(): void
    {
        $this->update([
            'estado' => 'completada',
            'total' => $this->calcularTotal(),
        ]);
    }
}
