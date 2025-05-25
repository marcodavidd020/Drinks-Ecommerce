<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetalleAjuste extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'ajuste_inventario_id',
        'producto_id',
        'cantidad',
        'tipo_ajuste',
        'motivo',
        'costo_unitario',
        'total',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'costo_unitario' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    /**
     * Relación con AjusteInventario
     */
    public function ajusteInventario(): BelongsTo
    {
        return $this->belongsTo(AjusteInventario::class);
    }

    /**
     * Relación con Producto
     */
    public function producto(): BelongsTo
    {
        return $this->belongsTo(Producto::class);
    }

    /**
     * Verificar si es un ajuste de entrada
     */
    public function esEntrada(): bool
    {
        return $this->tipo_ajuste === 'entrada';
    }

    /**
     * Verificar si es un ajuste de salida
     */
    public function esSalida(): bool
    {
        return $this->tipo_ajuste === 'salida';
    }

    /**
     * Calcular el total automáticamente
     */
    protected static function boot()
    {
        parent::boot();

        static::saving(function (DetalleAjuste $detalle) {
            if ($detalle->costo_unitario) {
                $detalle->total = $detalle->cantidad * $detalle->costo_unitario;
            }
        });
    }
}
