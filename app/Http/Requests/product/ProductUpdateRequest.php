<?php

namespace App\Http\Requests\product;

use Illuminate\Foundation\Http\FormRequest;

/**
 * @property-read int $child_category_id
 * @property-read string $name
 * @property-read int $quantity
 * @property-read string $description
 * @property-read double $price
 * @property-read int $discount
 * @property-read boolean $special_offer
 * @property-read string $product_code
 */
class ProductUpdateRequest extends FormRequest
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
            'child_category_id' => 'numeric',
            'product_code' => 'required|string|max:20',
            'price' => 'required|numeric|between:0.01,9999.99',
            'discount' => 'required|numeric|between:0,100',
            'description' => 'required',
            'special_offer' => 'required|boolean',
            'total_quantities' => 'numeric|min:0',
        ];
    }
}
