<?php

namespace App\Repositories;

use App\Models\ChildCategory;
use Illuminate\Database\Eloquent\Builder;

class ChildCategoryRepository
{
    public function getChildCategoryWithRelations(): Builder
    {
        return ChildCategory::with(['parentCategory', 'products']);
    }
}
