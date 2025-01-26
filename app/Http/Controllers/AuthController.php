<?php

namespace App\Http\Controllers;

use App\Http\Requests\auth\ForgotPasswordRequest;
use App\Http\Requests\auth\LoginUserRequest;
use App\Http\Requests\auth\RegisterUserRequest;
use App\Http\Requests\auth\ResetPasswordRequest;
use App\Http\Requests\auth\UpdateUserRequest;
use App\Http\Resources\auth\LoginUserResource;
use App\Http\Resources\auth\RegisterUserResource;
use App\Models\User;
use App\Services\AuthService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    protected AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * @param RegisterUserRequest $request
     * @return RegisterUserResource|JsonResponse
     * @throws Exception
     */
    public function register(RegisterUserRequest $request): RegisterUserResource|JsonResponse
    {
        return $this->authService->register($request);
    }

    /**
     * @param LoginUserRequest $request
     * @return LoginUserResource|JsonResponse
     * @throws Exception
     */
    public function login(LoginUserRequest $request): LoginUserResource|JsonResponse
    {
        return $this->authService->login($request);
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function logout(Request $request): JsonResponse
    {
        return $this->authService->logout($request);
    }

    /**
     * @param ForgotPasswordRequest $request
     * @return JsonResponse
     */
    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        return $this->authService->forgotPassword($request);
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
            'message' => 'User update success',
            'id' => $user->id,
            'user_id' => $user->user_id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->roles->pluck('name'),
            'is_admin' => $user->roles->pluck('is_admin')
        ];
        // return resource
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
}
