<?php

namespace App\Services;

use App\Http\Requests\product\ProductStoreRequest;
use App\Http\Requests\product\ProductUpdateRequest;
use App\Http\Resources\product\ProductIndexResource;
use App\Http\Resources\product\ProductShowResource;
use App\Models\ChildCategory;
use App\Models\ParentCategory;
use App\Models\Product;
use App\Repositories\ProductRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpFoundation\Response;

class ProductService
{
    protected ProductRepository $productRepository;

    public function __construct(ProductRepository $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    /**
     * @return AnonymousResourceCollection
     */
    public function getProductsWithRelations(): AnonymousResourceCollection
    {
        return ProductIndexResource::collection($this->productRepository->getProductWithRelations()->get());
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
     * @param string $slug
     * @return JsonResponse
     */
    public function updateProduct(ProductUpdateRequest $request, string $slug): JsonResponse
    {
        $product = $this->productRepository->updateProduct($request->validated(), $slug);
        if (!$product) {
            return response()->json(['message' => 'Failed to update product.'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response()->json(['message' => 'Product updated successfully.'], Response::HTTP_OK);
    }

    /**
     * @param string $slug
     * @return JsonResponse
     */
    public function destroyProduct(string $slug): JsonResponse
    {
        $tryToDeleteProduct = $this->productRepository->deleteProduct($slug);
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

        return response()->json($showcase, 200);
    }

    /**
     * @param string $category
     * @return JsonResponse
     */
    public function getProductsByCategory(string $category): JsonResponse
    {
        $parentCategory = ParentCategory::where('name', $category)->first();
        if (!$parentCategory) {
            return response()->json(['message' => 'Category does not exist'], 422);
        }

        $productsWithPag = Product::info()->where('parent_category_id', $category->id)->paginate(6);
        $products = Product::info()->where('parent_category_id', $category->id)->get();
        $childCat = ChildCategory::info()->where('parent_category_id', $category->id)->get();

        $data = [
            'productsWithPag' => $productsWithPag,
            'products' => $products,
            'childCat' => $childCat
        ];

        return response()->json($data, 200);
    }

    /**
     * @return JsonResponse
     */
    public function getProductsBySpecialOffers(): JsonResponse
    {
        $products = $this->productRepository->getProductsBySpecialOffers();
        if (!$products) {
            return response()->json(['message' => 'Products does not exist'], 422);
        }
        return response()->json($products, 200);
    }
}
