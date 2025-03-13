<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $specialties = $this->getSpecialties();

        foreach ($specialties as $specialty) {
            DB::insert('INSERT INTO specialties (name, created_at) VALUES (:name, :created_at)', [
                'name' => $specialty,
                'created_at' => new DateTime,
            ]);
        }
    }

    private function getSpecialties(): array
    {
        return [
            'Alergología e Inmunología',
            'Anatomía Patológica',
            'Anestesiología',
            'Angiología General y Hemodinamia',
            'Cardiología',
            'Cirugía Cardiovascular',
            'Cirugía de Cabeza y Cuello',
            'Cirugía Torácica',
            'Cirugía General',
            'Cirugía Plástica y Reparadora',
            'Cirugía Vascular Periférica',
            'Clínica Médica',
            'Coloproctología',
            'Dermatología',
            'Diagnóstico por Imágenes',
            'Electrofisiología Cardíaca',
            'Emergentología',
            'Endocrinología',
            'Estética',
            'Farmacología Clínica',
            'Fisiatría (Medicina Física y Rehabilitación)',
            'Gastroenterología',
            'Genética Médica',
            'Geriatría',
            'Ginecología',
            'Hematología',
            'Hemato-Oncología Pediátrica',
            'Hemoterapia e Inmunohematología',
            'Hepatología',
            'Infectología',
            'Kinesiología',
            'Medicina del Deporte',
            'Medicina del Trabajo',
            'Medicina General y/o Medicina de Familia',
            'Medicina Legal',
            'Medicina Nuclear',
            'Medicina Paliativa',
            'Nefrología',
            'Neonatología',
            'Neumonología',
            'Neurocirugía',
            'Neurología',
            'Nutrición',
            'Obstetricia',
            'Odontología',
            'Oftalmología',
            'Ortopedia y Traumatología',
            'Otorrinolaringología',
            'Pediatría',
            'Psiquiatría',
            'Radioterapia o Terapia Radiante',
            'Reumatología',
            'Terapia Intensiva',
            'Tocoginecología',
            'Toxicología',
            'Urología',
        ];
    }
};
