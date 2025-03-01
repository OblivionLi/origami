<?php

namespace App\Services;

use App\Http\Requests\auth\ForgotPasswordRequest;
use App\Http\Requests\auth\LoginUserRequest;
use App\Http\Requests\auth\RegisterUserRequest;
use App\Http\Requests\auth\ResetPasswordRequest;
use App\Http\Requests\auth\UpdateUserRequest;
use App\Http\Resources\auth\LoginUserResource;
use App\Http\Resources\auth\RegisterUserResource;
use App\Http\Resources\auth\UserUpdateResource;
use App\Mail\ForgotPassword;
use App\Models\User;
use App\Repositories\RoleRepository;
use App\Repositories\UserRepository;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

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
            return response()->json(['message' => 'Failed to create role'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        $user = $this->userRepository->createUserWithRole($role->id, $request);

        if (!$user) {
            Log::error("Failed to create user during registration (database error)");
            return response()->json(['message' => 'Failed to register user'], Response::HTTP_INTERNAL_SERVER_ERROR);
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
            return response()->json(['message' => 'Failed to login user.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        if (!Hash::check($request->password, $user->password)) {
            $response = ['message' => 'User credentials are incorrect.'];
            return response()->json($response, Response::HTTP_UNPROCESSABLE_ENTITY);
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
        return response()->json($response, Response::HTTP_OK);
    }

    /**
     * @param ForgotPasswordRequest $request
     * @return JsonResponse
     */
    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        $email = $request->email;
        $user = User::where('email', $email)->first();

        if (!$user) {
            return response()->json(['message' => 'If a matching account was found, a password reset link has been sent to your email address'], Response::HTTP_OK);
        }

        $token = Str::random(90);

        if (!$this->userRepository->tryInsertingToPasswordReset($email, $token)) {
            return response()->json(['message' => 'Failed to send password reset email'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        try {
            Mail::to($request->email)->send(new ForgotPassword($user->name, $user->email, $token));
            return response()->json(['message' => 'If a matching account was found, a password reset link has been sent to your email address.'], Response::HTTP_OK);
        } catch (Exception $e) {
            Log::error("Failed to send password reset email: " . $e->getMessage());
            return response()->json(['message' => 'Failed to send password reset email'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @param ResetPasswordRequest $request
     * @return JsonResponse
     * @throws Exception
     */
    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User password change successfully.'], Response::HTTP_OK);
        }

        $isPasswordReset = $this->userRepository->tryResettingPassword($user, $request->password);

        if ($isPasswordReset) {
            return response()->json(['message' => 'User password change successfully.'], Response::HTTP_OK);
        }

        Log::error("Failed to reset password (database error)");
        return response()->json(['message' => 'User password change successfully.'], Response::HTTP_OK);
    }

    /**
     * @param string $token
     * @return JsonResponse
     */
    public function getPasswordResetToken(string $token): JsonResponse
    {
        return response()->json($this->userRepository->getPasswordResetToken($token));
    }

    /**
     * @param string $email
     * @return JsonResponse
     */
    public function deleteMe(string $email): JsonResponse
    {
        if ($this->userRepository->deleteUser($email)) {
            return response()->json(['message' => 'User delete successfully.'], Response::HTTP_OK);
        }

        return response()->json(['message' => 'User not found.'], Response::HTTP_NOT_FOUND);
    }

    /**
     * @param UpdateUserRequest $request
     * @return UserUpdateResource|JsonResponse
     * @throws Exception
     */
    public function updateMe(UpdateUserRequest $request, int $userId): UserUpdateResource|JsonResponse
    {
        $user = $this->userRepository->getUserById($userId);

        if (!$user) {
            return response()->json(['message' => 'User not found.'], Response::HTTP_NOT_FOUND);
        }

        $user->name = $request->name ?? $user->name;
        $user->email = $request->email ?? $user->email;
        $user->password = $request->password ? Hash::make($request->password) : $user->password;

        try {
            $user->save();
        } catch (Exception $e) {
            Log::error("Failed to update user (database error)");
            return response()->json(['message' => 'Failed to update user.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return new UserUpdateResource($user);
    }
}
