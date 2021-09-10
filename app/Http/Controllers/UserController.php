<?php

namespace App\Http\Controllers;

use App\Http\Requests\user\UserUpdateRequest;
use App\Http\Resources\auth\UserUpdateResource;
use App\Http\Resources\user\UserIndexResource;
use App\Http\Resources\user\UserShowResource;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // return user resource with relationships
        return UserIndexResource::collection(User::info()->get());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        // return user object
        return new UserShowResource(User::info()->find($id));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(UserUpdateRequest $request, $id)
    {
        // get user by id
        $user = User::find($id);

        // if user exist
        if ($user) {
            // insert data into user object
            $user->name = $request->name;
            $user->email = $request->email;

            // save user obj with the new data
            $user->save();

            // save relationship data
            $user->roles()->sync($request->role);
        } else {
            // return error message
            $response = ['message' => 'User not found'];
            return response()->json($response, 404);
        }

        // return resource
        return new UserUpdateResource($user);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        // get user by id
        $user = User::find($id);

        // if user doesnt exist return error message
        if (!$user) return response()->json(['message' => 'User does not exist..']);

        // detach user_role pivot
        $user->roles()->detach();

        // delete the user
        $user->delete();

        // return success message
        $response = ['message', 'User delete success'];
        return response()->json($response, 200);
    }
}
