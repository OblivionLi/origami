<?php

namespace App\Http\Controllers;

use App\Http\Requests\auth\ForgotPasswordRequest;
use App\Http\Requests\auth\LoginUserRequest;
use App\Http\Requests\auth\RegisterUserRequest;
use App\Http\Requests\auth\ResetPasswordRequest;
use App\Http\Requests\auth\UpdateUserRequest;
use App\Http\Resources\auth\LoginUserResource;
use App\Http\Resources\auth\RegisterUserResource;
use App\Http\Resources\auth\UserUpdateResource;
use App\Services\AuthService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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

    /**
     * @param ResetPasswordRequest $request
     * @return JsonResponse
     * @throws Exception
     */
    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        return $this->authService->resetPassword($request);
    }

    /**
     * @param string $token
     * @return JsonResponse
     */
    public function getPasswordResetToken(string $token): JsonResponse
    {
        return $this->authService->getPasswordResetToken($token);
    }

    /**
     * @param UpdateUserRequest $request
     * @param int $userId
     * @return UserUpdateResource|JsonResponse
     * @throws Exception
     */
    public function updateMe(UpdateUserRequest $request, int $userId): UserUpdateResource|JsonResponse
    {
        return $this->authService->updateMe($request, $userId);
    }

    /**
     * @param $email
     * @return JsonResponse
     */
    public function deleteMe($email): JsonResponse
    {
        return $this->authService->deleteMe($email);
    }
}
