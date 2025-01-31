<?php

namespace App\Services;

use App\Http\Requests\address\AddressStoreRequest;
use App\Http\Requests\address\AddressUpdateRequest;
use App\Http\Resources\address\AddressIndexResource;
use App\Http\Resources\address\AddressShowResource;
use App\Models\Address;
use App\Repositories\AddressRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AddressService
{
    // TODO:: Fix status codes for all controllers
    protected AddressRepository $addressRepository;

    public function __construct(AddressRepository $addressRepository)
    {
        $this->addressRepository = $addressRepository;
    }

    /**
     * @return JsonResponse|AnonymousResourceCollection
     */
    public function getAddressesWithRelations(): JsonResponse|AnonymousResourceCollection
    {
        $addresses = $this->addressRepository->getRoleWithRelations()->get();
        if ($addresses->isEmpty()) {
            return response()->json(['Could not fetch addresses with relations.'], 404);
        }

        return AddressIndexResource::collection($addresses);
    }

    /**
     * @param AddressStoreRequest $request
     * @return JsonResponse
     */
    public function storeAddress(AddressStoreRequest $request): JsonResponse
    {
        $tryToStoreAddress = $this->addressRepository->storeAddress($request);
        if (!$tryToStoreAddress) {
            return response()->json(['Could not create address.'], 500);
        }

        return response()->json(['Address created'], 201);
    }

    /**
     * @param int $id
     * @return JsonResponse|AnonymousResourceCollection
     */
    public function showAddress(int $id): JsonResponse|AnonymousResourceCollection
    {
        $address = Address::where('user_id', $id)->first();
        if (!$address) {
            return response()->json(['Address not found.'], 404);
        }

        return AddressShowResource::collection($address);
    }

    /**
     * @param AddressUpdateRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function updateAddress(AddressUpdateRequest $request, int $id): JsonResponse
    {
        $tryToUpdateAddress = $this->addressRepository->updateAddress($request, $id);
        if (!$tryToUpdateAddress) {
            return response()->json(['Could not update address.'], 500);
        }

        return response()->json(['Address updated'], 200);
    }

    /**
     * @param int $id
     * @return JsonResponse
     */
    public function destroyAddress(int $id): JsonResponse
    {
        $tryToDeleteAddress = $this->addressRepository->destroyAddress($id);
        if (!$tryToDeleteAddress) {
            return response()->json(['Could not delete address.'], 500);
        }

        return response()->json(['Address deleted'], 200);
    }
}
