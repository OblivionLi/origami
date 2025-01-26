<?php

namespace App\Services;

use App\Http\Requests\auth\ForgotPasswordRequest;
use App\Http\Requests\auth\LoginUserRequest;
use App\Http\Requests\auth\RegisterUserRequest;
use App\Http\Resources\auth\LoginUserResource;
use App\Http\Resources\auth\RegisterUserResource;
use App\Mail\ForgotPassword;
use App\Models\User;
use App\Repositories\RoleRepository;
use App\Repositories\UserRepository;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class AuthService
{
    protected RoleRepository $roleRepository;
    protected UserRepository $userRepository;

    public function __construct(
        RoleRepository $roleRepository,
        UserRepository $userRepository
    )
    {
        $this->roleRepository = $roleRepository;
        $this->userRepository = $userRepository;
    }

    /**
     * @param RegisterUserRequest $request
     * @return RegisterUserResource | JsonResponse
     * @throws Exception
     */
    public function register(RegisterUserRequest $request): RegisterUserResource|JsonResponse
    {
        $role = $this->roleRepository->getOrCreateRole('Guest');

        if (!$role) {
            Log::error("Failed to create role during registration (database error)");
            return response()->json(['message' => 'Failed to create role'], 500);
        }

        $user = $this->userRepository->createUserWithRole($role->id, $request);

        if (!$user) {
            Log::error("Failed to create user during registration (database error)");
            return response()->json(['message' => 'Failed to register user'], 500);
        }

        $accessToken = $this->userRepository->createUserToken($request->remember_me, $user);

        return new RegisterUserResource(
            $user,
            $accessToken
        );
    }

    /**
     * @param LoginUserRequest $request
     * @return LoginUserResource|JsonResponse
     * @throws Exception
     */
    public function login(LoginUserRequest $request): LoginUserResource|JsonResponse
    {
        $user = $this->userRepository->getUserByEmail($request->email);
        if (!$user) {
            Log::error("Failed to login user (database error)");
            return response()->json(['message' => 'Failed to login user'], 500);
        }

        if (!Hash::check($request->password, $user->password)) {
            $response = ['message' => 'User credentials are incorrect'];
            return response()->json($response, 422);
        }

        $accessToken = $this->userRepository->createUserToken($request->remember_me, $user);

        $user->load(['roles.permissions', 'roles.users']);
        return new LoginUserResource(
            $user,
            $accessToken
        );
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->token()->revoke();

        $response = ['message' => 'Successfully logged out'];
        return response()->json($response, 200);
    }

    // TODO:: continue with fixing/cleaning the forgotPassword
    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        // create a token with 60 random characters
        $token = Str::random(60);

        // insert data into password_resets table
        // the table takes an email, a token and a date when the record was inserted
        DB::table('password_resets')->insert([
            [
                'email' => $request->email,
                'token' => $token,
                'created_at' => Carbon::now()
            ]
        ]);

        // get user where the email is = with the email from request
        $user = User::where('email', $request->email)->first();

        // prepare an array with the user found and the randomly generated token
        // the data will be used in the sent email
        $data = [
            'user' => $user,
            'token' => $token
        ];

        // sent the prepared data to the email inside the request
        Mail::to($request->email)->send(new ForgotPassword($data));

        // return success message
        $response = ['message' => 'Email sent with success'];
        return response()->json($response, 200);
    }
}
