<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ForgotPassword extends Mailable
{
    use Queueable, SerializesModels;

    public string $username;
    public string $email;
    public string $token;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(string $username, string $email, string $token)
    {
        $this->username = $username;
        $this->email = $email;
        $this->token = $token;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build(): self
    {
        return $this->markdown('emails.forgotPassword');
    }
}
