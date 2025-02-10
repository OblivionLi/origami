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
     * @param Request $request
     * @param int $id
     * @return UserUpdateResource|JsonResponse
     */
    public function updateUser(Request $request, int $id): UserUpdateResource|JsonResponse
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found.'], Response::HTTP_NOT_FOUND);
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
}
