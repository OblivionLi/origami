<?php

namespace App\Http\Controllers;

use App\Http\Requests\childCat\ChildCategoryStoreRequest;
use App\Http\Requests\childCat\ChildCategoryUpdateRequest;
use App\Http\Resources\childCat\ChildCategoryShowResource;
use App\Services\ChildCategoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ChildCategoryController extends Controller
{
    protected ChildCategoryService $childCategoryService;

    public function __construct(ChildCategoryService $childCategoryService)
    {
        $this->childCategoryService = $childCategoryService;
    }

    /**
     * @return AnonymousResourceCollection
     */
    public function index(): AnonymousResourceCollection
    {
        return $this->childCategoryService->getChildCategoriesWithRelations();
    }

    /**
     * @param ChildCategoryStoreRequest $request
     * @return JsonResponse
     */
    public function store(ChildCategoryStoreRequest $request): JsonResponse
    {
        return $this->childCategoryService->storeChildCategory($request);
    }

    /**
     * @param string $slug
     * @return ChildCategoryShowResource|JsonResponse
     */
    public function show(string $slug): ChildCategoryShowResource|JsonResponse
    {
        return $this->childCategoryService->showChildCategoryWithRelations($slug);
    }

    /**
     * @param ChildCategoryUpdateRequest $request
     * @param string $slug
     * @return JsonResponse
     */
    public function update(ChildCategoryUpdateRequest $request, string $slug): JsonResponse
    {
        return $this->childCategoryService->updateChildCategory($request, $slug);
    }

    /**
     * @param $slug
     * @return JsonResponse
     */
    public function destroy($slug): JsonResponse
    {
        return $this->childCategoryService->deleteChildCategory($slug);
    }
}
