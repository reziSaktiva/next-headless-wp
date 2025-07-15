# Struktur Routing WordPress Headless

Dokumentasi untuk struktur routing yang digunakan dalam aplikasi Next.js headless WordPress.

## Struktur URL

### 1. Homepage

```
/ - Homepage (posts atau static page)
```

### 2. Pages

```
/{page-slug} - Menampilkan page berdasarkan slug
```

Contoh:

- `/about` - Menampilkan page "About"
- `/contact` - Menampilkan page "Contact"
- `/services` - Menampilkan page "Services"

### 3. Posts (melalui Posts Page)

```
/{posts-page-slug} - Menampilkan halaman posts (archive)
/{posts-page-slug}/{post-slug} - Menampilkan single post
```

Contoh:

- `/blog` - Menampilkan halaman archive posts (jika "blog" adalah posts page)
- `/blog/my-first-post` - Menampilkan post "my-first-post"
- `/blog/another-post` - Menampilkan post "another-post"

### 4. Posts (langsung)

```
/{post-slug} - Menampilkan post langsung (jika tidak ada page dengan slug yang sama)
```

Contoh:

- `/my-standalone-post` - Menampilkan post langsung
- `/news-article` - Menampilkan post langsung

## Logika Routing

### Prioritas Pencarian

1. **Page dengan slug** - Cari page terlebih dahulu
2. **Jika ada segment kedua** - Cek apakah page tersebut adalah posts page
   - Jika ya: cari post dengan slug kedua
   - Jika tidak: return 404
3. **Jika tidak ada segment kedua** - Render page
4. **Jika page tidak ditemukan** - Coba cari sebagai post

### Contoh Alur

#### URL: `/blog/my-post`

1. Cari page dengan slug "blog" ✅
2. Cek apakah "blog" adalah posts page ✅
3. Cari post dengan slug "my-post" ✅
4. Render post "my-post"

#### URL: `/about`

1. Cari page dengan slug "about" ✅
2. Tidak ada segment kedua
3. Render page "about"

#### URL: `/standalone-post`

1. Cari page dengan slug "standalone-post" ❌
2. Page tidak ditemukan, coba sebagai post ✅
3. Render post "standalone-post"

#### URL: `/blog`

1. Cari page dengan slug "blog" ✅
2. Tidak ada segment kedua
3. Cek apakah "blog" adalah posts page ✅
4. Render posts archive page

## Konfigurasi WordPress

### Posts Page Setting

Di WordPress admin, pastikan Anda telah mengatur "Posts page":

1. Go to Settings > Reading
2. Set "Your homepage displays" ke "A static page"
3. Set "Posts page" ke page yang diinginkan (misalnya "Blog")
4. Save Changes

### Permalink Structure

Pastikan permalink structure diset ke "Post name":

1. Go to Settings > Permalinks
2. Select "Post name"
3. Save Changes

## Preview Mode

Semua struktur routing di atas mendukung preview mode:

```
/{page-slug}?preview=true
/{posts-page-slug}/{post-slug}?preview=true
/{post-slug}?preview=true
/?preview=true&p=123
```

## Error Handling

- **404 Not Found** - Jika page dan post tidak ditemukan
- **Preview Error** - Jika preview mode gagal (authentication, permission, dll)

## Debug

Untuk debug routing, buka Developer Tools dan lihat Console untuk log messages:

```
Page found: About ID: 5
Rendering page: About
```

atau

```
Page found: Blog ID: 10
This is the posts page, trying to get post: my-post
Post found: My Post Title
```
