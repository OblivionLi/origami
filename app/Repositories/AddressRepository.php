<?php

namespace App\Repositories;

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
    public function getAddressesWithRelations(): Builder|null
    {
        try {
            return Address::with(['user']);
        } catch (Exception $e) {
            Log::error('Error getting address with relations: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * @param array $requestData
     * @return bool
     */
    public function createAddress(array $requestData): bool
    {
        $addressDetails = [
            'user_id' => $requestData['user_id'],
            'name' => $requestData['name'],
            'surname' => $requestData['surname'],
            'country' => $requestData['country'],
            'city' => $requestData['city'],
            'address' => $requestData['address'],
            'postal_code' => $requestData['postal_code'],
            'phone_number' => $requestData['phone_number'],
        ];

        DB::beginTransaction();

        try {
            $user = User::find($requestData['user_id']);
            if (!$user) {
                return false;
            }

            $user->addresses()->updateOrCreate($addressDetails);

            DB::commit();
            return true;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Error storeOld address: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * @param array $requestData
     * @param int $id
     * @return Address|null
     */
    public function updateAddress(array $requestData, int $id): Address|null
    {
        try {
            $address = Address::find($id)->first();
            if (!$address) {
                return null;
            }

            $address->name = $requestData['name'];
            $address->surname = $requestData['surname'];
            $address->country = $requestData['country'];
            $address->city = $requestData['city'];
            $address->address = $requestData['address'];
            $address->postal_code = $requestData['postal_code'];
            $address->phone_number = $requestData['phone_number'];

            $address->save();

            return $address;
        } catch (Exception $e) {
            Log::error('Error updating address: ' . $e->getMessage());
            return null;
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
                return false;
            }

            $address->delete();

            return true;
        } catch (Exception $e) {
            Log::error('Error deleting address: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * @param int $id
     * @return Address|null
     */
    public function getAddressByUserId(int $id): Address|null
    {
        return Address::with(['user'])->where('user_id', $id)->first();
    }
}
