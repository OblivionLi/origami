<?php

namespace App\Http\Requests\parentCat;

use Illuminate\Foundation\Http\FormRequest;

/**
 * @property-read string $name
 */
class ParentCategoryStoreRequest extends FormRequest
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
            'name' => 'string|required|max:30'
        ];
    }
}
