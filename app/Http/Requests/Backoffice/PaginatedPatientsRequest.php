<?php

namespace App\Http\Requests\Backoffice;

use App\Http\Requests\PaginatedRequest;

/**
 * @extends PaginatedRequest<"name">
 */
class PaginatedPatientsRequest extends PaginatedRequest
{
    protected $sortable_columns = [
        'name',
    ];
}
