<?php

namespace App\Http\Controllers;

use App\Http\Requests\user\UserEditRequest;
use App\Http\Requests\user\UserRolesPermissionsRequest;
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
     * @return JsonResponse|AnonymousResourceCollection
     */
    public function indexAdmin(): JsonResponse|AnonymousResourceCollection
    {
        return $this->userService->getAdminUsersList();
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
     * @param int $userId
     * @return JsonResponse
     */
    public function getUserRolesPermissions(int $userId): JsonResponse
    {
        return $this->userService->getUserRolesPermissions($userId);
    }

    /**
     * @param UserEditRequest $request
     * @param int $id
     * @return UserUpdateResource|JsonResponse
     */
    public function update(UserEditRequest $request, int $id): UserUpdateResource|JsonResponse
    {
        return $this->userService->updateUser($request->validated(), $id);
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
