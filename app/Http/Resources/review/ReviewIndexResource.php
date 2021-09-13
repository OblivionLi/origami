<?php

namespace App\Http\Resources\review;

use Illuminate\Http\Resources\Json\JsonResource;

class ReviewIndexResource extends JsonResource
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

            'product'       => $this->product,
            'user'          => $this->user
        ];
    }
}
