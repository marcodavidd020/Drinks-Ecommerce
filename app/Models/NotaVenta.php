<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class NotaVenta extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'nota_venta';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
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
     * Relación con DetalleVenta
     */
    public function detalles(): HasMany
    {
        return $this->hasMany(DetalleVenta::class);
    }

    /**
     * Calcular el total de la venta
     */
    public function calcularTotal(): float
    {
        return $this->detalles()->sum('total');
    }

    /**
     * Verificar si la venta está completada
     */
    public function estaCompletada(): bool
    {
        return $this->estado === 'completada';
    }

    /**
     * Obtener cantidad total de productos vendidos
     */
    public function getTotalProductosAttribute(): int
    {
        return $this->detalles()->sum('cantidad');
    }

    /**
     * Completar la venta
     */
    public function completar(): void
    {
        $this->update([
            'estado' => 'completada',
            'total' => $this->calcularTotal(),
        ]);
    }
}
