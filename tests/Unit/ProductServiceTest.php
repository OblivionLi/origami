<?php


use App\Http\Requests\product\ProductStoreRequest;
use App\Http\Requests\product\ProductUpdateRequest;
use App\Http\Resources\product\ProductIndexResource;
use App\Http\Resources\product\ProductShowResource;
use App\Models\Product;
use App\Models\User;
use App\Repositories\ProductRepository;
use App\Services\ProductService;
use Illuminate\Events\Dispatcher;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Builder;
use Tests\TestCase;

class ProductServiceTest extends TestCase
{
    protected ProductService $productService;
    protected ProductRepository $productRepository;

    public function setUp(): void
    {
        parent::setUp();

        $this->app->bind('events', function () {
            $mockDispatcher = Mockery::mock(Dispatcher::class);
            $mockDispatcher->shouldAllowMockingProtectedMethods();
            $mockDispatcher->shouldReceive('dispatch')->zeroOrMoreTimes();
            return $mockDispatcher;
        });

        $this->productRepository = Mockery::mock(ProductRepository::class);
        $this->productService = new ProductService($this->productRepository);
    }

    public function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_get_products_with_relations_returns_resource_collection(): void
    {
        Log::shouldReceive('error')->zeroOrMoreTimes();
        $products = Product::factory()->count(3)->make();
        $collection = new Collection($products);

        $mockBuilder = Mockery::mock(Builder::class);
        $mockBuilder->shouldReceive('get')
            ->once()
            ->andReturn($collection);

        $this->productRepository->shouldReceive('getProductWithRelations')
            ->once()
            ->with()
            ->andReturn($mockBuilder);

        $result = $this->productService->getProductsWithRelations();

        $this->assertInstanceOf(AnonymousResourceCollection::class, $result);
        $this->assertEquals(ProductIndexResource::class, $result->collects);

        $this->assertCount(3, $result->collection);
    }

    public function test_store_product_success(): void
    {
        $request = Mockery::mock(ProductStoreRequest::class);
        $request->shouldReceive('validated')
            ->once()
            ->andReturn(['name' => 'Product 001']);

        $this->productRepository->shouldReceive('createProduct')
            ->once()
            ->with(['name' => 'Product 001'])
            ->andReturn(new Product());

        $response = $this->productService->storeProduct($request);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(201, $response->getStatusCode());
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
        $this->assertEquals(500, $response->getStatusCode());
        $this->assertEquals(['message' => 'Failed to store product.'], $response->getData(true));
    }

    public function test_show_product_with_relations_success(): void
    {
        Log::shouldReceive('error')->zeroOrMoreTimes();

        $product = Product::factory()->make(['name' => 'Product 001']);

        $slug = "product-001";
        $this->productRepository->shouldReceive('getProductBySlug')
            ->with($slug)
            ->andReturn($product);

        $result = $this->productService->showProduct($slug);

        $this->assertInstanceOf(ProductShowResource::class, $result);
        $this->assertEquals('Product 001', $result->name);
    }

    public function test_show_product_with_relations_failed(): void
    {
        Log::shouldReceive('error')->zeroOrMoreTimes();

        $slug = "product-001";
        $this->productRepository->shouldReceive('getProductBySlug')
            ->with($slug)
            ->andReturn(null);

        $result = $this->productService->showProduct($slug);

        $this->assertInstanceOf(JsonResponse::class, $result);
        $this->assertEquals(['message' => 'Product not found.'], $result->getData(true));
    }

    public function test_update_product_success(): void
    {
        Log::shouldReceive('error')->zeroOrMoreTimes();

        $request = Mockery::mock(ProductUpdateRequest::class);
        $request->shouldReceive('validated')
            ->once()
            ->andReturn(['name' => 'Product 001']);

        $product = Product::factory()->make(['name' => 'Product 001']);

        $slug = 'product-001';
        $this->productRepository->shouldReceive('updateProduct')
            ->once()
            ->with(['name' => 'Product 001'], $slug)
            ->andReturn($product);

        $response = $this->productService->updateProduct($request, $slug);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertEquals(['message' => 'Product updated successfully.'], $response->getData(true));
    }

    public function test_update_product_failed(): void
    {
        Log::shouldReceive('error')->zeroOrMoreTimes();

        $request = Mockery::mock(ProductUpdateRequest::class);
        $request->shouldReceive('validated')
            ->once()
            ->andReturn(['name' => 'Product 001']);

        $slug = 'product-001';
        $this->productRepository->shouldReceive('updateProduct')
            ->once()
            ->with(['name' => 'Product 001'], $slug)
            ->andReturn(null);

        $response = $this->productService->updateProduct($request, $slug);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(422, $response->getStatusCode());
        $this->assertEquals(['message' => 'Failed to update product.'], $response->getData(true));
    }

    public function test_delete_product_success(): void
    {
        Log::shouldReceive('error')->zeroOrMoreTimes();

        $slug = "product-001";
        $this->productRepository->shouldReceive('deleteProduct')
            ->once()
            ->with($slug)
            ->andReturn(true);

        $response = $this->productService->destroyProduct($slug);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertEquals(['message' => 'Product delete successfully.'], $response->getData(true));
    }

    public function test_delete_product_failed(): void
    {
        Log::shouldReceive('error')->zeroOrMoreTimes();

        $slug = "product-001";
        $this->productRepository->shouldReceive('deleteProduct')
            ->once()
            ->with($slug)
            ->andReturn(false);

        $response = $this->productService->destroyProduct($slug);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(500, $response->getStatusCode());
        $this->assertEquals(['message' => 'Failed to delete product.'], $response->getData(true));
    }
}
