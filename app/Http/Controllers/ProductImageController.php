<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductImageStoreRequest;
use App\Http\Requests\productImg\ProductImageUpdateRequest;
use App\Services\ProductImageService;
use Illuminate\Http\JsonResponse;

class ProductImageController extends Controller
{
    protected ProductImageService $productImageService;

    public function __construct(ProductImageService $productImageService)
    {
        $this->productImageService = $productImageService;
    }

    /**
     * @param ProductImageStoreRequest $request
     * @return JsonResponse
     */
    public function store(ProductImageStoreRequest $request): JsonResponse
    {
        return $this->productImageService->storeProductImage($request);
    }

    /**
     * @param ProductImageUpdateRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(ProductImageUpdateRequest $request, int $id): JsonResponse
    {
        return $this->productImageService->updateProductImage($request, $id);
    }

    /**
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        return $this->productImageService->destroyProductImage($id);
    }
}
