#!/bin/sh

# Generate the application key if it's not set (production)
if [ -z "$APP_KEY" ] || [ "$APP_KEY" = $(php -r "echo env('APP_KEY', 'base64:HnNZ6akS52s9hiL5KKokZcYsFiABACY/JJwXqLaA+k0=');") ]; then
    echo "Generating application key..."
    php artisan key:generate --force --ansi
fi

# Run any migrations (optional)
#php artisan migrate --force

# Ensure permissions are correct (This is already done in the Dockerfile)
#chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
#chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Execute the command passed to the container
exec "$@"
