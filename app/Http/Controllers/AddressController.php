<?php

namespace App\Http\Controllers;

use App\Http\Requests\address\AddressStoreRequest;
use App\Http\Requests\address\AddressUpdateRequest;
use App\Http\Resources\address\AddressShowResource;
use App\Services\AddressService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AddressController extends Controller
{
    protected AddressService $addressService;

    public function __construct(AddressService $addressService)
    {
        $this->addressService = $addressService;
    }

    /**
     * @return JsonResponse|AnonymousResourceCollection
     */
    public function index(): JsonResponse|AnonymousResourceCollection
    {
        return $this->addressService->getAddressesWithRelations();
    }

    /**
     * @param AddressStoreRequest $request
     * @return JsonResponse
     */
    public function store(AddressStoreRequest $request): JsonResponse
    {
        return $this->addressService->storeAddress($request);
    }

    /**
     * @param $id
     * @return JsonResponse|AddressShowResource
     */
    public function show($id): JsonResponse|AddressShowResource
    {
        return $this->addressService->showAddress($id);
    }

    /**
     * @param $id
     * @return JsonResponse|AddressShowResource
     */
    public function showOrderAddress($id): JsonResponse|AddressShowResource
    {
        return $this->addressService->showOrderAddress($id);
    }

    /**
     * @param AddressUpdateRequest $request
     * @param $id
     * @return JsonResponse
     */
    public function update(AddressUpdateRequest $request, $id): JsonResponse
    {
        return $this->addressService->updateAddress($request, $id);
    }

    /**
     * @param $id
     * @return JsonResponse
     */
    public function destroy($id): JsonResponse
    {
        return $this->addressService->destroyAddress($id);
    }
}
