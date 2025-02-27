<?php

namespace App\Services;

use App\Http\Requests\user\UserEditRequest;
use App\Http\Resources\auth\UserUpdateResource;
use App\Http\Resources\user\UserAddressShowResource;
use App\Http\Resources\user\UserAdminIndexResource;
use App\Http\Resources\user\UserIndexResource;
use App\Http\Resources\user\UserShowResource;
use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class UserService
{
    protected UserRepository $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * @return AnonymousResourceCollection|JsonResponse
     */
    public function getUserWithRelations(): AnonymousResourceCollection|JsonResponse
    {
        $users = $this->userRepository->getUserWithRelations(null)->get();
        if ($users->isEmpty()) {
            return response()->json(['message' => 'Could not fetch users with relations.'], Response::HTTP_NOT_FOUND);
        }

        return UserIndexResource::collection($users);
    }

    /**
     * @param int $id
     * @return UserShowResource
     */
    public function showUser(int $id): UserShowResource
    {
        return new UserShowResource($this->userRepository->getUserWithRelations($id));
    }

    /**
     * @param array $requestData
     * @param int $id
     * @return UserUpdateResource|JsonResponse
     */
    public function updateUser(array $requestData, int $id): UserUpdateResource|JsonResponse
    {
        $user = $this->userRepository->getUserById($id);
        if (!$user) {
            return response()->json(['message' => 'User not found.'], Response::HTTP_NOT_FOUND);
        }

        if ($user->email != $requestData['email']) {
            if ($this->userRepository->doesEmailExist($requestData['email'])) {
                return response()->json(['message' => 'Email already exist.'], Response::HTTP_NOT_FOUND);
            }
        }

        $preparedRequestData = [
            'name' => $requestData['name'],
            'email' => $requestData['email'] != $user->email ? $requestData['email'] : '',
            'roles' => $requestData['roles'],
        ];

        $tryToUpdateUser = $this->userRepository->updateUser($preparedRequestData, $user);
        if (!$tryToUpdateUser) {
            return response()->json(['message' => 'Failed to update user.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return new UserUpdateResource($user);
    }

    /**
     * @param int $id
     * @return JsonResponse
     */
    public function deleteUser(int $id): JsonResponse
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found.'], Response::HTTP_NOT_FOUND);
        }

        $tryToDeleteUser = $this->userRepository->deleteUser($user->email);
        if (!$tryToDeleteUser) {
            return response()->json(['message' => 'User not found.'], Response::HTTP_NOT_FOUND);
        }

        return response()->json(['message' => 'User deleted successfully.'], Response::HTTP_OK);
    }

    /**
     * @param int $id
     * @return UserAddressShowResource|JsonResponse
     */
    public function showUserAddress(int $id): UserAddressShowResource|JsonResponse
    {
        $user = $this->userRepository->getUserWithAddress($id);
        if (!$user) {
            return response()->json(['message' => 'User not found.'], Response::HTTP_NOT_FOUND);
        }

        return new UserAddressShowResource($user);
    }

    /**
     * @param int $userId
     * @return JsonResponse
     */
    public function getUserRolesPermissions(int $userId): JsonResponse
    {
        $permissions = $this->userRepository->getUserPermissions($userId)->pluck('name');
        if (!$permissions) {
            return response()->json(['message' => 'User not found.'], Response::HTTP_NOT_FOUND);
        }

        return response()->json($permissions, Response::HTTP_OK);
    }

    /**
     * @return JsonResponse|AnonymousResourceCollection
     */
    public function getAdminUsersList(): JsonResponse|AnonymousResourceCollection
    {
        $users = $this->userRepository->getAdminUsersList()->get();
        if ($users->isEmpty()) {
            return response()->json(['message' => 'Could not fetch users.'], Response::HTTP_NOT_FOUND);
        }

        return UserAdminIndexResource::collection($users);
    }
}
