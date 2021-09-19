<p align="center">Origami Shop</p>

## About Project

The project represents an online origami store with dynamic child categories for parent categories. 

Has its own CMS system built from scratch that an admin can handle anything on the front-end and has a simple analytic charts (for users, orders paid, revenue).

Also contains a complete user authentication with authorization (user can register/login/logout/forgot-pass | user can have custom roles with custom permissions that allows them to view all content from the admin space or limited access) (USER -> ROLES -> PERMISSIONS).

A cart system built from scratch that handles prices/discounts/taxes automatically and decreases the quantities from products too when the order is placed.

Stripe is used as a payment integration gateway for handling orders payment.

## Main Technologies Used

<ul>
    <li>PHP (Laravel)</li>
    <li>React + React-Redux</li>
    <li>Material UI (4.0 !important; project developed before 5.0 update)</li>
    <li>SCSS</li>
</ul>

## .env important settings

<ul>
    <li>MAIL settings (i used mailtrap for testing purposes)</li>
    <li>STRIPE_KEY=</li>
    <li>STRIPE_SECRET=</li>
    <li>CASHIER_CURRENCY=</li>
</ul>

## TODO (for future)

<ul>
    <li>Improve dynamic parent categories (at the moment only child categories are dynamic), even though you can create/edit parent categories, they dont reflect on the front end yet.</li>
</ul>


### You can check out my video presentation of the project here

- **[Click Me](https://youtu.be/WrzorrncrHE)**