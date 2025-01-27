@component('mail::message')
# Password Reset Request

Hi {{ $username }},

We received a request to reset the password for your account associated with this email: **{{ $email }}**.

If you made this request, you can reset your password by clicking the button below:

@component('mail::button', ['url' => route('password.reset', ['token' => $token])])
    Reset Password
@endcomponent

If you did not request a password reset, please ignore this email. Your account remains secure.

If you have any questions or need further assistance, feel free to contact our support team.

Thank you,
The **{{ config('app.name') }}** Team
@endcomponent
