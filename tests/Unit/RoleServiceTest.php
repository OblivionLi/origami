<?php


use App\Http\Requests\role\RoleStoreRequest;
use App\Http\Requests\role\RoleUpdateRequest;
use App\Http\Resources\role\RoleIndexResource;
use App\Http\Resources\role\RoleShowResource;
use App\Models\Role;
use App\Repositories\RoleRepository;
use App\Services\RoleService;
use Illuminate\Events\Dispatcher;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Builder;
use Tests\TestCase;

class RoleServiceTest extends TestCase
{
    protected RoleService $roleService;
    protected RoleRepository $roleRepository;

    public function setUp(): void
    {
        parent::setUp();

        $this->app->bind('events', function () {
            $mockDispatcher = Mockery::mock(Dispatcher::class);
            $mockDispatcher->shouldAllowMockingProtectedMethods();
            $mockDispatcher->shouldReceive('dispatch')->zeroOrMoreTimes();
            return $mockDispatcher;
        });

        $this->roleRepository = Mockery::mock(RoleRepository::class);
        $this->roleService = new RoleService($this->roleRepository);
    }

    public function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_get_roles_with_relations_returns_resource_collection(): void
    {
        Log::shouldReceive('error')->zeroOrMoreTimes();
        $roles = Role::factory()->count(3)->make();
        $collection = new Collection($roles);

        $mockBuilder = Mockery::mock(Builder::class);
        $mockBuilder->shouldReceive('get')
            ->once()
            ->andReturn($collection);

        $this->roleRepository->shouldReceive('getRoleWithRelations')
            ->once()
            ->andReturn($mockBuilder);

        $result = $this->roleService->getRolesWithRelations();

        $this->assertInstanceOf(AnonymousResourceCollection::class, $result);
        $this->assertEquals(RoleIndexResource::class, $result->collects);

        $this->assertCount(3, $result->collection);
    }

    public function test_store_role_success(): void
    {
        $request = Mockery::mock(RoleStoreRequest::class);
        $request->shouldReceive('validated')
            ->once()
            ->andReturn(['name' => 'Role Test']);

        $this->roleRepository->shouldReceive('createRole')
            ->once()
            ->with(['name' => 'Role Test'])
            ->andReturn(true);

        $response = $this->roleService->storeRole($request);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(201, $response->getStatusCode());
        $this->assertEquals(['message' => 'Role created successfully.'], $response->getData(true));
    }

    public function test_store_role_failure(): void
    {
        $request = Mockery::mock(RoleStoreRequest::class);
        $request->shouldReceive('validated')
            ->once()
            ->andReturn(['name' => 'Role Test']);

        $this->roleRepository->shouldReceive('createRole')
            ->once()
            ->andReturn(false);

        $response = $this->roleService->storeRole($request);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(500, $response->getStatusCode());
        $this->assertEquals(['message' => 'Failed to create role.'], $response->getData(true));
    }

    public function test_show_role_with_relations_success(): void
    {
        Log::shouldReceive('error')->zeroOrMoreTimes();

        $role = Role::factory()->make(['name' => 'Role Test']);

        $this->roleRepository->shouldReceive('getRoleWithRelations')
            ->with(20)
            ->andReturn($role);

        $result = $this->roleService->showRole(20);

        $this->assertInstanceOf(RoleShowResource::class, $result);
        $this->assertEquals('Role Test', $result->name);
    }

    public function test_show_role_with_relations_not_found(): void
    {
        Log::shouldReceive('error')->zeroOrMoreTimes();

        $this->roleRepository->shouldReceive('getRoleWithRelations')
            ->with(1)
            ->andReturn(null);

        $result = $this->roleService->showRole(1);

        $this->assertInstanceOf(JsonResponse::class, $result);
        $this->assertEquals(404, $result->getStatusCode());
        $this->assertEquals(['message' => 'Role not found.'], $result->getData(true));
    }

    public function test_update_role_success(): void
    {
        Log::shouldReceive('error')->zeroOrMoreTimes();

        $request = Mockery::mock(RoleUpdateRequest::class);
        $request->shouldReceive('validated')
            ->once()
            ->andReturn(['name' => 'Role Test']);

        $role = Role::factory()->make(['name' => 'Role Test']);

        $this->roleRepository->shouldReceive('updateRole')
            ->once()
            ->with(['name' => 'Role Test'], 1)
            ->andReturn($role);

        $response = $this->roleService->updateRole($request, 1);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertEquals(['message' => 'Role updated successfully.'], $response->getData(true));
    }

    public function test_update_role_not_found(): void
    {
        Log::shouldReceive('error')->zeroOrMoreTimes();

        $request = Mockery::mock(RoleUpdateRequest::class);
        $request->shouldReceive('validated')
            ->once()
            ->andReturn(['name' => 'Role Test']);

        $this->roleRepository->shouldReceive('updateRole')
            ->once()
            ->with(['name' => 'Role Test'], 2)
            ->andReturn(null);

        $response = $this->roleService->updateRole($request, 2);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(422, $response->getStatusCode());
    }

    public function test_delete_role_success(): void
    {
        Log::shouldReceive('error')->zeroOrMoreTimes();

        $this->roleRepository->shouldReceive('deleteRole')
            ->once()
            ->with(1)
            ->andReturn(true);

        $response = $this->roleService->destroyRole(1);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(200, $response->getStatusCode());
    }

    public function test_delete_role_failure(): void
    {
        Log::shouldReceive('error')->zeroOrMoreTimes();

        $this->roleRepository->shouldReceive('deleteRole')
            ->once()
            ->with(1)
            ->andReturn(false);

        $response = $this->roleService->destroyRole(1);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(500, $response->getStatusCode());
    }
}
