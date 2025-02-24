<?php

namespace App\Repositories;

use App\Http\Requests\auth\RegisterUserRequest;
use App\Models\User;
use Carbon\Carbon;
use Doctrine\DBAL\Query\QueryException;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class UserRepository
{
    /**
     * @param int $roleId
     * @param RegisterUserRequest $requestData
     * @return User|null
     * @throws Exception
     */
    public function createUserWithRole(int $roleId, RegisterUserRequest $requestData): ?User
    {
        DB::beginTransaction();

        try {
            $user = User::create([
                'name' => $requestData->name,
                'email' => $requestData->email,
                'password' => Hash::make($requestData->password),
            ]);

            $user->roles()->attach($roleId);

            DB::commit();
            return $user;
        } catch (QueryException $e) {
            DB::rollBack();
            Log::error("Database error creating user with role: " . $e->getMessage());
            return null;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error("Error creating user: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * @param bool $rememberMe
     * @param User $user
     * @return string
     * @throws Exception
     */
    public function createUserToken(bool $rememberMe, User $user): string
    {
        $result = $user->createToken('Personal Access Token');
        if ($rememberMe) {
            $result->token->expires_at = Carbon::now()->addWeeks(4);
        }

        try {
            $result->token->save();
            return $result->accessToken;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error("Error saving user token: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * @param string $email
     * @return User|null
     * @throws Exception
     */
    public function getUserByEmail(string $email): ?User
    {
        try {
            return User::where('email', $email)->first();
        } catch (QueryException $e) {
            DB::rollBack();
            Log::error("Database error retrieving user by email: " . $e->getMessage());
            return null;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error("Error retrieving user: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * @param string $email
     * @param string $token
     * @return bool
     */
    public function tryInsertingToPasswordReset(string $email, string $token): bool {
        try {
            DB::table('password_resets')->insert([
                'email' => $email,
                'token' => $token,
                'created_at' => Carbon::now()
            ]);

            return true;
        } catch (Exception $e) {
            Log::error("Failed to store password reset token: " . $e->getMessage());
            return false;
        }
    }

    /**
     * @param string $token
     * @return string
     */
    public function getPasswordResetToken(string $token): string
    {
        try {
            return DB::table('password_resets')->where('token', $token)->first()->token;
        } catch (Exception $e) {
            Log::error("Failed to get password reset token: " . $e->getMessage());
            return 'Invalid token';
        }
    }

    /**
     * @param User $user
     * @param string $password
     * @return bool
     * @throws Exception
     */
    public function tryResettingPassword(User $user, string $password): bool
    {
        DB::beginTransaction();

        $hashedPassword = Hash::make($password);
        try {
            $user->update([
                'password' => $hashedPassword
            ]);

            DB::table('password_resets')->where('email', $user->email)->delete();
            DB::commit();

            return true;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error("Error resetting user password: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * @param string $email
     * @return bool
     */
    public function deleteUser(string $email): bool
    {
        DB::beginTransaction();
        try {
            $user = User::where('email', $email)->first();

            if (!$user) {
                return false;
            }

            $user->roles()->detach();
            $user->delete();

            DB::commit();
            return true;
        } catch (Exception $e) {
            Log::error("Failed to delete user: " . $e->getMessage());
            DB::rollBack();
            return false;
        }
    }

    /**
     * @param int|string|null $userId
     * @return User|Builder|null
     */
    public function getUserWithRelations(int|string|null $userId): User|Builder|null
    {
        if ($userId) {
            return User::with(['products', 'reviews', 'orders', 'roles', 'addresses'])->find($userId);
        }

        return User::with(['products', 'reviews', 'orders', 'roles', 'addresses']);
    }

    /**
     * @return array
     */
    public function getUserCountsByMonth(): array
    {
        $userCounts = User::selectRaw('MONTH(created_at) as month, COUNT(*) as count')
            ->groupBy('month')
            ->pluck('count', 'month');

        $monthlyCounts = [];

        for ($i = 1; $i <= 12; $i++) {
            $monthlyCounts[] = $userCounts[$i] ?? 0;
        }

        return $monthlyCounts;
    }

    /**
     * @param array $requestData
     * @param User $user
     * @return bool
     */
    public function updateUser(array $requestData, User $user): bool
    {
        DB::beginTransaction();

        try {
            $user->update([
                'name' => $requestData['name'],
                'email' => $requestData['email']
            ]);

            $user->roles()->sync($requestData['role']);

            DB::commit();
            return true;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error("Failed to update user: " . $e->getMessage());
            return false;
        }
    }

    /**
     * @param int $userId
     * @return User|null
     */
    public function getUserById(int $userId): ?User
    {
        return User::find($userId)->first();
    }

    /**
     * @param int $id
     * @return User|null
     */
    public function getUserWithAddress(int $id): ?User
    {
        return User::with(['addresses'])->find($id);
    }
}
