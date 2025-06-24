<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            ['nombre' => 'admin', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'cliente', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'empleado', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'organizador', 'created_at' => now(), 'updated_at' => now()],
        ];

        DB::table('rol')->insert($roles);
    }
}
