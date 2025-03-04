<?php

namespace App\Http\Controllers;

use App\Http\Requests\product\ProductStoreRequest;
use App\Http\Requests\product\ProductUpdateRequest;
use App\Http\Resources\product\ProductShowResource;
use App\Services\ProductService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProductController extends Controller
{
    protected ProductService $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    /**
     * @return AnonymousResourceCollection
     */
    public function index(): AnonymousResourceCollection
    {
        return $this->productService->getProductsWithRelations();
    }

    /**
     * @return AnonymousResourceCollection
     */
    public function indexAdmin(): AnonymousResourceCollection
    {
        return $this->productService->getAdminProductsWithRelations();
    }

    /**
     * @param ProductStoreRequest $request
     * @return JsonResponse
     */
    public function store(ProductStoreRequest $request): JsonResponse
    {
        return $this->productService->storeProduct($request);
    }

    /**
     * @param string $slug
     * @return ProductShowResource|JsonResponse
     */
    public function show(string $slug): ProductShowResource | JsonResponse
    {
        return $this->productService->showProduct($slug);
    }

    /**
     * @param ProductUpdateRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(ProductUpdateRequest $request, int $id): JsonResponse
    {
        return $this->productService->updateProduct($request, $id);
    }

    /**
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        return $this->productService->destroyProduct($id);
    }

    /**
     * @return JsonResponse
     */
    public function getShowcaseProducts(): JsonResponse
    {
        return $this->productService->getShowcaseOfProducts();
    }

    /**
     * @param int $childCategoryId
     * @return JsonResponse
     */
    public function getProductByAccessories(int $childCategoryId): JsonResponse
    {
        return $this->productService->getProductsByCategory('Accessories', $childCategoryId);
    }

    /**
     * @param int $childCategoryId
     * @return JsonResponse
     */
    public function getProductByOrigami(int $childCategoryId): JsonResponse
    {
        return $this->productService->getProductsByCategory('Origami', $childCategoryId);
    }

    /**
     * @return JsonResponse
     */
    public function getProductBySpecialOffers(): JsonResponse
    {
        return $this->productService->getProductsBySpecialOffers();
    }
}
