<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoPago extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'tipo_pago';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'tipo_pago',
    ];

    /**
     * Relación con Pagos (1:N)
     * Un tipo de pago puede tener múltiples pagos
     */
    public function pagos()
    {
        return $this->hasMany(Pago::class);
    }
}
