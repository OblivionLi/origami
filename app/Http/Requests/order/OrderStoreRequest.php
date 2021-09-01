<?php

namespace App\Http\Requests\order;

use Illuminate\Foundation\Http\FormRequest;

class OrderStoreRequest extends FormRequest
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
            'product_price'            => 'required|numeric|between:0.01,9999.99',
            'product_discount_price'   => 'required|numeric|between:0.01,9999.99',
            'shipping_price'            => 'required|numeric|between:0.01,9999.99',
            'tax_price'                 => 'required|numeric|between:0.01,9999.99',
            'total_price'               => 'required|numeric|between:0.01,9999.99',
            'cart_items'                => 'required'
        ];
    }
}
