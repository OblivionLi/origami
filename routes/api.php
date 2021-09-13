<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChildCategoryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ParentCategoryController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductImageController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Public routes        ################################################## no need for admin perms or login
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login'])->name('login');
Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
Route::patch('reset-password/{email}', [AuthController::class, 'resetPassword']);
Route::get('reset-password/{token}', [AuthController::class, 'getToken']);

# Product routes
Route::get('showcase-products', [ProductController::class, 'getShowcaseProducts']);
Route::get('products/{product}', [ProductController::class, 'show']);
Route::get('reviews/product/{product}', [ReviewController::class, 'indexWithPagination']);

// Public routes        ################################################## no need for admin perms; login needed !
Route::group(['middleware' => 'auth:api'], function () {
    # User routes
    Route::get('logout', [AuthController::class, 'logout']);
    Route::patch('update-credentials/{id}', [AuthController::class, 'update']);
    Route::delete('delete/{id}', [AuthController::class, 'delete_user']);

    # Review routes
    Route::post('reviews/{review}', [ReviewController::class, 'store']);

    # Order routes
    Route::get('userOrders', [OrderController::class, 'getUserOrders']);
    Route::post('orders', [OrderController::class, 'store']);
    Route::get('orders/{order}', [OrderController::class, 'show']);
    Route::patch('orders/{order}/pay', [OrderController::class, 'updateOrderToPaid']);

    // Private routes   ################################################## admin perms & login needed !
    Route::group(['middleware' => 'isAdmin'], function () {

        # User routes
        Route::get('users', [UserController::class, 'index']);
        Route::get('users/{user}', [UserController::class, 'show']);
        Route::patch('users/{user}', [UserController::class, 'update']);
        Route::delete('users/{user}', [UserController::class, 'destroy']);

        # Role routes
        Route::get('roles', [RoleController::class, 'index']);
        Route::post('roles', [RoleController::class, 'store']);
        Route::get('roles/{role}', [RoleController::class, 'show']);
        Route::patch('roles/{role}', [RoleController::class, 'update']);
        Route::delete('roles/{role}', [RoleController::class, 'destroy']);

        # Permission routes
        Route::get('permissions', [PermissionController::class, 'index']);
        Route::post('permissions', [PermissionController::class, 'store']);
        Route::get('permissions/{permission}', [PermissionController::class, 'show']);
        Route::patch('permissions/{permission}', [PermissionController::class, 'update']);
        Route::delete('permissions/{permission}', [PermissionController::class, 'destroy']);

        # Parent Category routes
        Route::get('parent-categories', [ParentCategoryController::class, 'index']);
        Route::post('parent-categories', [ParentCategoryController::class, 'store']);
        Route::get('parent-categories/{parentCategory}', [ParentCategoryController::class, 'show']);
        Route::patch('parent-categories/{parentCategory}', [ParentCategoryController::class, 'update']);
        Route::delete('parent-categories/{parentCategory}', [ParentCategoryController::class, 'destroy']);

        # Child Category routes
        Route::get('child-categories', [ChildCategoryController::class, 'index']);
        Route::post('child-categories', [ChildCategoryController::class, 'store']);
        Route::get('child-categories/{childCategory}', [ChildCategoryController::class, 'show']);
        Route::patch('child-categories/{childCategory}', [ChildCategoryController::class, 'update']);
        Route::delete('child-categories/{childCategory}', [ChildCategoryController::class, 'destroy']);

        # Product routes
        Route::get('products', [ProductController::class, 'index']);
        Route::post('products', [ProductController::class, 'store']);
        Route::patch('products/{product}', [ProductController::class, 'update']);
        Route::delete('products/{product}', [ProductController::class, 'destroy']);

        # Product Images routes
        Route::post('productImage/{productId}', [ProductImageController::class, 'store']);
        Route::post('RproductImage/{imageId}', [ProductImageController::class, 'update']);
        Route::delete('productImage/{imageId}', [ProductImageController::class, 'destroy']);

        # Review routes
        Route::get('reviews', [ReviewController::class, 'index']);
        // Route::get('reviews', [ReviewController::class, 'indexWithPagination']);
        Route::get('reviews/{review}', [ReviewController::class, 'show']);
        Route::patch('reviews/{review}', [ReviewController::class, 'update']);
        Route::delete('reviews/{review}', [ReviewController::class, 'destroy']);

        # Order routes
        Route::get('orders', [OrderController::class, 'index']);
        Route::patch('orders/{order}/delivered', [OrderController::class, 'updateOrderToDelivered']);
    });
});