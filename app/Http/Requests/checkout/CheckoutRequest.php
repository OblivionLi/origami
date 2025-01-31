<?php

namespace App\Http\Requests\checkout;

use Illuminate\Foundation\Http\FormRequest;

/**
 * @property-read double $amount
 */
class CheckoutRequest extends FormRequest
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
            'amount' => 'numeric|required|min:0.1'
        ];
    }
}
