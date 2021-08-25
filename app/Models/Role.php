<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'is_admin'
    ];

    /**
     * The users that belong to the role.
     */
    public function users()
    {
        return $this->belongsToMany(User::class, 'user_role');
    }

    /**
     * The permissions that belong to the role.
     */
    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'role_permission');
    }
}
