<?php

namespace App\Repositories;

use App\Models\Review;
use Illuminate\Database\Eloquent\Builder;

class ReviewRepository
{
    public function getReviewWithRelations(): Builder
    {
        return Review::with(['product', 'user']);
    }
}
