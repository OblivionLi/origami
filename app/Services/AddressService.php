<?php

namespace App\Services;

use App\Http\Requests\address\AddressStoreRequest;
use App\Http\Requests\address\AddressUpdateRequest;
use App\Http\Resources\address\AddressIndexResource;
use App\Http\Resources\address\AddressShowResource;
use App\Repositories\AddressRepository;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class AddressService
{
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
        $addresses = $this->addressRepository->getAddressesWithRelations()->get();
        if ($addresses->isEmpty()) {
            return response()->json(['Could not fetch addresses with relations.'], Response::HTTP_NOT_FOUND);
        }

        return AddressIndexResource::collection($addresses);
    }

    /**
     * @param AddressStoreRequest $request
     * @return JsonResponse
     */
    public function storeAddress(AddressStoreRequest $request): JsonResponse
    {
        $tryToStoreAddress = $this->addressRepository->createAddress($request->validated());
        if (!$tryToStoreAddress) {
            return response()->json(['message' => 'Failed to create address.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return response()->json(['message' => 'Address created successfully.'], Response::HTTP_CREATED);
    }

    /**
     * @param int $userId
     * @return JsonResponse|AddressShowResource
     */
    public function showAddress(int $userId): JsonResponse|AddressShowResource
    {
        try {
            $address = $this->addressRepository->getAddressByUserId($userId);
            if (!$address) {
                return response()->json(['message' => 'Address not found.'], Response::HTTP_NOT_FOUND);
            }

            return new AddressShowResource($address);
        } catch (Exception $e) {
            Log::error("Error trying to find address by id: " . $e->getMessage());
            return response()->json(['message' => 'Error trying to find address by id'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @param int $id
     * @return JsonResponse|AddressShowResource
     */
    public function showOrderAddress(int $id): JsonResponse|AddressShowResource
    {
        try {
            $address = $this->addressRepository->getAddressById($id);
            if (!$address) {
                return response()->json(['message' => 'Address not found.'], Response::HTTP_NOT_FOUND);
            }

            return new AddressShowResource($address);
        } catch (Exception $e) {
            Log::error("Error trying to find address by id: " . $e->getMessage());
            return response()->json(['message' => 'Error trying to find address by id'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @param AddressUpdateRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function updateAddress(AddressUpdateRequest $request, int $id): JsonResponse
    {
        $tryToUpdateAddress = $this->addressRepository->updateAddress($request->validated(), $id);
        if (!$tryToUpdateAddress) {
            return response()->json(['message' => 'Failed to update address.'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response()->json(['message' => 'Address updated successfully.'], Response::HTTP_OK);
    }

    /**
     * @param int $id
     * @return JsonResponse
     */
    public function destroyAddress(int $id): JsonResponse
    {
        $tryToDeleteAddress = $this->addressRepository->destroyAddress($id);
        if (!$tryToDeleteAddress) {
            return response()->json(['message' => 'Failed to delete address.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return response()->json(['message' => 'Address deleted successfully.'], Response::HTTP_OK);
    }
}
