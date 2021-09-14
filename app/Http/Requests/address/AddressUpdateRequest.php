<?php

namespace App\Http\Requests\address;

use Illuminate\Foundation\Http\FormRequest;

class AddressUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'user_id'       => 'required|numeric',
            'name'          => 'string|required|max:50',
            'surname'       => 'string|required|max:50',
            'country'       => 'string|required|max:50',
            'city'          => 'string|required|max:50',
            'address'       => 'string|required|max:170',

            'postal_code'   => 'required|numeric',
            'phone_number'  => 'required',
        ];
    }
}
