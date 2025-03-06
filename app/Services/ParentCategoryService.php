<?php

namespace App\Services;

use App\Http\Requests\parentCat\ParentCategoryStoreRequest;
use App\Http\Requests\parentCat\ParentCategoryUpdateRequest;
use App\Http\Resources\parentCat\ParentCategoryIndexResource;
use App\Http\Resources\parentCat\ParentCategoryShowResource;
use App\Repositories\ParentCategoryRepository;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class ParentCategoryService
{
    protected ParentCategoryRepository $parentCategoryRepository;

    public function __construct(ParentCategoryRepository $parentCategoryRepository)
    {
        $this->parentCategoryRepository = $parentCategoryRepository;
    }

    /**
     * @return JsonResponse|AnonymousResourceCollection
     */
    public function getParentCategoriesWithRelations(): JsonResponse|AnonymousResourceCollection
    {
        $parentCategories = $this->parentCategoryRepository->getParentCategoryWithRelations()->get();
        if ($parentCategories->isEmpty()) {
            return response()->json(['Could not fetch parent categories with relations.'], Response::HTTP_NOT_FOUND);
        }

        return ParentCategoryIndexResource::collection($parentCategories);
    }

    /**
     * @return JsonResponse|AnonymousResourceCollection
     */
    public function getAdminParentCategoriesWithRelations(): JsonResponse|AnonymousResourceCollection
    {
        $parentCategories = $this->parentCategoryRepository->getAdminParentCategoryList()->get();
        if ($parentCategories->isEmpty()) {
            return response()->json(['Could not fetch parent categories with relations.'], Response::HTTP_NOT_FOUND);
        }

        return ParentCategoryIndexResource::collection($parentCategories);
    }

    /**
     * @param ParentCategoryStoreRequest $request
     * @return JsonResponse
     */
    public function storeParentCategory(ParentCategoryStoreRequest $request): JsonResponse
    {
        $tryToSaveParentCategory = $this->parentCategoryRepository->createParentCategory($request->validated());
        if (!$tryToSaveParentCategory) {
            return response()->json(['message' => 'Failed to create parent category.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return response()->json(['message' => 'Parent category created successfully.'], Response::HTTP_CREATED);
    }

    /**
     * @param string $slug
     * @return ParentCategoryShowResource|JsonResponse
     */
    public function showParentCategoryWithRelations(string $slug): ParentCategoryShowResource|JsonResponse
    {
        try {
            $parentCategory = $this->parentCategoryRepository->getParentCategoryBySlug($slug);
            if (!$parentCategory) {
                return response()->json(['message' => 'ParentCategory not found.'], Response::HTTP_NOT_FOUND);
            }

            return new ParentCategoryShowResource($parentCategory);
        } catch (Exception $e) {
            Log::error("Error trying to find parent category by slug: " . $e->getMessage());
            return response()->json(['message' => 'Error trying to find parent category by slug'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @param ParentCategoryUpdateRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function updateParentCategory(ParentCategoryUpdateRequest $request, int $id): JsonResponse
    {
        $parentCategory = $this->parentCategoryRepository->updateParentCategory($request->validated(), $id);
        if (!$parentCategory) {
            return response()->json(['message' => 'Failed to update parent category.'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response()->json(['message' => 'Parent Category updated successfully.'], Response::HTTP_OK);
    }

    /**
     * @param int $id
     * @return JsonResponse
     */
    public function deleteParentCategory(int $id): JsonResponse
    {
        $tryToDeleteParentCategory = $this->parentCategoryRepository->deleteParentCategory($id);
        if (!$tryToDeleteParentCategory) {
            return response()->json(['message' => 'Failed to delete parent category.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return response()->json(['message' => 'Parent category deleted successfully.'], Response::HTTP_OK);
    }
}
