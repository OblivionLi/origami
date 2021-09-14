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
            'products_price'            => 'required|numeric',
            'products_discount_price'   => 'required|numeric',
            'shipping_price'            => 'required|numeric',
            'tax_price'                 => 'required|numeric',
            'total_price'               => 'required|numeric',
            'cart_items'                => 'required'
        ];
    }
}
