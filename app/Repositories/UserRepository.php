<?php

namespace App\Repositories;

use App\Http\Requests\auth\RegisterUserRequest;
use App\Models\User;
use Carbon\Carbon;
use Doctrine\DBAL\Query\QueryException;
use Exception;
use Illuminate\Database\Eloquent\Builder;
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



    public function getUserWithRelations(): Builder
    {
        return User::with(['products', 'reviews', 'orders', 'roles', 'addresses']);
    }

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
}
