<?php

namespace App\Http\Requests\product;

use Illuminate\Foundation\Http\FormRequest;

class ProductUpdateRequest extends FormRequest
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
            'name'          => 'string|required|max:50',
            'description'   => 'required',
            'price'         => 'required|numeric|between:0.01,9999.99',
            'discount'      => 'required|numeric|between:0,100',
            'special_offer' => 'required|boolean',
            'product_code'  => 'required|string|max:20',
            'image'         => 'image|mimes:jpg,png,jpeg|max:10000'
        ];
    }
}
