<?php

namespace App\Repositories;

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
     * @return Builder
     */
    public function getAdminParentCategoryList(): Builder
    {
        return ParentCategory::query()
            ->select(['id', 'name', 'created_at', 'updated_at'])
            ->with([
                'childCategories:id,name,parent_category_id'
            ])
            ->withCount('products');
    }

    /**
     * @param array $requestData
     * @return bool
     */
    public function createParentCategory(array $requestData): bool
    {
        try {
            ParentCategory::create([
                'name' => $requestData['name'],
            ]);

            return true;
        } catch (Exception $e) {
            Log::error("Database error creating parent category: " . $e->getMessage());
            return false;
        }
    }

    /**
     * @param array $requestData
     * @param int $id
     * @return ParentCategory|null
     */
    public function updateParentCategory(array $requestData, $id): ?ParentCategory
    {
        try {
            $parentCategory = ParentCategory::find($id);
            if (!$parentCategory) {
                return null;
            }

            $parentCategory->slug = null;
            $parentCategory->name = $requestData['name'];

            $parentCategory->save();

            return $parentCategory;
        } catch (Exception $e) {
            Log::error("Database error updating parent category: " . $e->getMessage());
            return null;
        }
    }

    /**
     * @param int $id
     * @return bool
     */
    public function deleteParentCategory(int $id): bool
    {
        try {
            $parentCategory = ParentCategory::find($id);
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

    /**
     * @param string $slug
     * @return ParentCategory|null
     */
    public function getParentCategoryBySlug(string $slug): ?ParentCategory
    {
        return ParentCategory::with(['childCategories', 'products'])->findBySlug($slug);
    }

    /**
     * @param string $name
     * @return ParentCategory|null
     */
    public function getParentCategoryByName(string $name): ?ParentCategory
    {
        return ParentCategory::where("name", $name)->first();
    }
}
