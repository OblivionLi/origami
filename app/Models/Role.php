<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * @property string $name
 * @property boolean $is_admin
 */
class Role extends Model
{
    use HasFactory;

    /**
     * @var string
     */
    protected $table = 'roles';

    /**
     * @var array[string, string]
     */
    protected $fillable = [
        'name', 'is_admin'
    ];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_role');
    }

    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class, 'role_permission');
    }
}
