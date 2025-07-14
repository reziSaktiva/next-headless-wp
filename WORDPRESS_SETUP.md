# WordPress Setup untuk Headless CMS

Dokumentasi lengkap untuk mengkonfigurasi WordPress sebagai headless CMS untuk Next.js.

## 1. Install WordPress

### Opsi A: Local Development dengan Local by Flywheel

1. Download [Local by Flywheel](https://localwp.com/)
2. Install dan buat site baru
3. Pilih environment "Local Lightning"
4. Set site name dan admin credentials

### Opsi B: Manual Installation

1. Download WordPress dari [wordpress.org](https://wordpress.org/download/)
2. Setup database MySQL/MariaDB
3. Extract dan konfigurasi wp-config.php
4. Run installation wizard

### Opsi C: Docker

```bash
# Create docker-compose.yml
version: '3'
services:
  wordpress:
    image: wordpress:latest
    ports:
      - "8000:80"
    environment:
      WORDPRESS_DB_HOST: db
      WORDPRESS_DB_USER: wordpress
      WORDPRESS_DB_PASSWORD: wordpress
      WORDPRESS_DB_NAME: wordpress
    volumes:
      - wordpress_data:/var/www/html
    depends_on:
      - db

  db:
    image: mysql:5.7
    environment:
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wordpress
      MYSQL_PASSWORD: wordpress
      MYSQL_ROOT_PASSWORD: somewordpress
    volumes:
      - db_data:/var/lib/mysql

volumes:
  wordpress_data:
  db_data:

# Run dengan docker-compose up -d
```

## 2. WordPress Configuration

### Enable REST API

REST API sudah enabled secara default di WordPress 4.7+. Untuk memastikan:

1. Login ke WordPress admin
2. Go to Settings > Permalinks
3. Select "Post name" (recommended)
4. Save Changes

### Test REST API

Akses endpoint berikut di browser:

```
http://your-wordpress-site.com/wp-json/wp/v2/posts
```

Jika berhasil, Anda akan melihat JSON response dengan data posts.

### Configure CORS (jika diperlukan)

Jika mengalami CORS issues, tambahkan plugin "WP REST API - CORS" atau tambahkan kode berikut ke `functions.php`:

```php
// Add to functions.php
add_action('init', function() {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
});
```

## 3. Create Sample Content

### Create Posts

1. Go to Posts > Add New
2. Create beberapa posts dengan konten yang berbeda
3. Set featured images untuk visual yang lebih baik
4. Add categories dan tags

### Create Pages

1. Go to Pages > Add New
2. Create pages seperti "About", "Contact", dll
3. Set featured images jika diperlukan

### Create Categories

1. Go to Posts > Categories
2. Create categories seperti "Technology", "Lifestyle", "News"
3. Assign posts ke categories

## 4. Media Library Setup

### Upload Images

1. Go to Media > Add New
2. Upload beberapa images
3. Set alt text untuk accessibility
4. Note the image URLs untuk testing

### Image Sizes

WordPress secara default membuat beberapa image sizes:

- Thumbnail (150x150)
- Medium (300x300)
- Large (1024x1024)
- Full size

## 5. Advanced Configuration

### Custom Post Types (Optional)

Jika ingin custom post types, tambahkan ke `functions.php`:

```php
// Register Custom Post Type
function create_custom_post_type() {
    register_post_type('portfolio',
        array(
            'labels' => array(
                'name' => __('Portfolio'),
                'singular_name' => __('Portfolio Item')
            ),
            'public' => true,
            'has_archive' => true,
            'supports' => array('title', 'editor', 'thumbnail'),
            'show_in_rest' => true, // Important for REST API
        )
    );
}
add_action('init', 'create_custom_post_type');
```

### Advanced Custom Fields (ACF)

1. Install plugin "Advanced Custom Fields"
2. Create custom fields
3. Enable REST API untuk ACF fields
4. Access via `/wp-json/acf/v3/` endpoint

### Authentication (Optional)

Untuk private content, setup authentication:

1. Create Application Password:

   - Go to Users > Profile
   - Scroll to "Application Passwords"
   - Generate new password

2. Use Basic Auth atau JWT tokens

## 6. Security Considerations

### Disable XML-RPC

```php
// Add to functions.php
add_filter('xmlrpc_enabled', '__return_false');
```

### Limit REST API Access

```php
// Add to functions.php
add_filter('rest_authentication_errors', function($result) {
    if (!empty($result)) {
        return $result;
    }
    if (!is_user_logged_in()) {
        return new WP_Error('rest_not_logged_in', 'You are not currently logged in.', array('status' => 401));
    }
    return $result;
});
```

### Rate Limiting

Install plugin seperti "WP REST API - Rate Limiting" untuk mencegah abuse.

## 7. Performance Optimization

### Caching

1. Install caching plugin seperti "WP Rocket" atau "W3 Total Cache"
2. Enable REST API caching
3. Set appropriate cache headers

### Image Optimization

1. Install "Smush" atau "ShortPixel" untuk image compression
2. Use WebP format jika memungkinkan
3. Implement lazy loading

### Database Optimization

1. Regular database cleanup
2. Optimize database tables
3. Use database caching

## 8. Testing

### Test API Endpoints

```bash
# Test posts endpoint
curl http://your-wordpress-site.com/wp-json/wp/v2/posts

# Test single post
curl http://your-wordpress-site.com/wp-json/wp/v2/posts/1

# Test categories
curl http://your-wordpress-site.com/wp-json/wp/v2/categories

# Test media
curl http://your-wordpress-site.com/wp-json/wp/v2/media
```

### Test with Next.js

1. Set environment variables di `.env.local`
2. Run `npm run dev`
3. Check browser console untuk errors
4. Verify data loading

## 9. Troubleshooting

### Common Issues

**CORS Errors**

- Install CORS plugin
- Check server configuration
- Verify domain settings

**404 Errors**

- Check permalink settings
- Verify .htaccess file
- Check server rewrite rules

**Slow Loading**

- Enable caching
- Optimize images
- Check database performance

**Authentication Issues**

- Verify credentials
- Check application passwords
- Test with Postman/curl

### Debug Mode

Enable WordPress debug mode di `wp-config.php`:

```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
```

## 10. Production Deployment

### WordPress Hosting

- Use reliable hosting provider
- Enable SSL certificate
- Configure CDN for images
- Set up regular backups

### Environment Variables

Set production environment variables:

```env
WORDPRESS_API_URL=https://your-production-site.com/wp-json/wp/v2
WORDPRESS_SITE_URL=https://your-production-site.com
```

### Monitoring

- Set up uptime monitoring
- Monitor API response times
- Track error rates
- Set up alerts

## 11. Maintenance

### Regular Tasks

- Update WordPress core
- Update plugins and themes
- Backup database and files
- Monitor performance
- Check security logs

### Backup Strategy

- Daily database backups
- Weekly full site backups
- Store backups off-site
- Test restore procedures

## 12. Resources

### Documentation

- [WordPress REST API Handbook](https://developer.wordpress.org/rest-api/)
- [Next.js Documentation](https://nextjs.org/docs)
- [WordPress Developer Resources](https://developer.wordpress.org/)

### Tools

- [Postman](https://www.postman.com/) - API testing
- [Insomnia](https://insomnia.rest/) - API client
- [Local by Flywheel](https://localwp.com/) - Local development

### Plugins

- [WP REST API - CORS](https://wordpress.org/plugins/wp-rest-api-cors/)
- [Advanced Custom Fields](https://wordpress.org/plugins/advanced-custom-fields/)
- [WP REST API - Rate Limiting](https://wordpress.org/plugins/wp-rest-api-rate-limiting/)
