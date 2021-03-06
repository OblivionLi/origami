<?php

namespace App\Http\Resources\review;

use Illuminate\Http\Resources\Json\JsonResource;

class ReviewIndexWithPaginationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id'            => $this->id,
            'user_name'     => $this->user_name,
            'user_comment'  => $this->user_comment,
            'admin_name'    => $this->admin_name,
            'admin_comment' => $this->admin_comment,
            'created_at'    => $this->created_at,
            'updated_at'    => $this->updated_at,

            'product'       => $this->product,
            'user'          => $this->user
        ];
    }
}
