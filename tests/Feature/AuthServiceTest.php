<?php

namespace Tests\Feature;

use App\Http\Requests\auth\ForgotPasswordRequest;
use App\Http\Requests\auth\LoginUserRequest;
use App\Http\Requests\auth\RegisterUserRequest;
use App\Http\Requests\auth\ResetPasswordRequest;
use App\Http\Requests\auth\UpdateUserRequest;
use App\Http\Resources\auth\LoginUserResource;
use App\Http\Resources\auth\RegisterUserResource;
use App\Http\Resources\auth\UserUpdateResource;
use App\Mail\ForgotPassword;
use App\Models\Role;
use App\Models\User;
use App\Repositories\RoleRepository;
use App\Repositories\UserRepository;
use App\Services\AuthService;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Mockery;
use Tests\TestCase;

class AuthServiceTest extends TestCase
{
    use WithFaker;

    protected AuthService $authService;
    protected $roleRepository;
    protected $userRepository;

    protected function setUp(): void
    {
        parent::setUp();

        $this->roleRepository = Mockery::mock(RoleRepository::class);
        $this->userRepository = Mockery::mock(UserRepository::class);
        $this->authService = new AuthService($this->roleRepository, $this->userRepository);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_register_success(): void
    {
        $request = new RegisterUserRequest([
            'name' => $this->faker->name,
            'email' => $this->faker->unique()->safeEmail,
            'password' => 'password',
            'password_confirmation' => 'password',
            'remember_me' => true,
        ]);

        $role = new Role(['id' => 1, 'name' => 'Guest']);
        $user = new User($request->toArray());
        $user->id = 1;

        $this->roleRepository->shouldReceive('getOrCreateRole')->with('Guest')->andReturn($role);
        $this->userRepository->shouldReceive('createUserWithRole')->with($role->id, $request)->andReturn($user);
        $this->userRepository->shouldReceive('createUserToken')->with($request->remember_me, $user)->andReturn('access_token');

        $result = $this->authService->register($request);

        $this->assertInstanceOf(RegisterUserResource::class, $result);
        $this->assertEquals($user->id, $result->id);
        $this->assertEquals($user->name, $result->name);
        $this->assertEquals($user->email, $result->email);
        $this->assertEquals('access_token', $result->token);
    }

    public function test_register_role_creation_failure(): void
    {
        $request = new RegisterUserRequest([
            'name' => $this->faker->name,
            'email' => $this->faker->unique()->safeEmail,
            'password' => 'password',
            'password_confirmation' => 'password',
            'remember_me' => true,
        ]);

        $this->roleRepository->shouldReceive('getOrCreateRole')->with('Guest')->andReturn(null);

        $result = $this->authService->register($request);

        $this->assertInstanceOf(JsonResponse::class, $result);
        $this->assertEquals(500, $result->getStatusCode());
        $this->assertEquals(['message' => 'Failed to create role'], $result->getData(true));
    }

    public function test_register_user_creation_failure(): void
    {
        $request = new RegisterUserRequest([
            'name' => $this->faker->name,
            'email' => $this->faker->unique()->safeEmail,
            'password' => 'password',
            'password_confirmation' => 'password',
            'remember_me' => true,
        ]);

        $role = new Role(['id' => 1, 'name' => 'Guest']);

        $this->roleRepository->shouldReceive('getOrCreateRole')->with('Guest')->andReturn($role);
        $this->userRepository->shouldReceive('createUserWithRole')->with($role->id, $request)->andReturn(null);

        $result = $this->authService->register($request);

        $this->assertInstanceOf(JsonResponse::class, $result);
        $this->assertEquals(500, $result->getStatusCode());
        $this->assertEquals(['message' => 'Failed to register user'], $result->getData(true));
    }

    public function test_login_success(): void
    {
        $request = new LoginUserRequest([
            'email' => $this->faker->unique()->safeEmail,
            'password' => 'password',
            'remember_me' => true,
        ]);

        $user = new User([
            'name' => $this->faker->name,
            'email' => $request->email,
            'password' => Hash::make('password'),
        ]);
        $user->id = 1;

        $this->userRepository->shouldReceive('getUserByEmail')->with($request->email)->andReturn($user);
        $this->userRepository->shouldReceive('createUserToken')->with($request->remember_me, $user)->andReturn('access_token');

        $result = $this->authService->login($request);

        $this->assertInstanceOf(LoginUserResource::class, $result);
        $this->assertEquals($user->id, $result->id);
        $this->assertEquals($user->name, $result->name);
        $this->assertEquals($user->email, $result->email);
        $this->assertEquals('access_token', $result->token);
    }

    public function test_login_user_not_found(): void
    {
        $request = new LoginUserRequest([
            'email' => $this->faker->unique()->safeEmail,
            'password' => 'password',
            'remember_me' => true,
        ]);

        $this->userRepository->shouldReceive('getUserByEmail')->with($request->email)->andReturn(null);

        $result = $this->authService->login($request);

        $this->assertInstanceOf(JsonResponse::class, $result);
        $this->assertEquals(500, $result->getStatusCode());
        $this->assertEquals(['message' => 'Failed to login user'], $result->getData(true));
    }

    public function test_login_incorrect_password(): void
    {
        $request = new LoginUserRequest([
            'email' => $this->faker->unique()->safeEmail,
            'password' => 'wrong_password',
            'remember_me' => true,
        ]);

        $user = new User([
            'name' => $this->faker->name,
            'email' => $request->email,
            'password' => Hash::make('password'),
        ]);

        $this->userRepository->shouldReceive('getUserByEmail')->with($request->email)->andReturn($user);

        $result = $this->authService->login($request);

        $this->assertInstanceOf(JsonResponse::class, $result);
        $this->assertEquals(422, $result->getStatusCode());
        $this->assertEquals(['message' => 'User credentials are incorrect'], $result->getData(true));
    }

    public function test_logout_success(): void
    {
        $request = new Request();
        $tokenMock = Mockery::mock('AccessToken');
        $tokenMock->shouldReceive('revoke')->once();

        $request->setUserResolver(function () use ($tokenMock) {
            $userMock = Mockery::mock('User');
            $userMock->shouldReceive('token')->andReturn($tokenMock);
            return $userMock;
        });

        $result = $this->authService->logout($request);

        $this->assertInstanceOf(JsonResponse::class, $result);
        $this->assertEquals(200, $result->getStatusCode());
        $this->assertEquals(['message' => 'Successfully logged out'], $result->getData(true));
    }

    public function test_forgot_password_success(): void
    {
        $request = new ForgotPasswordRequest(['email' => $this->faker->unique()->safeEmail]);
        $user = new User([
            'name' => $this->faker->name,
            'email' => $request->email,
        ]);

        Mail::fake();
        $this->userRepository->shouldReceive('tryInsertingToPasswordReset')->andReturn(false);
        $this->userRepository->shouldReceive('getUserByEmail')->with($request->email)->andReturn($user);

        $result = $this->authService->forgotPassword($request);

        $this->assertInstanceOf(JsonResponse::class, $result);
        $this->assertEquals(200, $result->getStatusCode());
        $this->assertEquals(['message' => 'If a matching account was found, a password reset link has been sent to your email address.'], $result->getData(true));
        Mail::assertSent(ForgotPassword::class);
    }

    public function test_forgot_password_user_not_found(): void
    {
        $request = new ForgotPasswordRequest(['email' => $this->faker->unique()->safeEmail]);

        $this->userRepository->shouldReceive('getUserByEmail')->with($request->email)->andReturn(null);

        $result = $this->authService->forgotPassword($request);

        $this->assertInstanceOf(JsonResponse::class, $result);
        $this->assertEquals(200, $result->getStatusCode());
        $this->assertEquals(['message' => 'If a matching account was found, a password reset link has been sent to your email address'], $result->getData(true));
    }

    public function test_forgot_password_email_sending_failure(): void
    {
        $request = new ForgotPasswordRequest(['email' => $this->faker->unique()->safeEmail]);
        $user = new User([
            'name' => $this->faker->name,
            'email' => $request->email,
        ]);

        Mail::fake();
        $this->userRepository->shouldReceive('tryInsertingToPasswordReset')->andReturn(false);
        $this->userRepository->shouldReceive('getUserByEmail')->with($request->email)->andReturn($user);

        Mail::shouldReceive('to')->andThrow(new \Exception('Email sending failed'));

        $result = $this->authService->forgotPassword($request);

        $this->assertInstanceOf(JsonResponse::class, $result);
        $this->assertEquals(500, $result->getStatusCode());
        $this->assertEquals(['message' => 'Failed to send password reset email'], $result->getData(true));
    }

    public function test_reset_password_success(): void
    {
        $request = new ResetPasswordRequest([
            'email' => $this->faker->unique()->safeEmail,
            'password' => 'new_password',
            'password_confirmation' => 'new_password',
        ]);

        $user = new User([
            'name' => $this->faker->name,
            'email' => $request->email,
            'password' => Hash::make('old_password'),
        ]);

        $this->userRepository->shouldReceive('getUserByEmail')->with($request->email)->andReturn($user);
        $this->userRepository->shouldReceive('tryResettingPassword')->with($user, $request->password)->andReturn(true);

        $result = $this->authService->resetPassword($request);

        $this->assertInstanceOf(JsonResponse::class, $result);
        $this->assertEquals(200, $result->getStatusCode());
        $this->assertEquals(['message' => 'User password changed with success'], $result->getData(true));
    }

    public function test_reset_password_user_not_found(): void
    {
        $request = new ResetPasswordRequest([
            'email' => $this->faker->unique()->safeEmail,
            'password' => 'new_password',
            'password_confirmation' => 'new_password',
        ]);

        $this->userRepository->shouldReceive('getUserByEmail')->with($request->email)->andReturn(null);

        $result = $this->authService->resetPassword($request);

        $this->assertInstanceOf(JsonResponse::class, $result);
        $this->assertEquals(200, $result->getStatusCode());
        $this->assertEquals(['message' => 'User password changed with success'], $result->getData(true));
    }

    public function test_reset_password_resetting_failure(): void
    {
        $request = new ResetPasswordRequest([
            'email' => $this->faker->unique()->safeEmail,
            'password' => 'new_password',
            'password_confirmation' => 'new_password',
        ]);

        $user = new User([
            'name' => $this->faker->name,
            'email' => $request->email,
            'password' => Hash::make('old_password'),
        ]);

        $this->userRepository->shouldReceive('getUserByEmail')->with($request->email)->andReturn($user);
        $this->userRepository->shouldReceive('tryResettingPassword')->with($user, $request->password)->andReturn(false);

        $result = $this->authService->resetPassword($request);

        $this->assertInstanceOf(JsonResponse::class, $result);
        $this->assertEquals(200, $result->getStatusCode());
        $this->assertEquals(['message' => 'User password changed with success'], $result->getData(true));
    }

    public function test_get_password_reset_token_success(): void
    {
        $token = 'valid_token';

        $this->userRepository->shouldReceive('getPasswordResetToken')->with($token)->andReturn($token);

        $result = $this->authService->getPasswordResetToken($token);

        $this->assertInstanceOf(JsonResponse::class, $result);
        $this->assertEquals(200, $result->getStatusCode());
        $this->assertEquals($token, $result->getData(true));
    }

    public function test_get_password_reset_token_invalid(): void
    {
        $token = 'invalid_token';

        $this->userRepository->shouldReceive('getPasswordResetToken')->with($token)->andReturn('Invalid token');

        $result = $this->authService->getPasswordResetToken($token);

        $this->assertInstanceOf(JsonResponse::class, $result);
        $this->assertEquals(200, $result->getStatusCode());
        $this->assertEquals('Invalid token', $result->getData(true));
    }

    public function test_delete_me_success(): void
    {
        $email = $this->faker->unique()->safeEmail;

        $this->userRepository->shouldReceive('deleteUser')->with($email)->andReturn(true);

        $result = $this->authService->deleteMe($email);

        $this->assertInstanceOf(JsonResponse::class, $result);
        $this->assertEquals(200, $result->getStatusCode());
        $this->assertEquals(['message' => 'User delete success'], $result->getData(true));
    }

    public function test_delete_me_user_not_found(): void
    {
        $email = $this->faker->unique()->safeEmail;

        $this->userRepository->shouldReceive('deleteUser')->with($email)->andReturn(false);

        $result = $this->authService->deleteMe($email);

        $this->assertInstanceOf(JsonResponse::class, $result);
        $this->assertEquals(422, $result->getStatusCode());
        $this->assertEquals(['message' => 'User does not exist..'], $result->getData(true));
    }

    public function test_update_me_success(): void
    {
        $request = new UpdateUserRequest([
            'name' => $this->faker->name,
            'email' => $this->faker->unique()->safeEmail,
            'password' => 'new_password',
            'password_confirmation' => 'new_password',
        ]);

        $user = new User([
            'name' => 'Old Name',
            'email' => 'old_email@example.com',
            'password' => Hash::make('old_password'),
        ]);
        $user->id = 1;

        $this->userRepository->shouldReceive('getUserByEmail')->with($request->email)->andReturn($user);

        $result = $this->authService->updateMe($request);

        $this->assertInstanceOf(UserUpdateResource::class, $result);
        $this->assertEquals($user->id, $result->id);
        $this->assertEquals($request->name, $result->name);
        $this->assertEquals($request->email, $result->email);
        $this->assertTrue(Hash::check($request->password, $user->password));
    }

    public function test_update_me_user_not_found(): void
    {
        $request = new UpdateUserRequest([
            'name' => $this->faker->name,
            'email' => $this->faker->unique()->safeEmail,
            'password' => 'new_password',
            'password_confirmation' => 'new_password',
        ]);

        $this->userRepository->shouldReceive('getUserByEmail')->with($request->email)->andReturn(null);

        $result = $this->authService->updateMe($request);

        $this->assertInstanceOf(JsonResponse::class, $result);
        $this->assertEquals(404, $result->getStatusCode());
        $this->assertEquals(['message' => 'User not found'], $result->getData(true));
    }
}
