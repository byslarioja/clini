<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * @template TColumn of string
 */
class PaginatedRequest extends FormRequest
{
    /** @var array<TColumn> */
    protected $sortable_columns = [];

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'sort_column' => ['required_with:sort_order', Rule::in($this->sortable_columns)],
            'sort_order' => ['required_with:sort_column', Rule::in(['asc', 'desc'])],
            'filter' => ['sometimes'],
            'page' => ['sometimes', 'numeric'],
            'per_page' => ['sometimes', 'numeric'],
        ];
    }

    /**
     * @param  string|null  $key
     * @param  mixed  $default
     * @return array{
     *  sort_column: TColumn,
     *  sort_order: "asc" | "desc",
     *  filter: string,
     *  page: int,
     *  per_page: int
     * }
     */
    public function validated($key = null, $default = null): array
    {
        /** @var array{
         *  sort_column: TColumn,
         *  sort_order: "asc" | "desc",
         *  filter: string,
         *  page: int,
         *  per_page: int
         * } $validated
         */
        $validated = parent::validated($key, $default);

        return array_merge([
            'sort_order' => 'asc',
            'sort_column' => 'name',
            'filter' => '',
            'page' => 1,
            'per_page' => 15,
        ], $validated);
    }
}
