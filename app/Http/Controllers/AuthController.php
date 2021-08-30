<?php

namespace App\Http\Controllers;

use App\Http\Requests\auth\LoginUserRequest;
use App\Http\Resources\auth\LoginUserResource;
use App\Http\Requests\auth\RegisterUserRequest;
use App\Http\Resources\auth\RegisterUserResource;
use App\Models\Role;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // Register User
    public function register(RegisterUserRequest $request) {
        // Get row where role name is Guest
        $role = Role::where('name', 'Guest')->first();

        // Check if role 'Guest' eloquent object exist
        if (!$role) {
            // If it doesn't create the role 'Guest'
            $role = Role::create([
                'name'      => 'Guest',
                'is_admin'  => false
            ]);
        }

        // Create the user
        $user = User::create([
            'name'      => $request->name,
            'email'     => $request->email,
            'password'  => Hash::make($request->password)
        ]);

        // Attach user's role id in relationship
        $user->roles()->attach($role->id);

        // Create user personal token
        $tokenResult = $user->createToken('Personal Access Token');
        $token = $tokenResult->token;

        // Check if remember_me option inside the request is true
        if ($request->remember_me) {
            // Add 1 more weeks to the token expiration date
            // when the token expire, the user is logged out
            $token->expires_at = Carbon::now()->addWeeks(1);
        }

        // Save the token
        $token->save();

        // return resource with token
        return new RegisterUserResource(
            $user, 
            $tokenResult->accessToken
        );
    }

    // Login User
    public function login(LoginUserRequest $request) {
        // find user by email
        $user = User::where('email', $request->email)->first();

        // if user exist
        if ($user) {
            // check if passwords match
            if (Hash::check($request->password, $user->password)) {
                // create new token 
                $tokenResult = $user->createToken('Personal Access Token');
                // get the new token and store it in $token
                $token = $tokenResult->token;

                // check if remember me option is true
                if ($request->remember_me) {
                    // add 1 more week for user to remain logged in
                    $token->expires_at = Carbon::now()->addWeeks(1);
                }

                // save the new token
                $token->save();

                // return resource with token
                return new LoginUserResource(
                    $user, 
                    $tokenResult->accessToken
                );
            }
        }

        // return error if user doesn't exist
        $response = ['message' => 'User does not exist..'];
        return response()->json($response, 422);
    }

    // delete account 
    public function delete_user($id)
    {
        // find user by id
        $user = User::find($id);

        // check if user exist
        if ($user) {
            // delete user
            $user->delete();

            // return success message
            $response = ['message' => 'User delete success'];
            return response()->json($response, 200);
        }
        
        // return error message
        $response = ['message' => 'User does not exist..'];
        return response()->json($response, 422);
    }
}
