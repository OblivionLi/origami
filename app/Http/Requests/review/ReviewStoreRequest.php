<?php

namespace App\Http\Requests\review;

use Illuminate\Foundation\Http\FormRequest;

class ReviewStoreRequest extends FormRequest
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
            'product_id'    => 'required|numeric',
            'username'      => 'string|required',
            'rating'        => 'required|numeric|max:5',
            'comment'       => 'required',
        ];
    }
}
