<?php

namespace Tests\Unit;

use App\Http\Resources\user\UserIndexResource;
use App\Http\Resources\user\UserShowResource;
use App\Http\Resources\user\UserUpdateResource;
use App\Models\User;
use App\Repositories\UserRepository;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Events\Dispatcher;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;
use Mockery;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Builder;
use Tests\TestCase;

class UserServiceTest extends TestCase
{
    protected UserService $userService;
    protected UserRepository $userRepository;
    protected array $userData;

    public function setUp(): void
    {
        parent::setUp();

        $this->app->bind('events', function () {
            $mockDispatcher = Mockery::mock(Dispatcher::class);
            $mockDispatcher->shouldAllowMockingProtectedMethods();
            $mockDispatcher->shouldReceive('dispatch')->zeroOrMoreTimes();
            return $mockDispatcher;
        });

        $this->userRepository = Mockery::mock(UserRepository::class);
        $this->userService = new UserService($this->userRepository);

        $this->userData = [
            'name' => 'Joe Doe',
            'email' => 'joe@doe.com',
            'password' => 'password',
        ];
    }

    public function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_get_users_with_relations_success(): void
    {
        $users = User::factory()->count(3)->make();
        $collection = new Collection($users);

        $this->userRepository->shouldReceive('getUserWithRelations')
            ->once()
            ->with(null)
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

        $result = $this->userService->getUserWithRelations();

        $this->assertInstanceOf(AnonymousResourceCollection::class, $result);
        $this->assertEquals(UserIndexResource::class, $result->collects);

        $this->assertCount(3, $result->collection);
    }

    public function test_get_users_with_relations_not_found(): void
    {
        Log::shouldReceive('error')->zeroOrMoreTimes();
        $mockBuilder = Mockery::mock(Builder::class);

        $this->userRepository->shouldReceive('getUserWithRelations')
            ->with(null)
            ->once()
            ->andReturn($mockBuilder);

        $mockBuilder->shouldReceive('get')
            ->once()
            ->andReturn(new Collection());

        $result = $this->userService->getUserWithRelations();

        $this->assertInstanceOf(JsonResponse::class, $result);
        $this->assertEquals(404, $result->getStatusCode());
        $this->assertEquals(['message' => 'Could not fetch users with relations.'], $result->getData(true));
    }

    public function test_show_user_with_success(): void
    {
        $user = User::factory()->make(['name' => 'Joe Doe']);

        $this->userRepository->shouldReceive('getUserWithRelations')
            ->once()
            ->with(1)
            ->andReturn($user);

        $result = $this->userService->showUser(1);

        $this->assertInstanceOf(UserShowResource::class, $result);
        $this->assertEquals('Joe Doe', $result->name);
    }

    public function test_show_user_with_not_found(): void
    {
        $this->userRepository->shouldReceive('getUserWithRelations')
            ->once()
            ->with(1)
            ->andReturn(null);

        $result = $this->userService->showUser(1);

        $this->assertInstanceOf(UserShowResource::class, $result);
        $this->assertNull($result->resource);
    }
}
