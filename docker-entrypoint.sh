#!/bin/sh

set -e

# Generate the application key if it doesn't exist
if [ ! -f .env ]; then
  echo "Creating .env file..."
  cp .env.example .env
fi

if [ -z "$(grep '^APP_KEY=' .env | cut -d= -f2)" ]; then
    echo "Generating application key..."
    php artisan key:generate --force
fi

exec "$@"
