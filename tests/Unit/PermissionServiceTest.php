<?php

namespace Tests\Unit;

use App\Http\Requests\permission\PermissionStoreRequest;
use App\Http\Requests\permission\PermissionUpdateRequest;
use App\Http\Resources\permission\PermissionIndexResource;
use App\Http\Resources\permission\PermissionShowResource;
use App\Models\Permission;
use App\Repositories\PermissionRepository;
use App\Services\PermissionService;
use Illuminate\Events\Dispatcher;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Log;
use Mockery;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Builder;
use Tests\TestCase;

class PermissionServiceTest extends TestCase
{
    protected PermissionService $permissionService;
    protected PermissionRepository $permissionRepository;

    public function setUp(): void
    {
        parent::setUp();

        $this->app->bind('events', function () {
            $mockDispatcher = Mockery::mock(Dispatcher::class);
            $mockDispatcher->shouldAllowMockingProtectedMethods();
            $mockDispatcher->shouldReceive('dispatch')->zeroOrMoreTimes();
            return $mockDispatcher;
        });

        $this->permissionRepository = Mockery::mock(PermissionRepository::class);
        $this->permissionService = new PermissionService($this->permissionRepository);
    }

    public function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_get_permissions_with_relations_returns_resource_collection(): void
    {
        Log::shouldReceive('error')->zeroOrMoreTimes();
        $permissions = Permission::factory()->count(3)->make();
        $collection = new Collection($permissions);

        $mockBuilder = Mockery::mock(Builder::class);
        $mockBuilder->shouldReceive('get')
            ->once()
            ->andReturn($collection);

        $this->permissionRepository->shouldReceive('getPermissionWithRelations')
            ->once()
            ->andReturn($mockBuilder);

        $result = $this->permissionService->getPermissionsWithRelations();

        $this->assertInstanceOf(AnonymousResourceCollection::class, $result);
        $this->assertEquals(PermissionIndexResource::class, $result->collects);

        $this->assertCount(3, $result->collection);
    }

    public function test_store_permission_success(): void
    {
        $request = Mockery::mock(PermissionStoreRequest::class);
        $request->shouldReceive('validated')
            ->once()
            ->andReturn(['name' => 'Permission Test']);

        $this->permissionRepository->shouldReceive('createPermission')
            ->once()
            ->with(['name' => 'Permission Test'])
            ->andReturn(true);

        $response = $this->permissionService->storePermission($request);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(201, $response->getStatusCode());
        $this->assertEquals(['message' => 'Permission created successfully.'], $response->getData(true));
    }

    public function test_store_permission_failure(): void
    {
        $request = Mockery::mock(PermissionStoreRequest::class);
        $request->shouldReceive('validated')
            ->once()
            ->andReturn(['name' => 'Permission Test']);

        $this->permissionRepository->shouldReceive('createPermission')
            ->once()
            ->andReturn(false);

        $response = $this->permissionService->storePermission($request);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(500, $response->getStatusCode());
        $this->assertEquals(['message' => 'Failed to create permission.'], $response->getData(true));
    }

    public function test_show_permission_with_relations_success(): void
    {
        Log::shouldReceive('error')->zeroOrMoreTimes();

        $permission = Permission::factory()->make(['name' => 'Permission Test']);

        $this->permissionRepository->shouldReceive('getPermissionById')
            ->with(20)
            ->andReturn($permission);

        $result = $this->permissionService->showPermission(20);

        $this->assertInstanceOf(PermissionShowResource::class, $result);
        $this->assertEquals('Permission Test', $result->name);
    }

    public function test_show_permission_with_relations_not_found(): void
    {
        Log::shouldReceive('error')->zeroOrMoreTimes();

        $this->permissionRepository->shouldReceive('getPermissionById')
            ->with(1)
            ->andReturn(null);

        $result = $this->permissionService->showPermission(1);

        $this->assertInstanceOf(JsonResponse::class, $result);
        $this->assertEquals(404, $result->getStatusCode());
        $this->assertEquals(['message' => 'Permission not found.'], $result->getData(true));
    }

    public function test_update_permission_success(): void
    {
        Log::shouldReceive('error')->zeroOrMoreTimes();

        $request = Mockery::mock(PermissionUpdateRequest::class);
        $request->shouldReceive('validated')
            ->once()
            ->andReturn(['name' => 'Permission Test']);

        $permission = Permission::factory()->make(['name' => 'Permission Test']);

        $this->permissionRepository->shouldReceive('updatePermission')
            ->once()
            ->with(['name' => 'Permission Test'], 1)
            ->andReturn($permission);

        $response = $this->permissionService->updatePermission($request, 1);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertEquals(['message' => 'Permission updated successfully.'], $response->getData(true));
    }

    public function test_update_permission_not_found(): void
    {
        Log::shouldReceive('error')->zeroOrMoreTimes();

        $request = Mockery::mock(PermissionUpdateRequest::class);
        $request->shouldReceive('validated')
            ->once()
            ->andReturn(['name' => 'Permission Test']);

        $this->permissionRepository->shouldReceive('updatePermission')
            ->once()
            ->with(['name' => 'Permission Test'], 2)
            ->andReturn(null);

        $response = $this->permissionService->updatePermission($request, 2);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(422, $response->getStatusCode());
    }

    public function test_delete_permission_success(): void
    {
        Log::shouldReceive('error')->zeroOrMoreTimes();

        $this->permissionRepository->shouldReceive('deletePermission')
            ->once()
            ->with(1)
            ->andReturn(true);

        $response = $this->permissionService->destroyPermission(1);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(200, $response->getStatusCode());
    }

    public function test_delete_permission_failure(): void
    {
        Log::shouldReceive('error')->zeroOrMoreTimes();

        $this->permissionRepository->shouldReceive('deletePermission')
            ->once()
            ->with(1)
            ->andReturn(false);

        $response = $this->permissionService->destroyPermission(1);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(500, $response->getStatusCode());
    }
}
