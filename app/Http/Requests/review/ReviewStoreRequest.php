<?php

namespace App\Http\Requests\review;

use Illuminate\Foundation\Http\FormRequest;

/**
 * @property-read string $username
 * @property-read int $user_id
 * @property-read int $rating
 * @property-read string $comment
 */
class ReviewStoreRequest extends FormRequest
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
            'username' => 'string|required',
            'rating' => 'required|numeric|max:5',
            'comment' => 'required',
        ];
    }
}
