<?php

namespace Tests\Unit;

use App\Http\Requests\childCat\ChildCategoryStoreRequest;
use App\Http\Requests\childCat\ChildCategoryUpdateRequest;
use App\Http\Resources\childCat\ChildCategoryIndexResource;
use App\Http\Resources\childCat\ChildCategoryShowResource;
use App\Models\ChildCategory;
use App\Repositories\ChildCategoryRepository;
use App\Services\ChildCategoryService;
use Illuminate\Events\Dispatcher;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Log;
use Mockery;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Builder;
use Tests\TestCase;

class ChildCategoryServiceTest extends TestCase
{
    protected ChildCategoryService $childCategoryService;
    protected ChildCategoryRepository $childCategoryRepository;

    public function setUp(): void
    {
        parent::setUp();

        $this->app->bind('events', function () {
            $mockDispatcher = Mockery::mock(Dispatcher::class);
            $mockDispatcher->shouldAllowMockingProtectedMethods();
            $mockDispatcher->shouldReceive('dispatch')->zeroOrMoreTimes();
            return $mockDispatcher;
        });

        $this->childCategoryRepository = Mockery::mock(ChildCategoryRepository::class);
        $this->childCategoryService = new ChildCategoryService($this->childCategoryRepository);
    }

    public function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_get_child_categories_with_relations_returns_resource_collection(): void
    {
        $childCategories = ChildCategory::factory()->count(3)->make();
        $collection = new Collection($childCategories);

        $this->childCategoryRepository->shouldReceive('getChildCategoryWithRelations')
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

        $result = $this->childCategoryService->getChildCategoriesWithRelations();

        $this->assertInstanceOf(AnonymousResourceCollection::class, $result);
        $this->assertEquals(ChildCategoryIndexResource::class, $result->collects);

        $this->assertCount(3, $result->collection);
    }

    public function test_store_child_category_success(): void
    {
        $request = Mockery::mock(ChildCategoryStoreRequest::class);
        $request->shouldReceive('validated')
            ->once()
            ->andReturn(['name' => 'New Category']);

        $this->childCategoryRepository->shouldReceive('createChildCategory')
            ->once()
            ->with(['name' => 'New Category'])
            ->andReturn(true);

        $response = $this->childCategoryService->storeChildCategory($request);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(201, $response->getStatusCode());
        $this->assertEquals(['message' => 'Child category created successfully.'], $response->getData(true));
    }

    public function test_store_child_category_failure(): void
    {
        $request = Mockery::mock(ChildCategoryStoreRequest::class);
        $request->shouldReceive('validated')
            ->once()
            ->andReturn(['name' => 'New Category', 'parent_category_id' => 1]);

        $this->childCategoryRepository->shouldReceive('createChildCategory')
            ->once()
            ->andReturn(false);

        $response = $this->childCategoryService->storeChildCategory($request);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(500, $response->getStatusCode());
        $this->assertEquals(['message' => 'Failed to create child category.'], $response->getData(true));
    }

    public function test_show_child_category_with_relations_success(): void
    {
        Log::shouldReceive('error')->zeroOrMoreTimes();

        $childCategory = ChildCategory::factory()->make(['slug' => 'test-slug', 'name' => 'Test Category']);

        $this->childCategoryRepository->shouldReceive('getChildCategoryBySlug')
            ->with('test-slug')
            ->andReturn($childCategory);

        $result = $this->childCategoryService->showChildCategoryWithRelations('test-slug');

        $this->assertInstanceOf(ChildCategoryShowResource::class, $result);
        $this->assertEquals('test-slug', $result->slug);
        $this->assertEquals('Test Category', $result->name);
    }

    public function test_show_child_category_with_relations_not_found(): void
    {
        Log::shouldReceive('error')->zeroOrMoreTimes();

        $this->childCategoryRepository->shouldReceive('getChildCategoryBySlug')
            ->with('non-existent-slug')
            ->andReturn(null);

        $result = $this->childCategoryService->showChildCategoryWithRelations('non-existent-slug');

        $this->assertInstanceOf(JsonResponse::class, $result);
        $this->assertEquals(404, $result->getStatusCode());
        $this->assertEquals(['message' => 'ChildCategory not found.'], $result->getData(true));
    }

    public function test_show_child_category_with_relations_exception(): void
    {
        Log::shouldReceive('error')->once();

        $this->childCategoryRepository->shouldReceive('getParentCategoryBySlug')
            ->with('some-slug')
            ->andThrow(new \Exception('Simulated DB error'));

        $result = $this->childCategoryService->showChildCategoryWithRelations('some-slug');

        $this->assertInstanceOf(JsonResponse::class, $result);
        $this->assertEquals(500, $result->getStatusCode());
        $this->assertEquals(['message' => 'Error trying to find child category by slug'], $result->getData(true));
    }

    public function test_update_child_category_success(): void
    {
        Log::shouldReceive('error')->zeroOrMoreTimes();

        $request = Mockery::mock(ChildCategoryUpdateRequest::class);
        $request->shouldReceive('validated')
            ->once()
            ->andReturn(['name' => 'Updated Category', 'parent_category_id' => 1]);

        $id = 1;
        $childCategory = ChildCategory::factory()->make(['name' => 'Updated Category']);

        $this->childCategoryRepository->shouldReceive('updateChildCategory')
            ->once()
            ->with(['name' => 'Updated Category', 'parent_category_id' => 1], $id)
            ->andReturn($childCategory);

        $response = $this->childCategoryService->updateChildCategory($request, $id);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertEquals(['message' => 'Child Category updated successfully.'], $response->getData(true));
    }

    public function test_update_child_category_not_found(): void
    {
        Log::shouldReceive('error')->zeroOrMoreTimes();

        $request = Mockery::mock(ChildCategoryUpdateRequest::class);
        $request->shouldReceive('validated')
            ->once()
            ->andReturn(['name' => 'Updated Category', 'parent_category_id' => 1]);

        $id = -1;

        $this->childCategoryRepository->shouldReceive('updateChildCategory')
            ->once()
            ->with(['name' => 'Updated Category', 'parent_category_id' => 1], $id)
            ->andReturn(null);

        $response = $this->childCategoryService->updateChildCategory($request, $id);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(422, $response->getStatusCode());
    }

    public function test_delete_child_category_success(): void
    {
        Log::shouldReceive('error')->zeroOrMoreTimes();
        $id = 1;

        $this->childCategoryRepository->shouldReceive('deleteChildCategory')
            ->once()
            ->with($id)
            ->andReturn(true);

        $response = $this->childCategoryService->deleteChildCategory($id);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(200, $response->getStatusCode());
    }

    public function test_delete_parent_category_failure(): void
    {
        Log::shouldReceive('error')->zeroOrMoreTimes();

        $id = 1;

        $this->childCategoryRepository->shouldReceive('deleteChildCategory')
            ->once()
            ->with($id)
            ->andReturn(false);

        $response = $this->childCategoryService->deleteChildCategory($id);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(500, $response->getStatusCode());
    }
}
