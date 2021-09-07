<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ForgotPassword extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $token;

    /**
     * Create a new message instance.
     *
     * @return void
     * 
     * $data comes from the forgotPassword() inside the AuthController
     * it contains data from the user with the requested email
     * and a randomly 60 characters generated token
     */
    public function __construct($data)
    {
        $this->user     = $data['user'];
        $this->token    = $data['token'];
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->markdown('emails.forgotPassword');
    }
}
