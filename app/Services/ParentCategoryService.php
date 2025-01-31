<?php

namespace App\Services;

use App\Http\Requests\parentCat\ParentCategoryStoreRequest;
use App\Http\Requests\parentCat\ParentCategoryUpdateRequest;
use App\Http\Resources\parentCat\ParentCategoryIndexResource;
use App\Http\Resources\parentCat\ParentCategoryShowResource;
use App\Models\ParentCategory;
use App\Repositories\ParentCategoryRepository;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Log;

class ParentCategoryService
{
    protected ParentCategoryRepository $parentCategoryRepository;

    public function __construct(ParentCategoryRepository $parentCategoryRepository)
    {
        $this->parentCategoryRepository = $parentCategoryRepository;
    }

    /**
     * @return AnonymousResourceCollection
     */
    public function getParentCategoriesWithRelations(): AnonymousResourceCollection
    {
        return ParentCategoryIndexResource::collection($this->parentCategoryRepository->getParentCategoryWithRelations()->get());
    }

    /**
     * @param ParentCategoryStoreRequest $request
     * @return JsonResponse
     */
    public function storeParentCategory(ParentCategoryStoreRequest $request): JsonResponse
    {
        $tryToSaveParentCategory = $this->parentCategoryRepository->createParentCategory($request->validated());
        if (!$tryToSaveParentCategory) {
            return response()->json(['message' => 'Parent category store failed'], 500);
        }

        return response()->json(['message' => 'Parent category created'], 200);
    }

    /**
     * @param string $slug
     * @return ParentCategoryShowResource|JsonResponse
     */
    public function showParentCategoryWithRelations(string $slug): ParentCategoryShowResource|JsonResponse
    {
        try {
            $parentCategory = ParentCategory::findBySlug($slug);
            if (!$parentCategory) {
                return response()->json(['message' => 'ParentCategory does not exist..'], 422);
            }

            return new ParentCategoryShowResource($parentCategory);
        } catch (Exception $e) {
            Log::error("Error trying to find parent category by slug: " . $e->getMessage());
            return response()->json(['message' => 'Error trying to find parent category by slug'], 500);
        }
    }

    /**
     * @param ParentCategoryUpdateRequest $request
     * @param string $slug
     * @return JsonResponse
     */
    public function updateParentCategory(ParentCategoryUpdateRequest $request, string $slug): JsonResponse
    {
        $parentCategory = $this->parentCategoryRepository->updateParentCategory($request, $slug);
        if (!$parentCategory) {
            return response()->json(['message' => 'Parent Category does not exist'], 422);
        }

        return response()->json(['message', 'Parent Category update success'], 200);
    }

    /**
     * @param string $slug
     * @return JsonResponse
     */
    public function deleteParentCategory(string $slug): JsonResponse
    {
        $tryToDeleteParentCategory = $this->parentCategoryRepository->deleteParentCategory($slug);
        if (!$tryToDeleteParentCategory) {
            return response()->json(['message' => 'Parent category delete failed'], 422);
        }

        return response()->json(['message' => 'Parent category delete success'], 200);
    }
}
