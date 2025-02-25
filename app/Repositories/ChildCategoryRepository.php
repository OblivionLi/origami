<?php

namespace App\Repositories;

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
     * @param array $requestData
     * @return bool
     */
    public function createChildCategory(array $requestData): bool
    {
        try {
            ChildCategory::create([
                'name' => $requestData['name'],
                'parent_category_id' => $requestData['parent_category_id'],
                'quantity' => 0
            ]);

            return true;
        } catch (Exception $e) {
            Log::error("Database error creating child category: " . $e->getMessage());
            return false;
        }
    }

    /**
     * @param array $requestData
     * @param string $slug
     * @return ChildCategory|null
     */
    public function updateChildCategory(array $requestData, string $slug): ?ChildCategory
    {
        try {
            $childCategory = ChildCategory::findBySlug($slug);
            if (!$childCategory) {
                return null;
            }

            $childCategory->slug = null;
            $childCategory->name = $requestData['name'];
            $childCategory->parent_category_id = $requestData['parent_category_id'];

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

    /**
     * @param string $slug
     * @return ChildCategory|null
     */
    public function getChildCategoryBySlug(string $slug): ?ChildCategory
    {
        return ChildCategory::findBySlug($slug);
    }

    /**
     * @param int $parentCategoryId
     * @return Builder
     */
    public function getChildCategoryByParentCategoryId(int $parentCategoryId): Builder
    {
        return ChildCategory::where(['parent_category_id' => $parentCategoryId]);
    }
}
