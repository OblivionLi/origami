<?php

namespace Tests\Unit;

use App\Http\Requests\parentCat\ParentCategoryStoreRequest;
use App\Http\Requests\parentCat\ParentCategoryUpdateRequest;
use App\Http\Resources\parentCat\ParentCategoryIndexResource;
use App\Http\Resources\parentCat\ParentCategoryShowResource;
use App\Models\ParentCategory;
use App\Repositories\ParentCategoryRepository;
use App\Services\ParentCategoryService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Events\Dispatcher;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Mockery;
use Tests\TestCase;

class ParentCategoryServiceTest extends TestCase
{
    protected ParentCategoryService $parentCategoryService;
    protected ParentCategoryRepository $parentCategoryRepository;

    public function setUp(): void
    {
        parent::setUp();

        $this->app->bind('events', function () {
            $mockDispatcher = Mockery::mock(Dispatcher::class);
            $mockDispatcher->shouldAllowMockingProtectedMethods();
            $mockDispatcher->shouldReceive('dispatch')->zeroOrMoreTimes();
            return $mockDispatcher;
        });

        $this->parentCategoryRepository = Mockery::mock(ParentCategoryRepository::class);
        $this->parentCategoryService = new ParentCategoryService($this->parentCategoryRepository);
    }

    public function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_get_parent_categories_with_relations_returns_resource_collection(): void
    {
        $parentCategories = ParentCategory::factory()->count(3)->make();
        $collection = new Collection($parentCategories);

        $this->parentCategoryRepository->shouldReceive('getParentCategoryWithRelations')
            ->once()
            ->andReturn(
                new class ($collection) extends Builder {
                    public function __construct(public Collection $collection)
                    {
                    }

                    public function get($columns = ['*']): Collection
                    {
                        return $this->collection;
                    }
                }
            );

        $result = $this->parentCategoryService->getParentCategoriesWithRelations();

        $this->assertInstanceOf(AnonymousResourceCollection::class, $result);
        $this->assertEquals(ParentCategoryIndexResource::class, $result->collects);

        $this->assertCount(3, $result->collection);
    }

    public function test_store_parent_category_success(): void
    {
        $request = Mockery::mock(ParentCategoryStoreRequest::class);
        $request->shouldReceive('validated')
            ->once()
            ->andReturn(['name' => 'New Category']);

        $this->parentCategoryRepository->shouldReceive('createParentCategory')
            ->once()
            ->with(['name' => 'New Category'])
            ->andReturn(true);

        $response = $this->parentCategoryService->storeParentCategory($request);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertEquals(['message' => 'Parent category created'], $response->getData(true));
    }

    public function test_store_parent_category_failure(): void
    {
        $request = Mockery::mock(ParentCategoryStoreRequest::class);
        $request->shouldReceive('validated')
            ->once()
            ->andReturn(['name' => 'New Category']);

        $this->parentCategoryRepository->shouldReceive('createParentCategory')
            ->once()
            ->andReturn(false);

        $response = $this->parentCategoryService->storeParentCategory($request);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(500, $response->getStatusCode());
        $this->assertEquals(['message' => 'Parent category store failed'], $response->getData(true));
    }

    public function test_show_parent_category_with_relations_success(): void
    {
        Log::shouldReceive('error')->zeroOrMoreTimes();

        $parentCategory = ParentCategory::factory()->make(['slug' => 'test-slug', 'name' => 'Test Category']);

        $this->parentCategoryRepository->shouldReceive('getParentCategoryBySlug')
            ->with('test-slug')
            ->andReturn($parentCategory);

        $result = $this->parentCategoryService->showParentCategoryWithRelations('test-slug');

        $this->assertInstanceOf(ParentCategoryShowResource::class, $result);
        $this->assertEquals('test-slug', $result->slug);
        $this->assertEquals('Test Category', $result->name);
    }

    public function test_show_parent_category_with_relations_not_found(): void
    {
        Log::shouldReceive('error')->zeroOrMoreTimes();

        $this->parentCategoryRepository->shouldReceive('getParentCategoryBySlug')
            ->with('non-existent-slug')
            ->andReturn(null);

        $result = $this->parentCategoryService->showParentCategoryWithRelations('non-existent-slug');

        $this->assertInstanceOf(JsonResponse::class, $result);
        $this->assertEquals(422, $result->getStatusCode());
        $this->assertEquals(['message' => 'ParentCategory does not exist..'], $result->getData(true));
    }

    public function test_show_parent_category_with_relations_exception(): void
    {
        Log::shouldReceive('error')->once();

        $this->parentCategoryRepository->shouldReceive('getParentCategoryBySlug')
            ->with('some-slug')
            ->andThrow(new \Exception('Simulated DB error'));

        $result = $this->parentCategoryService->showParentCategoryWithRelations('some-slug');

        $this->assertInstanceOf(JsonResponse::class, $result);
        $this->assertEquals(500, $result->getStatusCode());
        $this->assertEquals(['message' => 'Error trying to find parent category by slug'], $result->getData(true));
    }

    public function test_update_parent_category_success(): void
    {
        Log::shouldReceive('error')->zeroOrMoreTimes();

        $request = Mockery::mock(ParentCategoryUpdateRequest::class);
        $request->shouldReceive('validated')
            ->once()
            ->andReturn(['name' => 'Updated Category']);

        $slug = 'existing-slug';
        $parentCategory = ParentCategory::factory()->make(['name' => 'Updated Category']);

        $this->parentCategoryRepository->shouldReceive('updateParentCategory')
            ->once()
            ->with(['name' => 'Updated Category'], $slug)
            ->andReturn($parentCategory);

        $response = $this->parentCategoryService->updateParentCategory($request, $slug);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertEquals(['message', 'Parent Category update success'], $response->getData(true));
    }

    public function test_update_parent_category_not_found(): void
    {
        Log::shouldReceive('error')->zeroOrMoreTimes();

        $request = Mockery::mock(ParentCategoryUpdateRequest::class);
        $request->shouldReceive('validated')
            ->once()
            ->andReturn(['name' => 'Updated Category']);

        $slug = 'non-existing-slug';

        $this->parentCategoryRepository->shouldReceive('updateParentCategory')
            ->once()
            ->with(['name' => 'Updated Category'], $slug)
            ->andReturn(null);

        $response = $this->parentCategoryService->updateParentCategory($request, $slug);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(422, $response->getStatusCode());
    }

    public function test_delete_parent_category_success(): void
    {
        Log::shouldReceive('error')->zeroOrMoreTimes();
        $slug = 'existing-slug';

        $this->parentCategoryRepository->shouldReceive('deleteParentCategory')
            ->once()
            ->with($slug)
            ->andReturn(true);

        $response = $this->parentCategoryService->deleteParentCategory($slug);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(200, $response->getStatusCode());
    }

    public function test_delete_parent_category_failure(): void
    {
        Log::shouldReceive('error')->zeroOrMoreTimes();

        $slug = 'non-existing-slug';

        $this->parentCategoryRepository->shouldReceive('deleteParentCategory')
            ->once()
            ->with($slug)
            ->andReturn(false);

        $response = $this->parentCategoryService->deleteParentCategory($slug);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(422, $response->getStatusCode());
    }
}
