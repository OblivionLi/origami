<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * Get the products for the user
     */
    public function products()
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Get the reviews for the user
     */
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Get the orders for the user
     */
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    /**
     * The roles that belong to the user
     */
    public function roles() 
    {
        return $this->belongsToMany(Role::class, 'user_role');
    }

    public function addresses()
    {
        return $this->hasMany(Address::class, 'user_id');
    }

    // define scope function that return a query with eager loading
    public function scopeInfo($query)
    {
        // return data from relationships
        return $query->with(['products', 'reviews', 'orders', 'roles', 'addresses']);
    }

    // count all users by month
    public function scopeUserCount()
    {
        $users = User::select('id', 'created_at')->get()->groupBy(function ($date) {
            return Carbon::parse($date->created_at)->format('m');
        });

        $userCount = [];
        $userArr = [];

        foreach ($users as $key => $value) {
            $userCount[(int)$key] = count($value);
        }

        for ($i = 1; $i <= 12; $i++) {
            if (!empty($userCount[$i])) {
                $userArr[] = $userCount[$i];
            } else {
                $userArr[] = 0;
            }
        }

        return $userArr;
    }
}
