<?php

namespace Database\Seeders;

use App\Models\Address;
use App\Models\ChildCategory;
use App\Models\Order;
use App\Models\ParentCategory;
use App\Models\Permission;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Review;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // Reset cached roles and permissions -- IF USING SPATIE (not needed here)
        // app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        DB::transaction(function () {
            // --- Roles ---
            $roleGuest = Role::firstOrCreate(['name' => 'Guest'], ['is_admin' => false]);
            $roleAdmin = Role::firstOrCreate(['name' => 'Admin'], ['is_admin' => true]);

            // --- Users ---
            $user = User::firstOrCreate(
                ['email' => 'user@user.com'],
                [
                    'name' => 'Test User',
                    'password' => Hash::make('password'),
                ]
            );

            $admin = User::firstOrCreate(
                ['email' => 'admin@admin.com'],
                [
                    'name' => 'Test Admin',
                    'password' => Hash::make('password'),
                ]
            );

            $user->roles()->sync([$roleGuest->id]);
            $admin->roles()->sync([$roleAdmin->id]);

            // --- Permissions ---
            $models = [
                'User', 'Product', 'Order', 'ParentCategory', 'ChildCategory',
                'Review', 'Address', 'Role', 'Permission', 'ProductImage'
            ];
            $operations = ['view', 'edit', 'delete', 'create'];

            $adminPermissions = [];
            foreach ($models as $model) {
                foreach ($operations as $operation) {
                    $permissionName = "admin_{$operation}_" . Str::plural(strtolower($model));
                    $adminPermissions[] = ['name' => $permissionName];
                }
            }

            foreach ($adminPermissions as $permission) {
                Permission::firstOrCreate(['name' => $permission['name']]);
            }

            $allPermissions = Permission::all();
            $roleAdmin->permissions()->sync($allPermissions);

            // --- Parent Categories ---
            $parentCategoryNames = ['Accessories', 'Origami', 'Special Offers'];
            foreach ($parentCategoryNames as $name) {
                ParentCategory::firstOrCreate(['name' => $name], ['slug' => Str::slug($name)]);
            }
            $parentCategories = ParentCategory::all();

            // --- Child Categories ---
            $childCategoriesData = [
                'Accessories' => ['Necklaces', 'Bracelets', 'Earrings'],
                'Origami' => ['Spring', 'Summer', 'Autumn', 'Winter'],
                'Special Offers' => [], // No child categories
            ];

            foreach ($parentCategories as $parentCategory) {
                if (isset($childCategoriesData[$parentCategory->name])) {
                    foreach ($childCategoriesData[$parentCategory->name] as $childName) {
                        ChildCategory::firstOrCreate([
                            'name' => $childName,
                            'parent_category_id' => $parentCategory->id,
                            'quantity' => 20
                        ],
                            ['slug' => Str::slug($childName)]
                        );
                    }
                }
            }
            $childCategories = ChildCategory::all();

            // --- Products ---
            foreach ($childCategories as $childCategory) {
                $existingProducts = Product::where('child_category_id', $childCategory->id)->count();
                if ($existingProducts < 3) {
                    $productsToCreate = 3 - $existingProducts;
                    for ($i = 0; $i < $productsToCreate; $i++) {
                        $product = Product::factory()->make([
                            'user_id' => $admin->id,
                            'parent_category_id' => $childCategory->parent_category_id,
                            'child_category_id' => $childCategory->id,
                            'slug' => "random",
                        ]);
                        $product->save();

                        $product->update(['slug' => $product->name]);
                    }
                }
            }
            $products = Product::all();

            // --- Product Images ---
            foreach ($products as $product) {
                $existingProductImages = ProductImage::where('product_id', $product->id)->count();
                if ($existingProductImages < 2) {
                    ProductImage::factory(2 - $existingProductImages)->create([
                        'product_id' => $product->id,
                    ]);
                }
            }

            // --- Reviews (associate with both user and admin) ---
            foreach ($products as $product) {
                $existingReviews = Review::where('product_id', $product->id)->count();
                if ($existingReviews < 1) {
                    //create reviews for both users and admin
                    Review::factory()->create([
                        'user_id' => $user->id,
                        'product_id' => $product->id,
                    ]);
                    if ($existingReviews < 2) { //ensure not creating more than 2 reviews.
                        Review::factory()->create([
                            'user_id' => $admin->id,
                            'product_id' => $product->id,
                        ]);
                    }

                }
            }

            // --- Addresses ---
            $existingUserAddresses = Address::where('user_id', $user->id)->count();
            if ($existingUserAddresses < 2) {
                Address::factory(2 - $existingUserAddresses)->create([
                    'user_id' => $user->id
                ]);
            }

            $existingAdminAddresses = Address::where('user_id', $admin->id)->count();
            if ($existingAdminAddresses < 2) {
                Address::factory(2 - $existingAdminAddresses)->create([
                    'user_id' => $admin->id
                ]);
            }

            // --- Orders --- (Optional, but good to have)
            $existingUserOrders = Order::where('user_id', $user->id)->count();
            if ($existingUserOrders < 2) {
                $orders = Order::factory(2 - $existingUserOrders)->create(['user_id' => $user->id]);

                foreach ($orders as $order) {
                    //attach random products to the order.  Important for pivot table
                    $randomProducts = Product::inRandomOrder()->limit(2)->get();
                    foreach ($randomProducts as $randomProduct) {
                        $order->products()->attach($randomProduct->id, ['qty' => rand(1, 3)]); // Example quantity
                    }
                }
            }

            $existingAdminOrders = Order::where('user_id', $admin->id)->count();
            if ($existingAdminOrders < 2) {
                $ordersAdmin = Order::factory(2 - $existingAdminOrders)->create(['user_id' => $admin->id]);
                foreach ($ordersAdmin as $order) {
                    //attach random products to the order.  Important for pivot table
                    $randomProducts = Product::inRandomOrder()->limit(2)->get();
                    foreach ($randomProducts as $randomProduct) {
                        $order->products()->attach($randomProduct->id, ['qty' => rand(1, 3)]); // Example quantity
                    }
                }
            }

        });
    }
}
