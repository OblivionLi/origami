<?php

namespace App\Http\Requests\user;

use Illuminate\Foundation\Http\FormRequest;

/**
 * @property-read int $user_id
 */

class UserRolesPermissionsRequest extends FormRequest
{
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
     * @return array
     */
    public function rules(): array
    {
        return [
            'user_id' => 'required|integer|exists:users,id'
        ];
    }
}
