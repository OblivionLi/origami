<?php

namespace App\Http\Requests\role;

use Illuminate\Foundation\Http\FormRequest;

/**
 * @property-read string $name
 * @property-read bool $is_admin
 */
class RoleUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'name' => 'string|required|max:30',
            'is_admin' => 'boolean'
        ];
    }
}
