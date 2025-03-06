# --- Stage 1: Frontend Build ---
FROM node:20-alpine AS frontend-builder

WORKDIR /var/www/html/frontend

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install --force

# Copy frontend source code
COPY resources ./resources
COPY vite.config.ts ./
COPY tsconfig.json ./
COPY tsconfig.node.json ./

# Build the frontend
RUN npm run build


# --- Stage 2: PHP/Laravel Build ---
FROM php:8.4-fpm-alpine

ARG APP_ENV=production
ENV APP_ENV=${APP_ENV}

# Install system dependencies
RUN apk add --no-cache \
    bash \
    git \
    curl \
    libpng-dev \
    libjpeg-turbo-dev \
    libwebp-dev \
    libxpm-dev \
    freetype-dev \
    libzip-dev \
    oniguruma-dev \
    postgresql-dev \
    zip \
    unzip \
    nodejs \
    npm

# Clear cache
RUN rm -rf /var/cache/apk/*

# Install PHP extensions (adjust as needed for your project)
RUN docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp --with-xpm \
    && docker-php-ext-install -j$(nproc) gd \
    && docker-php-ext-install pdo pdo_mysql zip bcmath exif pcntl

# Install composer (latest version)
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy Laravel files
COPY --chown=www-data:www-data . .

# Copy built frontend assets from the previous stage
COPY --from=frontend-builder /var/www/html/frontend/public/build ./public/build

# Install composer dependencies *without* running scripts.
RUN composer install --optimize-autoloader --no-dev --no-scripts

# --- CLEAR CACHES BEFORE COMPOSER INSTALL ---
RUN php artisan optimize:clear

# Set permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Expose port 9000 for PHP-FPM
EXPOSE 9000

# Entrypoint:  Runs key generation and starts PHP-FPM
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT ["docker-entrypoint.sh"]

CMD ["php-fpm"]
