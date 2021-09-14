<?php

namespace App\Http\Controllers;

use App\Http\Requests\address\AddressStoreRequest;
use App\Http\Requests\address\AddressUpdateRequest;
use App\Http\Resources\address\AddressIndexResource;
use App\Http\Resources\address\AddressShowResource;
use App\Models\Address;
use App\Models\User;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // return address resource with relationships
        return AddressIndexResource::collection(Address::with('user')->get());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(AddressStoreRequest $request)
    {
        // find user by request id
        $user = User::find($request->user_id);

        // create array with address details from request
        $addressDetails = [
            'user_id'       => $request->user_id,
            'name'          => $request->name,
            'surname'       => $request->surname,
            'country'       => $request->country,
            'city'          => $request->city,
            'address'       => $request->address,
            'postal_code'   => $request->postal_code,
            'phone_number'  => $request->phone_number,
        ];

        // check if user doesnt have relationship data
        if (!$user->addresses()->exists()) {
            // add the array of details to address model contructor
            $userAddress = new Address($addressDetails);

            // save the address
            $user->addresses()->save($userAddress);
        // else if user already has relationship data 
        } else {
            // update details
            $user->addresses()->update($addressDetails);
        }

        // return success message
        $response = ['message', 'Address create success'];
        return response()->json($response, 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Address  $address
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        // get address by slug with relationships
        $address = Address::where('user_id', $id)->get();

        // if address doesnt exist return error message
        $response = ['message' => 'Address does not exist..'];
        if (!$address) return response()->json($response, 422);

        // return address resource
        return AddressShowResource::collection($address);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Address  $address
     * @return \Illuminate\Http\Response
     */
    public function update(AddressUpdateRequest $request, $id)
    {
        // get address by id
        $address = Address::find($id);

        // if address doesnt exist return error message
        if (!$address) return response()->json(['message' => 'Address does not exist..']);

        // update address data
        $address->name          = $request->name;
        $address->surname       = $request->surname;
        $address->country       = $request->country;
        $address->city          = $request->city;
        $address->address       = $request->address;
        $address->postal_code   = $request->postal_code;
        $address->phone_number  = $request->phone_number;

        // save the new address data
        $address->save();

        // return success message
        $response = ['message', 'Address update success'];
        return response()->json($response, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Address  $address
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        // get address by id
        $address = Address::find($id);

        // if address doesnt exist return error message
        if (!$address) return response()->json(['message' => 'Address does not exist..']);

        // delete address
        $address->delete();

        // return success message
        $response = ['message', 'Address delete success'];
        return response()->json($response, 200);
    }
}
