<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\UploadedFile;

/**
 * @property-read int $product_id
 * @property-read UploadedFile $image
 */
class ProductImageStoreRequest extends FormRequest
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
            'product_id' => 'required|numeric',
            'image' => 'required|max:10000|mimes:png,jpg,jpeg'
        ];
    }
}
