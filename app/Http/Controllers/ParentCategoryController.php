<?php

namespace App\Http\Controllers;

use App\Http\Requests\parentCat\ParentCategoryStoreRequest;
use App\Http\Requests\parentCat\ParentCategoryUpdateRequest;
use App\Http\Resources\parentCat\ParentCategoryShowResource;
use App\Services\ParentCategoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ParentCategoryController extends Controller
{
    protected ParentCategoryService $parentCategoryService;

    public function __construct(ParentCategoryService $parentCategoryService)
    {
        $this->parentCategoryService = $parentCategoryService;
    }

    /**
     * @return AnonymousResourceCollection
     */
    public function index(): AnonymousResourceCollection
    {
        return $this->parentCategoryService->getParentCategoriesWithRelations();
    }

    /**
     * @param ParentCategoryStoreRequest $request
     * @return JsonResponse
     */
    public function store(ParentCategoryStoreRequest $request): JsonResponse
    {
        return $this->parentCategoryService->storeParentCategory($request);
    }

    /**
     * @param string $slug
     * @return ParentCategoryShowResource|JsonResponse
     */
    public function show(string $slug): ParentCategoryShowResource|JsonResponse
    {
        return $this->parentCategoryService->showParentCategoryWithRelations($slug);
    }

    /**
     * @param ParentCategoryUpdateRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(ParentCategoryUpdateRequest $request, int $id): JsonResponse
    {
        return $this->parentCategoryService->updateParentCategory($request, $id);
    }

    /**
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        return $this->parentCategoryService->deleteParentCategory($id);
    }
}
