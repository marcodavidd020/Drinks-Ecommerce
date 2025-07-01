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
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'carrito';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'cliente_id',
        'pedido_id',
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
     * Relación con Usuario a través de Cliente
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'cliente_id', 'id')
                   ->join('cliente', 'user.id', '=', 'cliente.user_id')
                   ->where('cliente.id', $this->cliente_id);
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
        $total = (float) $this->detalles()->sum('subtotal');
        $this->update(['total' => $total]);
        return $total;
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

    /**
     * Obtener carrito activo del cliente o crear uno nuevo
     */
    public static function obtenerOCrearCarritoActivo(int $clienteId): self
    {
        return static::firstOrCreate(
            [
                'cliente_id' => $clienteId,
                'estado' => 'activo'
            ],
            [
                'fecha' => now(),
                'total' => 0
            ]
        );
    }

    /**
     * Relación con Pedido (N:1)
     * Un carrito pertenece a un pedido
     */
    public function pedido(): BelongsTo
    {
        return $this->belongsTo(Pedido::class, 'pedido_id');
    }
}
