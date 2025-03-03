<?php

namespace App\Repositories;

use App\Models\ChildCategory;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Log;

class ChildCategoryRepository
{
    /**
     * @return Builder
     */
    public function getChildCategoryWithRelations(): Builder
    {
        return ChildCategory::with(['parentCategory', 'products']);
    }

    /**
     * @return Builder
     */
    public function getAdminChildCategoryList(): Builder
    {
        return ChildCategory::query()
            ->select(['id', 'name', 'slug', 'quantity', 'created_at', 'updated_at', 'parent_category_id'])
            ->with('parentCategory');
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
                'parent_category_id' => $requestData['parentCategoryId'],
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
     * @param int $id
     * @return ChildCategory|null
     */
    public function updateChildCategory(array $requestData, int $id): ?ChildCategory
    {
        try {
            $childCategory = ChildCategory::find($id);
            if (!$childCategory) {
                return null;
            }

            $childCategory->slug = null;
            $childCategory->name = $requestData['name'];
            $childCategory->parent_category_id = $requestData['parentCategoryId'];

            $childCategory->save();

            return $childCategory;
        } catch (Exception $e) {
            Log::error("Database error updating child category: " . $e->getMessage());
            return null;
        }
    }

    /**
     * @param int $id
     * @return bool
     */
    public function deleteChildCategory(int $id): bool
    {
        try {
            $childCategory = ChildCategory::find($id);
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
