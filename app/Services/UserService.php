<?php

namespace App\Services;

use App\Http\Resources\auth\UserUpdateResource;
use App\Http\Resources\user\UserIndexResource;
use App\Http\Resources\user\UserShowResource;
use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Validation\Rule;

class UserService
{
    protected UserRepository $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * @return AnonymousResourceCollection
     */
    public function getUserWithRelations(): AnonymousResourceCollection
    {
        return UserIndexResource::collection($this->userRepository->getUserWithRelations(null)->get());
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
     * @param Request $request
     * @param int $id
     * @return UserUpdateResource|JsonResponse
     */
    public function updateUser(Request $request, int $id): UserUpdateResource|JsonResponse
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $request->validate([
            'name' => 'string',
            'email' => [
                Rule::unique('users')->ignore($user->id),
            ],
            'password' => 'confirmed'
        ]);

        $preparedRequestData = [
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
        ];

        $tryToUpdateUser = $this->userRepository->updateUser($preparedRequestData, $user);
        if (!$tryToUpdateUser) {
            return response()->json(['message' => 'User update failed'], 500);
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
            return response()->json(['message' => 'User not found'], 404);
        }

        $tryToDeleteUser = $this->userRepository->deleteUser($user->email);
        if (!$tryToDeleteUser) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json(['message' => 'User deleted successfully'], 200);
    }
}
