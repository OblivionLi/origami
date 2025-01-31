<?php

namespace App\Http\Requests\address;

use Illuminate\Foundation\Http\FormRequest;

/**
 * @property-read int $user_id
 * @property-read string $name
 * @property-read string $surname
 * @property-read string $country
 * @property-read string $city
 * @property-read string $address
 * @property-read string $postal_code
 * @property-read string $phone_number
 */
class AddressStoreRequest extends FormRequest
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
            'user_id' => 'required|numeric',
            'name' => 'string|required|max:50',
            'surname' => 'string|required|max:50',
            'country' => 'string|required|max:50',
            'city' => 'string|required|max:50',
            'address' => 'string|required|max:170',

            'postal_code' => 'required|numeric',
            'phone_number' => 'required',
        ];
    }
}
