<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pago extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'pagos';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nota_venta_id',
        'tipo_pago_id',
        'fechapago',
        'estado',
        'pago_facil_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'fechapago' => 'datetime',
    ];

    /**
     * Relación con NotaVenta (N:1)
     * Un pago pertenece a una nota de venta
     */
    public function notaVenta(): BelongsTo
    {
        return $this->belongsTo(NotaVenta::class);
    }

    /**
     * Relación con TipoPago (N:1)
     * Un pago pertenece a un tipo de pago
     */
    public function tipoPago(): BelongsTo
    {
        return $this->belongsTo(TipoPago::class);
    }

    /**
     * Verificar si el pago está completado
     */
    public function estaPagado(): bool
    {
        return $this->estado === 'pagado';
    }

    /**
     * Verificar si el pago está pendiente
     */
    public function estaPendiente(): bool
    {
        return $this->estado === 'pendiente';
    }

    /**
     * Marcar pago como pagado
     */
    public function marcarPagado(): void
    {
        $this->update([
            'estado' => 'pagado',
            'fechapago' => now(),
        ]);
    }

    /**
     * Marcar pago como fallido
     */
    public function marcarFallido(): void
    {
        $this->update(['estado' => 'fallido']);
    }
} 