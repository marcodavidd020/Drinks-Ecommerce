<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class Pqrsona extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'ppersona';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nombre',
        'apellido',
        'telefono',
        'direccion',
        'email',
        'tipo',
        'descripcion',
        'estado',
        'fecha_creacion',
        'fecha_respuesta',
        'respuesta',
        'administrativo_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'fecha_creacion' => 'date',
        'fecha_respuesta' => 'date',
    ];

    /**
     * Relación con Administrativo
     */
    public function administrativo(): BelongsTo
    {
        return $this->belongsTo(Administrativo::class);
    }

    /**
     * Relación polimórfica con Proveedor
     */
    public function proveedor(): MorphOne
    {
        return $this->morphOne(Proveedor::class, 'proveedorable');
    }

    /**
     * Obtener nombre para mostrar
     */
    public function getNombreDisplayAttribute(): string
    {
        return $this->nombre_completo;
    }

    /**
     * Verificar si la PQRS está pendiente
     */
    public function estaPendiente(): bool
    {
        return $this->estado === 'pendiente';
    }

    /**
     * Verificar si la PQRS está resuelta
     */
    public function estaResuelta(): bool
    {
        return $this->estado === 'resuelto';
    }

    /**
     * Obtener nombre completo
     */
    public function getNombreCompletoAttribute(): string
    {
        return "{$this->nombre} {$this->apellido}";
    }

    /**
     * Marcar como respondida
     */
    public function marcarComoRespondida(string $respuesta, int $administrativoId): void
    {
        $this->update([
            'respuesta' => $respuesta,
            'fecha_respuesta' => now()->toDateString(),
            'estado' => 'resuelto',
            'administrativo_id' => $administrativoId,
        ]);
    }
}
