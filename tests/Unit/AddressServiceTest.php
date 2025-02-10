<?php

namespace Tests\Unit;

use App\Http\Requests\address\AddressStoreRequest;
use App\Http\Requests\address\AddressUpdateRequest;
use App\Http\Resources\address\AddressIndexResource;
use App\Http\Resources\address\AddressShowResource;
use App\Models\Address;
use App\Models\User;
use App\Repositories\AddressRepository;
use App\Services\AddressService;
use Exception;
use Illuminate\Events\Dispatcher;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Log;
use Mockery;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Builder;
use Tests\TestCase;

class AddressServiceTest extends TestCase
{
    protected AddressService $addressService;
    protected AddressRepository $addressRepository;
    protected array $addressStoreRequestData;

    public function setUp(): void
    {
        parent::setUp();

        $this->app->bind('events', function () {
            $mockDispatcher = Mockery::mock(Dispatcher::class);
            $mockDispatcher->shouldAllowMockingProtectedMethods();
            $mockDispatcher->shouldReceive('dispatch')->zeroOrMoreTimes();
            return $mockDispatcher;
        });

        $this->addressRepository = Mockery::mock(AddressRepository::class);
        $this->addressService = new AddressService($this->addressRepository);

        $this->addressStoreRequestData = [
            'user_id' => 20,
            'name' => 'Joe',
            'surname' => "Doe",
            'country' => 'RO',
            'city' => 'Bucharest',
            'address' => '123 Main Street',
            'postal_code' => '12345',
            'phone_number' => '+40123456789'
        ];
    }

    public function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_get_addresses_with_relations_returns_resource_collection(): void
    {
        $addresses = Address::factory()->count(3)->make();
        $collection = new Collection($addresses);

        $this->addressRepository->shouldReceive('getAddressesWithRelations')
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

        $result = $this->addressService->getAddressesWithRelations();

        $this->assertInstanceOf(AnonymousResourceCollection::class, $result);
        $this->assertEquals(AddressIndexResource::class, $result->collects);

        $this->assertCount(3, $result->collection);
    }

    public function test_store_address_success(): void
    {
        $request = Mockery::mock(AddressStoreRequest::class);
        $request->shouldReceive('validated')
            ->once()
            ->andReturn($this->addressStoreRequestData);

        $this->addressRepository->shouldReceive('createAddress')
            ->once()
            ->with($this->addressStoreRequestData)
            ->andReturn(true);

        $response = $this->addressService->storeAddress($request);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(201, $response->getStatusCode());
        $this->assertEquals(['message' => 'Address created successfully.'], $response->getData(true));
    }

    public function test_store_address_failure(): void
    {
        $request = Mockery::mock(AddressStoreRequest::class);
        $request->shouldReceive('validated')
            ->once()
            ->andReturn($this->addressStoreRequestData);

        $this->addressRepository->shouldReceive('createAddress')
            ->once()
            ->andReturn(false);

        $response = $this->addressService->storeAddress($request);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(500, $response->getStatusCode());
        $this->assertEquals(['message' => 'Failed to create address.'], $response->getData(true));
    }

    public function test_show_address_with_relations_success(): void
    {
        Log::shouldReceive('error')->zeroOrMoreTimes();

        $address = Address::factory()->make($this->addressStoreRequestData);
        $address->setRelation('user', User::factory()->make());

        $this->addressRepository->shouldReceive('getAddressByUserId')
            ->with(20)
            ->andReturn($address);

        $result = $this->addressService->showAddress(20);

        $this->assertInstanceOf(AddressShowResource::class, $result);
        $this->assertEquals('Joe', $result->name);
        $this->assertEquals(20, $result->user_id);
    }

    public function test_show_address_with_relations_not_found(): void
    {
        Log::shouldReceive('error')->zeroOrMoreTimes();

        $this->addressRepository->shouldReceive('getAddressByUserId')
            ->with(1)
            ->andReturn(null);

        $result = $this->addressService->showAddress(1);

        $this->assertInstanceOf(JsonResponse::class, $result);
        $this->assertEquals(404, $result->getStatusCode());
        $this->assertEquals(['message' => 'Address not found.'], $result->getData(true));
    }

    public function test_show_address_with_relations_exception(): void
    {
        Log::shouldReceive('error')->once();

        $this->addressRepository->shouldReceive('getAddressByUserId')
            ->with(1)
            ->andThrow(new Exception('Simulated DB error'));

        $result = $this->addressService->showAddress(1);

        $this->assertInstanceOf(JsonResponse::class, $result);
        $this->assertEquals(500, $result->getStatusCode());
        $this->assertEquals(['message' => 'Error trying to find address by id'], $result->getData(true));
    }

    public function test_update_address_success(): void
    {
        Log::shouldReceive('error')->zeroOrMoreTimes();

        $request = Mockery::mock(AddressUpdateRequest::class);
        $request->shouldReceive('validated')
            ->once()
            ->andReturn($this->addressStoreRequestData);

        $address = Address::factory()->make(['name' => 'Joehedina']);

        $this->addressRepository->shouldReceive('updateAddress')
            ->once()
            ->with($this->addressStoreRequestData, 1)
            ->andReturn($address);

        $response = $this->addressService->updateAddress($request, 1);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertEquals(['message' => 'Address updated successfully.'], $response->getData(true));
    }

    public function test_update_address_not_found(): void
    {
        Log::shouldReceive('error')->zeroOrMoreTimes();

        $request = Mockery::mock(AddressUpdateRequest::class);
        $request->shouldReceive('validated')
            ->once()
            ->andReturn($this->addressStoreRequestData);

        $this->addressRepository->shouldReceive('updateAddress')
            ->once()
            ->with($this->addressStoreRequestData, 2)
            ->andReturn(null);

        $response = $this->addressService->updateAddress($request, 2);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(422, $response->getStatusCode());
    }

    public function test_delete_address_success(): void
    {
        Log::shouldReceive('error')->zeroOrMoreTimes();

        $this->addressRepository->shouldReceive('destroyAddress')
            ->once()
            ->with(1)
            ->andReturn(true);

        $response = $this->addressService->destroyAddress(1);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(200, $response->getStatusCode());
    }

    public function test_delete_address_failure(): void
    {
        Log::shouldReceive('error')->zeroOrMoreTimes();

        $this->addressRepository->shouldReceive('destroyAddress')
            ->once()
            ->with(1)
            ->andReturn(false);

        $response = $this->addressService->destroyAddress(1);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(500, $response->getStatusCode());
    }
}
