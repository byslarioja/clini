<?php

namespace App\Enums;

enum AppointmentState
{
    case Completado;
    case Cancelado;
    case Pendiente;
    case Reprogramado;
}
