<?php

namespace App\Repositories;

use App\Models\ParentCategory;
use Illuminate\Database\Eloquent\Builder;

class ParentCategoryRepository
{
    public function getParentCategoryWithRelations(): Builder
    {
        return ParentCategory::with(['childCategories', 'products']);
    }
}
