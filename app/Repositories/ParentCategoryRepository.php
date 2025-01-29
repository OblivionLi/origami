<?php

namespace App\Repositories;

use App\Http\Requests\parentCat\ParentCategoryStoreRequest;
use App\Http\Requests\parentCat\ParentCategoryUpdateRequest;
use App\Models\ParentCategory;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Log;

class ParentCategoryRepository
{
    /**
     * @return Builder
     */
    public function getParentCategoryWithRelations(): Builder
    {
        return ParentCategory::with(['childCategories', 'products']);
    }

    /**
     * @param ParentCategoryStoreRequest $request
     * @return bool
     */
    public function createParentCategory(ParentCategoryStoreRequest $request): bool
    {
        try {
            ParentCategory::create([
               'name' => $request->name,
            ]);

            return true;
        } catch (Exception $e) {
            Log::error("Database error creating parent category: " . $e->getMessage());
            return false;
        }
    }

    /**
     * @param ParentCategoryUpdateRequest $request
     * @param string $slug
     * @return ParentCategory|null
     */
    public function updateParentCategory(ParentCategoryUpdateRequest $request, string $slug): ?ParentCategory
    {
        try {
            $parentCategory = ParentCategory::findBySlug($slug);
            if (!$parentCategory) {
                return null;
            }

            $parentCategory->slug = null;
            $parentCategory->name = $request->name;

            $parentCategory->save();

            return $parentCategory;
        } catch (Exception $e) {
            Log::error("Database error updating parent category: " . $e->getMessage());
            return null;
        }
    }

    /**
     * @param string $slug
     * @return bool
     */
    public function deleteParentCategory(string $slug): bool
    {
        try {
            $parentCategory = ParentCategory::findBySlug($slug);
            if (!$parentCategory) {
                return false;
            }

            $parentCategory->delete();

            return true;
        } catch (Exception $e) {
            Log::error("Database error deleting parent category: " . $e->getMessage());
            return false;
        }
    }
}
