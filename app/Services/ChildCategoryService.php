<?php

namespace App\Services;

use App\Http\Requests\childCat\ChildCategoryStoreRequest;
use App\Http\Requests\childCat\ChildCategoryUpdateRequest;
use App\Http\Resources\childCat\ChildCategoryIndexResource;
use App\Http\Resources\childCat\ChildCategoryShowResource;
use App\Repositories\ChildCategoryRepository;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class ChildCategoryService
{
    protected ChildCategoryRepository $childCategoryRepository;

    public function __construct(ChildCategoryRepository $childCategoryRepository)
    {
        $this->childCategoryRepository = $childCategoryRepository;
    }

    /**
     * @return JsonResponse|AnonymousResourceCollection
     */
    public function getChildCategoriesWithRelations(): JsonResponse|AnonymousResourceCollection
    {
        $childCategories = $this->childCategoryRepository->getChildCategoryWithRelations()->get();
        if ($childCategories->isEmpty()) {
            return response()->json(['Could not fetch child categories with relations.'], Response::HTTP_NOT_FOUND);
        }
        return ChildCategoryIndexResource::collection($childCategories);
    }

    /**
     * @param ChildCategoryStoreRequest $request
     * @return JsonResponse
     */
    public function storeChildCategory(ChildCategoryStoreRequest $request): JsonResponse
    {
        $tryToSaveChildCategory = $this->childCategoryRepository->createChildCategory($request->validated());
        if (!$tryToSaveChildCategory) {
            return response()->json(['message' => 'Failed to create child category.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return response()->json(['message' => 'Child category created successfully.'], Response::HTTP_CREATED);
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
                return response()->json(['message' => 'ChildCategory not found.'], Response::HTTP_NOT_FOUND);
            }

            return new ChildCategoryShowResource($childCategory);
        } catch (Exception $e) {
            Log::error("Error trying to find child category by slug: " . $e->getMessage());
            return response()->json(['message' => 'Error trying to find child category by slug'], Response::HTTP_INTERNAL_SERVER_ERROR);
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
            return response()->json(['message' => 'Failed to update child category.'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response()->json(['message' => 'Child Category updated successfully.'], Response::HTTP_OK);
    }

    /**
     * @param string $slug
     * @return JsonResponse
     */
    public function deleteChildCategory(string $slug): JsonResponse
    {
        $tryToDeleteChildCategory = $this->childCategoryRepository->deleteChildCategory($slug);
        if (!$tryToDeleteChildCategory) {
            return response()->json(['message' => 'Failed to delete child category.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return response()->json(['message' => 'Child category deleted successfully.'], Response::HTTP_OK);
    }
}
