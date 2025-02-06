<?php

namespace App\Services;

use App\Http\Requests\childCat\ChildCategoryStoreRequest;
use App\Http\Requests\childCat\ChildCategoryUpdateRequest;
use App\Http\Resources\childCat\ChildCategoryIndexResource;
use App\Http\Resources\childCat\ChildCategoryShowResource;
use App\Models\ChildCategory;
use App\Repositories\ChildCategoryRepository;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Log;

class ChildCategoryService
{
    protected ChildCategoryRepository $childCategoryRepository;

    public function __construct(ChildCategoryRepository $childCategoryRepository)
    {
        $this->childCategoryRepository = $childCategoryRepository;
    }

    /**
     * @return AnonymousResourceCollection
     */
    public function getChildCategoriesWithRelations(): AnonymousResourceCollection
    {
        return ChildCategoryIndexResource::collection($this->childCategoryRepository->getChildCategoryWithRelations()->get());
    }

    /**
     * @param ChildCategoryStoreRequest $request
     * @return JsonResponse
     */
    public function storeChildCategory(ChildCategoryStoreRequest $request): JsonResponse
    {
        $tryToSaveChildCategory = $this->childCategoryRepository->createChildCategory($request->validated());
        if (!$tryToSaveChildCategory) {
            return response()->json(['message' => 'Child category store failed'], 500);
        }

        return response()->json(['message' => 'Child category created'], 200);
    }

    /**
     * @param string $slug
     * @return ChildCategoryShowResource|JsonResponse
     */
    public function showChildCategoryWithRelations(string $slug): ChildCategoryShowResource|JsonResponse
    {
        try {
            $childCategory = $this->childCategoryRepository->getChildCategoryBySlug($slug);
            if (!$childCategory) {
                return response()->json(['message' => 'ChildCategory does not exist..'], 422);
            }

            return new ChildCategoryShowResource($childCategory);
        } catch (Exception $e) {
            Log::error("Error trying to find child category by slug: " . $e->getMessage());
            return response()->json(['message' => 'Error trying to find child category by slug'], 500);
        }
    }

    /**
     * @param ChildCategoryUpdateRequest $request
     * @param string $slug
     * @return JsonResponse
     */
    public function updateChildCategory(ChildCategoryUpdateRequest $request, string $slug): JsonResponse
    {
        $childCategory = $this->childCategoryRepository->updateChildCategory($request->validated(), $slug);
        if (!$childCategory) {
            return response()->json(['message' => 'Child Category does not exist'], 422);
        }

        return response()->json(['message', 'Child Category update success'], 200);
    }

    /**
     * @param string $slug
     * @return JsonResponse
     */
    public function deleteChildCategory(string $slug): JsonResponse
    {
        $tryToDeleteChildCategory = $this->childCategoryRepository->deleteChildCategory($slug);
        if (!$tryToDeleteChildCategory) {
            return response()->json(['message' => 'Child category delete failed'], 422);
        }

        return response()->json(['message' => 'Child category delete success'], 200);
    }
}
