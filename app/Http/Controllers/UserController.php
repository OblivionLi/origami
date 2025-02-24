<?php

namespace App\Http\Controllers;

use App\Http\Resources\auth\UserUpdateResource;
use App\Http\Resources\user\UserAddressShowResource;
use App\Http\Resources\user\UserShowResource;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class UserController extends Controller
{
    protected UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * @return AnonymousResourceCollection
     */
    public function index(): AnonymousResourceCollection
    {
        return $this->userService->getUserWithRelations();
    }

    /**
     * @param int $id
     * @return UserShowResource
     */
    public function show(int $id): UserShowResource
    {
        return $this->userService->showUser($id);
    }

    /**
     * @param int $id
     * @return UserAddressShowResource|JsonResponse
     */
    public function showUserAddress(int $id): UserAddressShowResource|JsonResponse
    {
        return $this->userService->showUserAddress($id);
    }

    /**
     * @param Request $request
     * @param int $id
     * @return UserUpdateResource|JsonResponse
     */
    public function update(Request $request, int $id): UserUpdateResource|JsonResponse
    {
        return $this->userService->updateUser($request, $id);
    }

    /**
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        return $this->userService->deleteUser($id);
    }
}
