<?php

use App\Http\Requests\ProductImageStoreRequest;
use App\Http\Requests\productImg\ProductImageUpdateRequest;
use App\Models\ProductImage;
use App\Repositories\ProductImageRepository;
use App\Services\ProductImageService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Events\Dispatcher;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProductImageServiceTest extends TestCase
{
    protected ProductImageService $productImageService;
    protected ProductImageRepository $productImageRepository;

    public function setUp(): void
    {
        parent::setUp();

        $this->app->bind('events', function () {
            $mockDispatcher = Mockery::mock(Dispatcher::class);
            $mockDispatcher->shouldAllowMockingProtectedMethods();
            $mockDispatcher->shouldReceive('dispatch')->zeroOrMoreTimes();
            return $mockDispatcher;
        });

        $this->productImageRepository = Mockery::mock(ProductImageRepository::class);
        $this->productImageService = new ProductImageService($this->productImageRepository);
    }

    public function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_store_product_image_success(): void
    {
        Storage::fake('public');
        $productId = 1;
        $file = UploadedFile::fake()->image('test-image.jpg');
        $path = 'productImages/1678886400.test-image.jpg';

        $this->productImageRepository->shouldReceive('getProductImageCount')->once()->with($productId)->andReturn(0);
        $this->productImageRepository->shouldReceive('storeImage')->once()->with($file, 'productImages')->andReturn($path);

        $productImageMock = Mockery::mock('alias:App\Models\ProductImage');
        $productImageMock->shouldReceive('create')
            ->once()
            ->with([
                'product_id' => $productId,
                'name' => basename($path),
                'path' => $path
            ])
            ->andReturn(new ProductImage());

        $request = new ProductImageStoreRequest();
        $request->merge([
            'product_id' => $productId
        ]);
        $request->files->set('image', $file);
        $request->setContainer($this->app)->validateResolved();

        $response = $this->productImageService->storeProductImage($request, $productId);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(201, $response->getStatusCode());
        $this->assertEquals(['message' => 'Image uploaded successfully.'], $response->getData(true));
    }

    public function test_store_product_image_list_reached_limit(): void
    {
        Storage::fake('public');
        $productId = 1;
        $file = UploadedFile::fake()->image('test-image.jpg');

        $this->productImageRepository->shouldReceive('getProductImageCount')
            ->once()
            ->with($productId)
            ->andReturn(5);

        $request = new ProductImageStoreRequest();
        $request->merge([
            'product_id' => $productId
        ]);
        $request->files->set('image', $file);
        $request->setContainer($this->app)->validateResolved();

        $response = $this->productImageService->storeProductImage($request, $productId);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(422, $response->getStatusCode());
        $this->assertEquals(['message' => 'Images list reached its limit.'], $response->getData(true));
    }

    public function test_store_product_image_request_has_no_file(): void
    {
        $productId = 1;

        $this->productImageRepository->shouldReceive('getProductImageCount')
            ->once()
            ->with($productId)
            ->andReturn(2);

        $request = new ProductImageStoreRequest();
        $request->merge([
            'product_id' => $productId
        ]);
        $request->setContainer($this->app);

        $response = $this->productImageService->storeProductImage($request, $productId);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(400, $response->getStatusCode());
        $this->assertEquals(['message' => 'Request image payload is empty.'], $response->getData(true));
    }

    public function test_update_product_image_request_has_no_file(): void
    {
        $productId = 1;

        $request = new ProductImageUpdateRequest();
        $request->merge([
            'product_id' => $productId
        ]);
        $request->setContainer($this->app);

        $response = $this->productImageService->updateProductImage($request, 1);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(400, $response->getStatusCode());
        $this->assertEquals(['message' => 'Request image payload is empty.'], $response->getData(true));
    }

    public function test_update_product_image_success(): void
    {
        Storage::fake('public');
        $productId = 1;
        $imageId = 1;
        $file = UploadedFile::fake()->image('test-image.jpg');
        $oldPath = 'productImages/old-image.jpg';
        $newPath = 'productImages/1678886400.test-image.jpg';

        $mockProductImage = Mockery::mock('alias:App\Models\ProductImage', Model::class);
        $mockProductImage->shouldReceive('find')
            ->once()
            ->with($imageId)
            ->andReturn($mockProductImage);

        $mockProductImage->id = $imageId;
        $mockProductImage->product_id = $productId;
        $mockProductImage->path = $oldPath;
        $mockProductImage->name = basename($oldPath);

        $this->productImageRepository->shouldReceive('storeImage')
            ->once()
            ->with($file, 'productImages')
            ->andReturn($newPath);

        $this->productImageRepository->shouldReceive('deleteImageFile')
            ->once()
            ->with($oldPath)
            ->andReturn();

        $mockProductImage->shouldReceive('save')
            ->once()
            ->andReturn(true);

        $mockProductImage->shouldReceive('setAttribute')
            ->with('name',basename($newPath));
        $mockProductImage->shouldReceive('setAttribute')
            ->with('path',$newPath);

        // Create and populate the request
        $request = new ProductImageUpdateRequest();
        $request->merge([
            'product_id' => $productId
        ]);
        $request->files->set('image', $file);
        $request->setContainer($this->app)->validateResolved();

        $response = $this->productImageService->updateProductImage($request, $imageId);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertEquals(['message' => 'Image updated successfully.'], $response->getData(true));
    }

    public function test_delete_product_image_success(): void
    {
        Log::shouldReceive('error')->zeroOrMoreTimes();

        $this->productImageRepository->shouldReceive('deleteImagesIfExist')
            ->once()
            ->with(1)
            ->andReturn(true);

        $response = $this->productImageService->destroyProductImage(1);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertEquals(['message' => 'Image deleted successfully.'], $response->getData(true));
    }

    public function test_delete_product_image_failure(): void
    {
        Log::shouldReceive('error')->zeroOrMoreTimes();

        $this->productImageRepository->shouldReceive('deleteImagesIfExist')
            ->once()
            ->with(1)
            ->andReturn(false);

        $response = $this->productImageService->destroyProductImage(1);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(500, $response->getStatusCode());
        $this->assertEquals(['message' => 'Failed to delete image.'], $response->getData(true));
    }
}
