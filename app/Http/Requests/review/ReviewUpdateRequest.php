<?php

namespace App\Http\Requests\review;

use Illuminate\Foundation\Http\FormRequest;

/**
 * @property-read string $user_comment
 * @property-read string $admin_comment
 */
class ReviewUpdateRequest extends FormRequest
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
            'user_comment' => 'required',
            'admin_comment' => 'string|required'
        ];
    }
}
