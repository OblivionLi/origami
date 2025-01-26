<?php

namespace App\Http\Requests\auth;

use Illuminate\Foundation\Http\FormRequest;

/**
 * @property-read string $name
 * @property-read string $email
 * @property-read string $password
 * @property-read bool $remember_me
 */
class RegisterUserRequest extends FormRequest
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
            'name' => 'string|required|max:50',
            'email' => 'string|email|required|unique:users|max:255',
            'password' => 'string|required|confirmed',
            'remember_me' => 'boolean'
        ];
    }
}
