<p align="center"><h1>Origami Shop</h1></p>

## 2025 Update

The project has undergone significant improvements in January 2025:

### Backend Refactor
- Updated code architecture by implementing controller, service, repository, and model layers
- Implemented requests and resources (response) classes for all API calls
- Fixed and optimized code and updated composer packages to their newest version (as of January 2025)
- Added tests for service layer
- Added models factory seeders

### Frontend Refactor
- Added TypeScript support and used React Redux Toolkit
- Updated all packages and optimized React component code
- Removed redundant files
- Updated the Redux workflow store

#### Note
- Frontend might be missing some background and logo images and design in some areas is changed (unlike as seen in the old video presentation)

## Getting Started

```bash
# Clone the repository
git clone https://github.com/OblivionLi/origami.git
cd origami-shop

# Install PHP dependencies
composer install

# Install JavaScript dependencies
npm install

# Create .env file from example
cp .env.example .env

# Generate application key
php artisan key:generate

# Run migrations and seeders
php artisan migrate --seed

# Deploy Passport
php artisan passport:keys

# Start development servers
php artisan serve  # Backend server
npm run dev        # Frontend development server

# Alternatively, use Docker
docker-compose build
docker-compose up -d
```

## About Project (OLD Readme contents bellow)

The project represents an online origami store with dynamic child categories for parent categories.

It has its own CMS system built from scratch that allows an admin to manage anything on the front-end and provides simple analytics charts (for users, orders paid, revenue).

The system contains a complete user authentication with authorization (users can register/login/logout/reset password). Users can have custom roles with custom permissions that allow them to view all content from the admin space or have limited access (USER -> ROLES -> PERMISSIONS).

A cart system built from scratch handles prices/discounts/taxes automatically and decreases product quantities when an order is placed.

Stripe is integrated as a payment gateway for handling order payments.

## Main Technologies Used

- PHP (Laravel)
- React + React-Redux
- Material UI (4.0 !important; project developed before 5.0 update)
- SCSS

## Important .env Settings

- MAIL settings (I used Mailtrap for testing purposes)
- STRIPE_KEY=
- STRIPE_SECRET=
- CASHIER_CURRENCY=

## TODO (for future)

- Improve dynamic parent categories (at the moment only child categories are dynamic). Even though you can create/edit parent categories, they don't reflect on the front end yet.

## Project Demonstration

You can check out my video presentation of the project here:
* **[Click Me](#)**
