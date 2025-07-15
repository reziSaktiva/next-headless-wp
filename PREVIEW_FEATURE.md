# Fitur Preview WordPress

Fitur preview memungkinkan Anda untuk melihat draft, pending, dan published posts/pages sebelum mereka dipublikasikan secara publik.

## Cara Menggunakan Preview

### 1. Preview dengan Slug

Untuk melihat preview dari post atau page berdasarkan slug:

```
# Preview page
http://localhost:3000/page-slug?preview=true

# Preview post langsung
http://localhost:3000/post-slug?preview=true

# Preview post melalui posts page
http://localhost:3000/posts-page-slug/post-slug?preview=true
```

### 2. Preview dengan ID

Untuk melihat preview dari post atau page berdasarkan ID:

```
http://localhost:3000/?preview=true&p=123
```

Dimana `123` adalah ID dari post atau page yang ingin di-preview.

### 3. Preview Homepage

Untuk melihat preview dari homepage (jika menggunakan static page):

```
http://localhost:3000/?preview=true
```

## Konfigurasi WordPress

### 1. Authentication

Pastikan Anda telah mengkonfigurasi authentication di file `.env.local`:

```env
WORDPRESS_USERNAME=your_username
WORDPRESS_PASSWORD=your_application_password
```

**Penting:** Gunakan Application Password, bukan password login biasa!

### 2. Application Password

Untuk membuat application password di WordPress:

1. Login ke WordPress admin
2. Go to Users > Profile
3. Scroll ke bagian "Application Passwords"
4. Generate new password
5. Copy password dan paste ke `.env.local`

## Status yang Didukung

Preview mode akan menampilkan content dengan status:

- `draft` - Draft posts/pages
- `pending` - Pending review posts/pages
- `publish` - Published posts/pages

## Indikator Preview

Ketika preview mode aktif, akan muncul banner kuning di bagian atas halaman dengan teks:
"🔍 Preview Mode - This is a draft/preview version"

## Keamanan

- Preview hanya tersedia jika authentication dikonfigurasi dengan benar
- Tanpa authentication, preview akan menampilkan 404 error
- Preview tidak akan muncul di search engines karena menggunakan parameter URL

## Troubleshooting

### Preview tidak muncul

1. Pastikan authentication dikonfigurasi dengan benar
2. Check apakah post/page dengan ID/slug tersebut ada
3. Pastikan post/page memiliki status draft, pending, atau publish
4. Check console browser untuk error messages

### Error 404 pada preview

1. Pastikan ID post/page benar
2. Check apakah post/page bisa diakses dengan authentication
3. Verify WordPress REST API berfungsi dengan baik

### Authentication error

1. Pastikan username dan password benar
2. Gunakan application password, bukan password login biasa
3. Check apakah user memiliki permission untuk membaca posts/pages

### Preview redirect ke homepage

Jika preview dengan ID redirect ke homepage, kemungkinan penyebabnya:

1. **Authentication tidak dikonfigurasi** - Pastikan `WORDPRESS_USERNAME` dan `WORDPRESS_PASSWORD` sudah diset di `.env.local`
2. **Post/Page tidak ditemukan** - Check apakah ID post/page benar dan ada di WordPress
3. **Permission error** - Pastikan user memiliki akses untuk membaca content tersebut
4. **Status content** - Pastikan content memiliki status draft, pending, atau publish

### Debug Preview

Untuk debug preview, buka Developer Tools di browser dan lihat Console untuk melihat log messages:

```
Preview mode detected with ID: 2726
Attempting to fetch preview for ID: 2726
Trying to fetch as post...
Post found: [Title]
```

atau error messages:

```
Authentication not configured for preview
Post not found, trying as page...
Preview not found for ID: 2726
```
