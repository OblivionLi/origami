<?php

namespace App\Http\Requests\childCat;

use Illuminate\Foundation\Http\FormRequest;

class ChildCategoryStoreRequest extends FormRequest
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
            'name'                  => 'string|required|max:30',
            'parent_category_id'    => 'required'
        ];
    }
}
