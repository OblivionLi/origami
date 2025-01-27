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
use Exception;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Laravel\Passport\Passport;
use Mockery;
use Mockery\MockInterface;
use Tests\TestCase;

class AuthServiceTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected AuthService $authService;
    protected MockInterface $roleRepositoryMock;
    protected MockInterface $userRepositoryMock;

    public function setUp(): void
    {
        parent::setUp();

        $this->roleRepositoryMock = Mockery::mock(RoleRepository::class);
        $this->userRepositoryMock = Mockery::mock(UserRepository::class);

        $this->authService = new AuthService(
            $this->roleRepositoryMock,
            $this->userRepositoryMock
        );
    }

    public function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function testRegisterSuccess(): void
    {
        $requestData = [
            'name' => $this->faker->name,
            'email' => $this->faker->unique()->safeEmail,
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'remember_me' => true
        ];

        $request = new RegisterUserRequest($requestData);
        $request->setMethod('POST');
        $request->merge($requestData);

        $role = new Role(['name' => 'Guest']);
        $role->id = 1;

        $user = new User($requestData);
        $user->id = 1;

        $this->roleRepositoryMock->shouldReceive('getOrCreateRole')->once()->with('Guest')->andReturn($role);
        $this->userRepositoryMock->shouldReceive('createUserWithRole')->once()->with($role->id, Mockery::type(RegisterUserRequest::class))->andReturn($user);
        $this->userRepositoryMock->shouldReceive('createUserToken')->once()->with(true, $user)->andReturn('access-token');

        $response = $this->authService->register($request);

        $this->assertInstanceOf(RegisterUserResource::class, $response);
    }

    public function testRegisterFailure(): void
    {
        $requestData = [
            'name' => $this->faker->name,
            'email' => $this->faker->unique()->safeEmail,
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'remember_me' => true
        ];

        $request = new RegisterUserRequest($requestData);
        $request->setMethod('POST');
        $request->merge($requestData);

        $role = new Role(['name' => 'Guest']);
        $role->id = 1;

        $this->roleRepositoryMock->shouldReceive('getOrCreateRole')->once()->with('Guest')->andReturn($role);
        $this->userRepositoryMock->shouldReceive('createUserWithRole')->once()->with($role->id, Mockery::type(RegisterUserRequest::class))->andReturn(null);

        $response = $this->authService->register($request);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(500, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(json_encode(['message' => 'Failed to register user']), $response->getContent());
    }

    public function testLoginSuccess(): void
    {
        $requestData = [
            'email' => $this->faker->unique()->safeEmail,
            'password' => 'password123',
            'remember_me' => true
        ];

        $request = new LoginUserRequest();
        $request->merge($requestData);

        $user = new User([
            'name' => $this->faker->name,
            'email' => $requestData['email'],
            'password' => Hash::make($requestData['password'])
        ]);
        $user->id = 1;

        $this->userRepositoryMock->shouldReceive('getUserByEmail')->once()->with($requestData['email'])->andReturn($user);
        $this->userRepositoryMock->shouldReceive('createUserToken')->once()->with($requestData['remember_me'], $user)->andReturn('access-token');

        $response = $this->authService->login($request);

        $this->assertInstanceOf(LoginUserResource::class, $response);
    }

    public function testLoginFailureInvalidCredentials(): void
    {
        $requestData = [
            'email' => $this->faker->unique()->safeEmail,
            'password' => 'wrongpassword',
            'remember_me' => true
        ];

        $request = new LoginUserRequest();
        $request->merge($requestData);

        $user = new User([
            'name' => $this->faker->name,
            'email' => $requestData['email'],
            'password' => Hash::make('password123')
        ]);
        $user->id = 1;

        $this->userRepositoryMock->shouldReceive('getUserByEmail')->once()->with($requestData['email'])->andReturn($user);

        $response = $this->authService->login($request);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(422, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(json_encode(['message' => 'User credentials are incorrect']), $response->getContent());
    }

    public function testLogoutSuccess(): void
    {
        $user = User::factory()->create();
        Passport::actingAs($user);

        $token = Mockery::mock(\stdClass::class);
        $token->shouldReceive('revoke')->once();

        $request = Mockery::mock(Request::class);
        $request->shouldReceive('user')->andReturn($user);
        $user->shouldReceive('token')->andReturn($token);

        $response = $this->authService->logout($request);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(json_encode(['message' => 'Successfully logged out']), $response->getContent());
    }

    public function testForgotPasswordSuccess(): void
    {
        $email = $this->faker->unique()->safeEmail;

        $request = new ForgotPasswordRequest();
        $request->merge(['email' => $email]);

        $user = User::factory()->make(['email' => $email]);

        User::unguard();
        $userMock = Mockery::mock(User::class . '[first]');
        $userMock->shouldReceive('first')
            ->once()
            ->andReturn($user);
        $this->app->instance(User::class, $userMock);
        User::reguard();

        $this->userRepositoryMock->shouldReceive('tryInsertingToPasswordReset')->once()->with($email, Mockery::any())->andReturn(false);
        Mail::fake();

        $response = $this->authService->forgotPassword($request);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(200, $response->getStatusCode());
        Mail::assertSent(ForgotPassword::class, function ($mail) use ($user) {
            return $mail->hasTo($user->email);
        });
    }

    public function testForgotPasswordUserNotFound(): void
    {
        $request = new ForgotPasswordRequest();
        $request->merge(['email' => 'nonexistent@example.com']);

        User::unguard();
        $userMock = Mockery::mock(User::class . '[first]');
        $userMock->shouldReceive('first')
            ->once()
            ->andReturn(null);
        $this->app->instance(User::class, $userMock);
        User::reguard();

        $response = $this->authService->forgotPassword($request);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(json_encode(['message' => 'If a matching account was found, a password reset link has been sent to your email address']), $response->getContent());
    }

    public function testForgotPasswordEmailSendingFailure(): void
    {
        $email = $this->faker->unique()->safeEmail;

        $request = new ForgotPasswordRequest();
        $request->merge(['email' => $email]);

        $user = User::factory()->make(['email' => $email]);

        User::unguard();
        $userMock = Mockery::mock(User::class . '[first]');
        $userMock->shouldReceive('first')
            ->once()
            ->andReturn($user);
        $this->app->instance(User::class, $userMock);
        User::reguard();

        $this->userRepositoryMock->shouldReceive('tryInsertingToPasswordReset')->once()->with($email, Mockery::any())->andReturn(false);
        Mail::fake();
        Mail::shouldReceive('to')
            ->once()
            ->andThrow(new Exception('Email sending failed'));

        $response = $this->authService->forgotPassword($request);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(500, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(json_encode(['message' => 'Failed to send password reset email']), $response->getContent());
    }

    public function testResetPasswordSuccess(): void
    {
        $user = User::factory()->create();
        $token = Str::random(60);

        DB::table('password_resets')->insert([
            'email' => $user->email,
            'token' => $token,
            'created_at' => now()
        ]);

        $request = new ResetPasswordRequest();
        $request->merge([
            'token' => $token,
            'email' => $user->email,
            'password' => 'new_password',
            'password_confirmation' => 'new_password'
        ]);

        $this->userRepositoryMock->shouldReceive('tryResettingPassword')->once()->andReturn(true);

        $response = $this->authService->resetPassword($request);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(200, $response->getStatusCode());
    }

    public function testResetPasswordUserNotFound(): void
    {
        $request = new ResetPasswordRequest();
        $request->merge([
            'token' => 'some_token',
            'email' => 'nonexistent@example.com',
            'password' => 'new_password',
            'password_confirmation' => 'new_password'
        ]);

        User::unguard();
        $userMock = Mockery::mock(User::class . '[first]');
        $userMock->shouldReceive('first')
            ->once()
            ->andReturn(null);
        $this->app->instance(User::class, $userMock);
        User::reguard();

        $response = $this->authService->resetPassword($request);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(200, $response->getStatusCode());
    }

    public function testGetPasswordResetTokenSuccess(): void
    {
        $token = Str::random(60);
        $email = $this->faker->unique()->safeEmail;

        DB::table('password_resets')->insert([
            'email' => $email,
            'token' => $token,
            'created_at' => now()
        ]);

        $this->userRepositoryMock->shouldReceive('getPasswordResetToken')->once()->with($token)->andReturn($token);

        $response = $this->authService->getPasswordResetToken($token);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(json_encode($token), $response->getContent());
    }

    public function testDeleteMeSuccess(): void
    {
        $email = $this->faker->unique()->safeEmail;

        $this->userRepositoryMock->shouldReceive('deleteUser')->once()->with($email)->andReturn(true);

        $response = $this->authService->deleteMe($email);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(json_encode(['message' => 'User delete success']), $response->getContent());
    }

    public function testDeleteMeUserNotFound(): void
    {
        $email = $this->faker->unique()->safeEmail;

        $this->userRepositoryMock->shouldReceive('deleteUser')->once()->with($email)->andReturn(false);

        $response = $this->authService->deleteMe($email);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(422, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(json_encode(['message' => 'User does not exist..']), $response->getContent());
    }

    public function testUpdateMeSuccess(): void
    {
        $userData = [
            'name' => $this->faker->name,
            'email' => $this->faker->unique()->safeEmail,
            'password' => 'password123'
        ];

        $request = new UpdateUserRequest();
        $request->merge($userData);

        $user = new User($userData);

        $this->userRepositoryMock->shouldReceive('getUserByEmail')->once()->with($userData['email'])->andReturn($user);

        $response = $this->authService->updateMe($request);

        $this->assertInstanceOf(UserUpdateResource::class, $response);
    }

    public function testUpdateMeUserNotFound(): void
    {
        $request = new UpdateUserRequest();
        $request->merge([
            'name' => $this->faker->name,
            'email' => $this->faker->unique()->safeEmail,
            'password' => 'password123'
        ]);

        $this->userRepositoryMock->shouldReceive('getUserByEmail')->once()->with($request->email)->andReturn(null);

        $response = $this->authService->updateMe($request);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(404, $response->getStatusCode());
        $this->assertJsonStringEqualsJsonString(json_encode(['message' => 'User not found']), $response->getContent());
    }
}
