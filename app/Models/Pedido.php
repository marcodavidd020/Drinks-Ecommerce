<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pedido extends Model
{
    use HasFactory;

    protected $table = 'pedido';

    protected $fillable = [
        'direccion_id',
        'fecha',
        'total',
        'estado',
        'fecha_hora_envio',
        'fecha_hora_entrega',
    ];

    protected $casts = [
        'fecha' => 'date',
        'fecha_hora_envio' => 'date',
        'fecha_hora_entrega' => 'date',
        'total' => 'decimal:2',
    ];

    /**
     * Relación con Direccion (N:1)
     * Un pedido pertenece a una dirección
     */
    public function direccion()
    {
        return $this->belongsTo(Direccion::class, 'direccion_id');
    }

    /**
     * Relación con Carrito (1:1)
     * Un pedido puede tener un carrito
     */
    public function carrito()
    {
        return $this->hasOne(Carrito::class, 'pedido_id');
    }

    /**
     * Relación con NotaVenta (1:1)
     * Un pedido puede tener una nota de venta
     */
    public function notaVenta()
    {
        return $this->hasOne(NotaVenta::class, 'pedido_id');
    }
}
