<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AjusteInventario extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'ajuste_inventario';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'almacen_id',
        'fecha',
        'motivo',
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
     * Relación con Almacen
     */
    public function almacen(): BelongsTo
    {
        return $this->belongsTo(Almacen::class);
    }

    /**
     * Relación con DetalleAjuste
     */
    public function detalles(): HasMany
    {
        return $this->hasMany(DetalleAjuste::class);
    }

    /**
     * Calcular el total del ajuste
     */
    public function calcularTotal(): float
    {
        $total = $this->detalles()->sum('total');
        return $total ? (float) $total : 0.0;
    }

    /**
     * Verificar si el ajuste está completado
     */
    public function estaCompletado(): bool
    {
        return $this->estado === 'completado';
    }

    /**
     * Obtener cantidad total de productos ajustados
     */
    public function getTotalProductosAttribute(): int
    {
        $total = $this->detalles()->sum('cantidad');
        return $total ? (int) $total : 0;
    }

    /**
     * Completar el ajuste
     */
    public function completar(): void
    {
        $this->update([
            'estado' => 'completado',
            'total' => $this->calcularTotal(),
        ]);
    }
}
