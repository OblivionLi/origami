<?php

namespace App\Http\Requests\auth;

use Illuminate\Foundation\Http\FormRequest;


/**
 * @property-read string email
 */
class ForgotPasswordRequest extends FormRequest
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
            'email' => 'string|email|required|max:255|exists:users',
        ];
    }
}
