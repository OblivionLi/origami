<?php

namespace App\Http\Requests\product;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\UploadedFile;

/**
 * @property-read int $child_category_id
 * @property-read string $name
 * @property-read int $quantity
 * @property-read string $description
 * @property-read double $price
 * @property-read int $discount
 * @property-read boolean $special_offer
 * @property-read string $product_code
 * @property-read UploadedFile[] $images
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
            'child_category_id' => 'numeric|exists:child_category,id',
            'name' => 'string|required|max:50',
            'quantity' => 'numeric|min:0',
            'description' => 'required',
            'price' => 'required|numeric|between:0.01,9999.99',
            'discount' => 'required|numeric|between:0,100',
            'special_offer' => 'required|boolean',
            'product_code' => 'required|string|max:20',
            'image' => 'image|mimes:jpg,png,jpeg|max:10000'
        ];
    }
}
