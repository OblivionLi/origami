<?php

namespace App\Http\Requests\order;

use Illuminate\Foundation\Http\FormRequest;

/**
 * @property-read double $products_price
 * @property-read double $products_discount_price
 * @property-read double $shipping_price
 * @property-read double $tax_price
 * @property-read double $total_price
 * @property-read array $cart_items
 */
class OrderStoreRequest extends FormRequest
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
            'address_id' => 'required|exists:addresses,id',
            'products_price' => 'required|numeric',
            'products_discount_price' => 'required|numeric',
            'shipping_price' => 'required|numeric',
            'tax_price' => 'required|numeric',
            'total_price' => 'required|numeric',
            'cart_items' => 'required'
        ];
    }
}
