<?php

namespace App\Services;

use App\Http\Requests\product\ProductStoreRequest;
use App\Http\Requests\product\ProductUpdateRequest;
use App\Http\Resources\product\ProductAdminIndexResource;
use App\Http\Resources\product\ProductIndexResource;
use App\Http\Resources\product\ProductShowResource;
use App\Models\ChildCategory;
use App\Models\ParentCategory;
use App\Models\Product;
use App\Repositories\ChildCategoryRepository;
use App\Repositories\ParentCategoryRepository;
use App\Repositories\ProductRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpFoundation\Response;

class ProductService
{
    protected ProductRepository $productRepository;
    protected ParentCategoryRepository $parentCategoryRepository;
    protected ChildCategoryRepository $childCategoryRepository;

    public function __construct(
        ProductRepository $productRepository,
        ParentCategoryRepository $parentCategoryRepository,
        ChildCategoryRepository $childCategoryRepository
    )
    {
        $this->productRepository = $productRepository;
        $this->parentCategoryRepository = $parentCategoryRepository;
        $this->childCategoryRepository = $childCategoryRepository;
    }

    /**
     * @return AnonymousResourceCollection
     */
    public function getProductsWithRelations(): AnonymousResourceCollection
    {
        return ProductIndexResource::collection($this->productRepository->getProductWithRelations()->get());
    }

    /**
     * @return AnonymousResourceCollection
     */
    public function getAdminProductsWithRelations(): AnonymousResourceCollection
    {
        return ProductAdminIndexResource::collection($this->productRepository->getAdminProductWithRelations()->get());
    }

    /**
     * @param ProductStoreRequest $request
     * @return JsonResponse
     */
    public function storeProduct(ProductStoreRequest $request): JsonResponse
    {
        $savedProduct = $this->productRepository->createProduct($request->validated());
        if (!$savedProduct) {
            return response()->json(['message' => 'Failed to store product.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return response()->json(['message' => 'Product created successfully.'], Response::HTTP_CREATED);
    }

    /**
     * @param string $slug
     * @return ProductShowResource|JsonResponse
     */
    public function showProduct(string $slug): ProductShowResource|JsonResponse
    {
        $product = $this->productRepository->getProductBySlug($slug);
        if (!$product) {
            return response()->json(['message' => 'Product not found.'], Response::HTTP_NOT_FOUND);
        }

        return new ProductShowResource($product);
    }

    /**
     * @param ProductUpdateRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function updateProduct(ProductUpdateRequest $request, int $id): JsonResponse
    {
        $product = $this->productRepository->updateProduct($request->validated(), $id);
        if (!$product) {
            return response()->json(['message' => 'Failed to update product.'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response()->json(['message' => 'Product updated successfully.'], Response::HTTP_OK);
    }

    /**
     * @param int $id
     * @return JsonResponse
     */
    public function destroyProduct(int $id): JsonResponse
    {
        $tryToDeleteProduct = $this->productRepository->deleteProduct($id);
        if (!$tryToDeleteProduct) {
            return response()->json(['message' => 'Failed to delete product.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return response()->json(['message' => 'Product delete successfully.'], Response::HTTP_OK);
    }

    /**
     * @return JsonResponse
     */
    public function getShowcaseOfProducts(): JsonResponse
    {
        $showcase = [
            'latestProducts' => $this->productRepository->getLatestProductsWithRelations()->get(),
            'latestDiscounts' => $this->productRepository->getLatestDiscountedProductsWithRelations()->get(),
            'mostCommented' => $this->productRepository->getMostCommentedProductsWithRelations()->get(),
        ];

        return response()->json($showcase, Response::HTTP_OK);
    }

    /**
     * @param string $category
     * @param int $childCategoryId
     * @return JsonResponse
     */
    public function getProductsByCategory(string $category, int $childCategoryId): JsonResponse
    {
        $parentCategory = $this->parentCategoryRepository->getParentCategoryByName($category);
        if (!$parentCategory) {
            return response()->json(['message' => 'Category not found.'], Response::HTTP_NOT_FOUND);
        }

        $products = $this->productRepository->getProductsWithRelationsByParentCategory($parentCategory->id, $childCategoryId)->paginate(6);
        $childCategories = $this->childCategoryRepository->getChildCategoryByParentCategoryId($parentCategory->id)->get();

        $data = [
            'products' => $products,
            'childCategories' => $childCategories
        ];

        return response()->json($data, Response::HTTP_OK);
    }

    /**
     * @return JsonResponse
     */
    public function getProductsBySpecialOffers(): JsonResponse
    {
        $products = $this->productRepository->getProductsBySpecialOffers()->paginate(6);
        if (!$products) {
            return response()->json(['message' => 'Products does not exist'], Response::HTTP_NOT_FOUND);
        }
        return response()->json(['products' => $products], Response::HTTP_OK);
    }
}
