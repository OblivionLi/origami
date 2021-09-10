<?php

namespace App\Http\Controllers;

use App\Http\Requests\auth\ForgotPasswordRequest;
use App\Http\Requests\auth\LoginUserRequest;
use App\Http\Resources\auth\LoginUserResource;
use App\Http\Requests\auth\RegisterUserRequest;
use App\Http\Requests\auth\ResetPasswordRequest;
use App\Http\Requests\auth\UpdateUserRequest;
use App\Http\Resources\auth\RegisterUserResource;
use App\Http\Resources\auth\UserUpdateResource;
use App\Mail\ForgotPassword;
use App\Models\Role;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    // Register User
    public function register(RegisterUserRequest $request)
    {
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
    public function login(LoginUserRequest $request)
    {
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
        $response = ['message' => 'Invalid user credentials..'];
        return response()->json($response, 422);
    }

    // logout
    public function logout(Request $request)
    {
        $request->user()->token()->revoke();

        $response = ['message' => 'You have been logged out'];
        return response()->json($response, 200);
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

    // forgot-password
    public function forgotPassword(ForgotPasswordRequest $request)
    {
        // create a token with 60 random characters
        $token = Str::random(60);

        // insert data into password_resets table
        // the table takes an email, a token and a date when the record was inserted
        DB::table('password_resets')->insert([
            [
                'email'         => $request->email,
                'token'         => $token,
                'created_at'    => Carbon::now()
            ]
        ]);

        // get user where the email is = with the email from request
        $user = User::where('email', $request->email)->first();

        // prepare an array with the user found and the randomly generated token
        // the data will be used in the sent email
        $data = [
            'user'  => $user,
            'token' => $token
        ];

        // sent the prepared data to the email inside the request
        Mail::to($request->email)->send(new ForgotPassword($data));

        // return success message
        $response = ['message' => 'Email sent with success'];
        return response()->json($response, 200);
    }

    // reset password
    public function resetPassword(ResetPasswordRequest $request, $email)
    {
        // get user by email
        $user = User::where('email', $email)->first();

        // check if user exist
        if ($user) {
            // if password exist in request then hash it and add it to $user obj
            $request->password && $user->password = Hash::make($request->password);

            // save user to db with the newly hashed password
            $user->save();

            // delete token from password_resets table
            DB::table('password_resets')->where('email', $email)->delete();
        } else {
            // if user doesnt exist then throw error response
            $response = ['message' => 'User does not exist..'];
            return response()->json($response, 404);
        }

        // return success message
        $response = ['message' => 'User password changed with success'];
        return response()->json($user, 200);
    }

    // get token from password_resets table
    public function getToken($token)
    {
        // return a json response with the token
        return response()->json(DB::select('select *  from password_resets where token = :token', ['token' => $token]));
    }

    // update user credentials
    public function update(UpdateUserRequest $request, $id)
    {
        // get user by id
        $user = User::find($id);

        // if user exist
        if ($user) {
            // insert data into user object
            $user->name = $request->name;
            $user->email = $request->email;

            // check if request has password and hash it
            $request->password && Hash::make($request->password);

            // save user obj with the new data
            $user->save();
        } else {
            // return error message
            $response = ['message' => 'User not found'];
            return response()->json($response, 404);
        }

        // create response
        $response = [
            'message'   => 'User update success',
            'id'        => $user->id,
            'name'      => $user->name,
            'email'     => $user->email,
            'role'      => $user->roles->pluck('name'),
            'is_admin'  => $user->roles->pluck('is_admin')
        ];
        // return resource
        return response()->json($response, 200);
    }
}
