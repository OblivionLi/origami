<?php

namespace App\Http\Controllers;

use App\Http\Requests\address\AddressStoreRequest;
use App\Http\Requests\address\AddressUpdateRequest;
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
     * @return JsonResponse|AnonymousResourceCollection
     */
    public function show($id): JsonResponse|AnonymousResourceCollection
    {
        return $this->addressService->showAddress($id);
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
