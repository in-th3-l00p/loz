FROM php:8.1-apache

USER root

WORKDIR /var/www/html

RUN apt update && apt install -y \
        nodejs \
        npm \
        libpng-dev \
        zlib1g-dev \
        libxml2-dev \
        libzip-dev \
        libonig-dev \
        zip \
        curl \
        unzip \
    && docker-php-ext-configure gd \
    && docker-php-ext-install -j$(nproc) gd \
    && docker-php-ext-install pdo_mysql \
    && docker-php-ext-install mysqli \
    && docker-php-ext-install zip \
    && docker-php-source delete

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

COPY . .
RUN composer install

COPY vhost.conf /etc/apache2/sites-available/000-default.conf
RUN chown -R 775:775 /var/www/html \
    && chmod 775 -R /var/www/html \
    && a2enmod rewrite
RUN php artisan key:generate
