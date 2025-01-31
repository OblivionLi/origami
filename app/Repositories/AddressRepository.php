<?php

namespace App\Repositories;

use App\Http\Requests\address\AddressStoreRequest;
use App\Http\Requests\address\AddressUpdateRequest;
use App\Models\Address;
use App\Models\User;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AddressRepository
{
    /**
     * @return Builder|null
     */
    public function getRoleWithRelations(): Builder|null
    {
        try {
            return Address::with(['user']);
        } catch (Exception $e) {
            Log::error('Error getting address with relations: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * @param AddressStoreRequest $request
     * @return bool
     */
    public function storeAddress(AddressStoreRequest $request): bool
    {
        $addressDetails = [
            'user_id' => $request->user_id,
            'name' => $request->name,
            'surname' => $request->surname,
            'country' => $request->country,
            'city' => $request->city,
            'address' => $request->address,
            'postal_code' => $request->postal_code,
            'phone_number' => $request->phone_number,
        ];

        DB::beginTransaction();

        try {
            $user = User::find($request->user_id);
            if (!$user) {
                Log::error('User not found');
                return false;
            }

            $user->addresses()->updateOrCreate($addressDetails);

            DB::commit();
            return true;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Error store address: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * @param AddressUpdateRequest $request
     * @param int $id
     * @return bool
     */
    public function updateAddress(AddressUpdateRequest $request, int $id): bool
    {
        try {
            $address = Address::find($id)->first();
            if (!$address) {
                Log::error('Address not found');
                return false;
            }

            $address->name = $request->name;
            $address->surname = $request->surname;
            $address->country = $request->country;
            $address->city = $request->city;
            $address->address = $request->address;
            $address->postal_code = $request->postal_code;
            $address->phone_number = $request->phone_number;

            $address->save();

            return true;
        } catch (Exception $e) {
            Log::error('Error updating address: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * @param int $id
     * @return bool
     */
    public function destroyAddress(int $id): bool
    {
        try {
            $address = Address::find($id)->first();
            if (!$address) {
                Log::error('Address not found');
                return false;
            }

            $address->delete();

            return true;
        } catch (Exception $e) {
            Log::error('Error deleting address: ' . $e->getMessage());
            return false;
        }
    }
}
