<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Direccion extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'direccion';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nombre',
        'longitud',
        'latitud',
        'referencia',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'longitud' => 'decimal:8',
        'latitud' => 'decimal:8',
    ];

    /**
     * Relación con Pedidos (1:N)
     * Una dirección puede tener muchos pedidos
     */
    public function pedidos()
    {
        return $this->hasMany(Pedido::class, 'direccion_id');
    }
}
