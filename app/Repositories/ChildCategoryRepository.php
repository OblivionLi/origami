<?php

namespace App\Repositories;

use App\Http\Requests\childCat\ChildCategoryStoreRequest;
use App\Http\Requests\childCat\ChildCategoryUpdateRequest;
use App\Models\ChildCategory;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Log;

class ChildCategoryRepository
{
    public function getChildCategoryWithRelations(): Builder
    {
        return ChildCategory::with(['parentCategory', 'products']);
    }

    /**
     * @param ChildCategoryStoreRequest $request
     * @return bool
     */
    public function createChildCategory(ChildCategoryStoreRequest $request): bool
    {
        try {
            ChildCategory::create([
                'name' => $request->name,
                'parent_category_id' => $request->parent_category_id,
                'quantity' => 0
            ]);

            return true;
        } catch (Exception $e) {
            Log::error("Database error creating child category: " . $e->getMessage());
            return false;
        }
    }

    /**
     * @param ChildCategoryUpdateRequest $request
     * @param string $slug
     * @return ChildCategory|null
     */
    public function updateChildCategory(ChildCategoryUpdateRequest $request, string $slug): ?ChildCategory
    {
        try {
            $childCategory = ChildCategory::findBySlug($slug);
            if (!$childCategory) {
                return null;
            }

            $childCategory->slug = null;
            $childCategory->name = $request->name;
            $childCategory->parent_category_id = $request->parent_category_id;

            $childCategory->save();

            return $childCategory;
        } catch (Exception $e) {
            Log::error("Database error updating child category: " . $e->getMessage());
            return null;
        }
    }

    /**
     * @param string $slug
     * @return bool
     */
    public function deleteChildCategory(string $slug): bool
    {
        try {
            $childCategory = ChildCategory::findBySlug($slug);
            if (!$childCategory) {
                return false;
            }

            $childCategory->delete();

            return true;
        } catch (Exception $e) {
            Log::error("Database error deleting child category: " . $e->getMessage());
            return false;
        }
    }
}
