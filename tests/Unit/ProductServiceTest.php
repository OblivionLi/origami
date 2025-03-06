<?php


use App\Http\Requests\product\ProductStoreRequest;
use App\Http\Requests\product\ProductUpdateRequest;
use App\Http\Resources\product\ProductAdminIndexResource;
use App\Http\Resources\product\ProductIndexResource;
use App\Http\Resources\product\ProductShowResource;
use App\Models\Product;
use App\Repositories\ChildCategoryRepository;
use App\Repositories\ParentCategoryRepository;
use App\Repositories\ProductRepository;
use App\Services\ProductService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Builder;
use Mockery\MockInterface;
use Symfony\Component\HttpFoundation\Response;
use Tests\TestCase;

class ProductServiceTest extends TestCase
{
    private ProductService $productService;
    private MockInterface $productRepository;
    private MockInterface $parentCategoryRepository;
    private MockInterface $childCategoryRepository;

    public function setUp(): void
    {
        parent::setUp();

        $this->productRepository = Mockery::mock(ProductRepository::class);
        $this->parentCategoryRepository = Mockery::mock(ParentCategoryRepository::class);
        $this->childCategoryRepository = Mockery::mock(ChildCategoryRepository::class);

        $this->productService = new ProductService(
            $this->productRepository,
            $this->parentCategoryRepository,
            $this->childCategoryRepository
        );
    }

    public function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_get_products_with_relations_returns_resource_collection(): void
    {
        $products = Product::factory()->count(3)->make();
        $collection = new Collection($products);

        $mockBuilder = Mockery::mock(Builder::class);
        $mockBuilder->shouldReceive('get')
            ->once()
            ->andReturn($collection);

        $this->productRepository->shouldReceive('getProductWithRelations')
            ->once()
            ->andReturn($mockBuilder);

        $result = $this->productService->getProductsWithRelations();

        $this->assertInstanceOf(AnonymousResourceCollection::class, $result);
        $this->assertEquals(ProductIndexResource::class, $result->collects);
        $this->assertCount(3, $result->collection);
    }

    public function test_get_admin_products_with_relations_returns_resource_collection(): void
    {
        $products = Product::factory()->count(3)->make();
        $collection = new Collection($products);

        $mockBuilder = Mockery::mock(Builder::class);
        $mockBuilder->shouldReceive('get')
            ->once()
            ->andReturn($collection);

        $this->productRepository->shouldReceive('getAdminProductWithRelations')
            ->once()
            ->andReturn($mockBuilder);

        $result = $this->productService->getAdminProductsWithRelations();

        $this->assertInstanceOf(AnonymousResourceCollection::class, $result);
        $this->assertEquals(ProductAdminIndexResource::class, $result->collects);
        $this->assertCount(3, $result->collection);
    }

    public function test_store_product_success(): void
    {
        $request = Mockery::mock(ProductStoreRequest::class);
        $request->shouldReceive('validated')
            ->once()
            ->andReturn(['name' => 'Product 001']);

        $mockProduct = Mockery::mock(Product::class);

        $this->productRepository->shouldReceive('createProduct')
            ->once()
            ->with(['name' => 'Product 001'])
            ->andReturn($mockProduct);

        $response = $this->productService->storeProduct($request);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(Response::HTTP_CREATED, $response->getStatusCode());
        $this->assertEquals(['message' => 'Product created successfully.'], $response->getData(true));
    }

    public function test_store_product_failed(): void
    {
        $request = Mockery::mock(ProductStoreRequest::class);
        $request->shouldReceive('validated')
            ->once()
            ->andReturn(['name' => 'Product 001']);

        $this->productRepository->shouldReceive('createProduct')
            ->once()
            ->with(['name' => 'Product 001'])
            ->andReturn(null);

        $response = $this->productService->storeProduct($request);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(Response::HTTP_INTERNAL_SERVER_ERROR, $response->getStatusCode());
        $this->assertEquals(['message' => 'Failed to store product.'], $response->getData(true));
    }

    public function test_show_product_with_relations_success(): void
    {
        $slug = "product-001";
        $mockProduct = Mockery::mock(Product::class);
        $mockProduct->shouldReceive('getAttribute')->with('name')->andReturn('Product 001');

        $this->productRepository->shouldReceive('getProductBySlug')
            ->once()
            ->with($slug)
            ->andReturn($mockProduct);

        $result = $this->productService->showProduct($slug);

        $this->assertInstanceOf(ProductShowResource::class, $result);
        $this->assertEquals('Product 001', $result->resource->name);
    }

    public function test_show_product_with_relations_failed(): void
    {
        $slug = "product-001";

        $this->productRepository->shouldReceive('getProductBySlug')
            ->once()
            ->with($slug)
            ->andReturn(null);

        $result = $this->productService->showProduct($slug);

        $this->assertInstanceOf(JsonResponse::class, $result);
        $this->assertEquals(Response::HTTP_NOT_FOUND, $result->getStatusCode());
        $this->assertEquals(['message' => 'Product not found.'], $result->getData(true));
    }

    public function test_update_product_success(): void
    {
        $request = Mockery::mock(ProductUpdateRequest::class);
        $request->shouldReceive('validated')
            ->once()
            ->andReturn(['name' => 'Product 001']);

        $productId = 1;

        $mockProduct = Mockery::mock(Product::class);


        $this->productRepository->shouldReceive('updateProduct')
            ->once()
            ->with(['name' => 'Product 001'], $productId)
            ->andReturn($mockProduct);

        $response = $this->productService->updateProduct($request, $productId);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(Response::HTTP_OK, $response->getStatusCode());
        $this->assertEquals(['message' => 'Product updated successfully.'], $response->getData(true));
    }

    public function test_update_product_failed(): void
    {
        $request = Mockery::mock(ProductUpdateRequest::class);
        $request->shouldReceive('validated')
            ->once()
            ->andReturn(['name' => 'Product 001']);

        $productId = 1;

        $this->productRepository->shouldReceive('updateProduct')
            ->once()
            ->with(['name' => 'Product 001'], $productId)
            ->andReturn(null);

        $response = $this->productService->updateProduct($request, $productId);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(Response::HTTP_UNPROCESSABLE_ENTITY, $response->getStatusCode());
        $this->assertEquals(['message' => 'Failed to update product.'], $response->getData(true));
    }

    public function test_delete_product_success(): void
    {
        $productId = 1;

        $this->productRepository->shouldReceive('deleteProduct')
            ->once()
            ->with($productId)
            ->andReturn(true);

        $response = $this->productService->destroyProduct($productId);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(Response::HTTP_OK, $response->getStatusCode());
        $this->assertEquals(['message' => 'Product delete successfully.'], $response->getData(true));
    }

    public function test_delete_product_failed(): void
    {
        $productId = 1;

        $this->productRepository->shouldReceive('deleteProduct')
            ->once()
            ->with($productId)
            ->andReturn(false);

        $response = $this->productService->destroyProduct($productId);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(Response::HTTP_INTERNAL_SERVER_ERROR, $response->getStatusCode());
        $this->assertEquals(['message' => 'Failed to delete product.'], $response->getData(true));
    }

    public function test_get_showcase_of_products(): void
    {
        $latestProducts = Product::factory()->count(3)->make();
        $latestDiscounts = Product::factory()->count(2)->make();
        $mostCommented = Product::factory()->count(4)->make();

        $latestProductsCollection = new Collection($latestProducts);
        $latestDiscountsCollection = new Collection($latestDiscounts);
        $mostCommentedCollection = new Collection($mostCommented);


        $this->productRepository->shouldReceive('getLatestProductsWithRelations')
            ->once()
            ->andReturn($mockBuilder = Mockery::mock(Builder::class));

        $mockBuilder->shouldReceive('get')
            ->once()
            ->andReturn($latestProductsCollection);

        $this->productRepository->shouldReceive('getLatestDiscountedProductsWithRelations')
            ->once()
            ->andReturn($mockBuilder = Mockery::mock(Builder::class));

        $mockBuilder->shouldReceive('get')
            ->once()
            ->andReturn($latestDiscountsCollection);

        $this->productRepository->shouldReceive('getMostCommentedProductsWithRelations')
            ->once()
            ->andReturn($mockBuilder = Mockery::mock(Builder::class));

        $mockBuilder->shouldReceive('get')
            ->once()
            ->andReturn($mostCommentedCollection);

        $response = $this->productService->getShowcaseOfProducts();

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(Response::HTTP_OK, $response->getStatusCode());

        $data = $response->getData(true);
        $this->assertArrayHasKey('latestProducts', $data);
        $this->assertArrayHasKey('latestDiscounts', $data);
        $this->assertArrayHasKey('mostCommented', $data);
        $this->assertCount(3, $data['latestProducts']);
        $this->assertCount(2, $data['latestDiscounts']);
        $this->assertCount(4, $data['mostCommented']);
    }

    public function test_get_products_by_category_category_not_found(): void
    {
        $categoryName = 'nonexistent-category';
        $childCategoryId = 1;

        $this->parentCategoryRepository->shouldReceive('getParentCategoryByName')
            ->once()
            ->with($categoryName)
            ->andReturn(null);

        $response = $this->productService->getProductsByCategory($categoryName, $childCategoryId);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(Response::HTTP_NOT_FOUND, $response->getStatusCode());
        $this->assertEquals(['message' => 'Category not found.'], $response->getData(true));
    }
    public function test_get_products_by_special_offers_success(): void
    {
        $mockBuilder = Mockery::mock(Builder::class);
        $mockProducts = Mockery::mock(LengthAwarePaginator::class);

        $mockProducts->shouldReceive('jsonSerialize')->andReturn([]);


        $this->productRepository->shouldReceive('getProductsBySpecialOffers')
            ->once()
            ->andReturn($mockBuilder);

        $mockBuilder->shouldReceive('paginate')
            ->once()
            ->with(6)
            ->andReturn($mockProducts);

        $response = $this->productService->getProductsBySpecialOffers();

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(Response::HTTP_OK, $response->getStatusCode());
        $data = $response->getData(true);
        $this->assertArrayHasKey('products', $data);
    }

    public function test_get_products_by_special_offers_not_found(): void
    {
        $mockBuilder = Mockery::mock(Builder::class);
        $mockProducts = Mockery::mock(LengthAwarePaginator::class);

        $this->productRepository->shouldReceive('getProductsBySpecialOffers')
            ->once()
            ->andReturn($mockBuilder);
        $mockBuilder->shouldReceive('paginate')
            ->once()
            ->with(6)
            ->andReturn(null);

        $response = $this->productService->getProductsBySpecialOffers();

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(Response::HTTP_NOT_FOUND, $response->getStatusCode());
        $this->assertEquals(['message' => 'Products does not exist'], $response->getData(true));
    }
}
