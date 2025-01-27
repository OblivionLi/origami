<?php

namespace App\Http\Requests\auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

/**
 * @property-read string $name
 * @property-read string $email
 * @property-read string $password
 */
class UpdateUserRequest extends FormRequest
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
     * @return array[string, string]
     */
    public function rules(): array
    {
        return [
            'name' => 'string|max:50',
            'email' => ['string', 'email', 'max:255', Rule::unique('users')->ignore(Auth::id())],
            'password' => 'confirmed'
        ];
    }
}
