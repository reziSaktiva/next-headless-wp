# Next.js Headless WordPress

Proyek Next.js yang menggunakan WordPress sebagai headless CMS melalui REST API.

## Fitur

- ✅ Mengambil data dari WordPress REST API
- ✅ Menampilkan posts, pages, dan categories
- ✅ Responsive design dengan Tailwind CSS
- ✅ TypeScript support
- ✅ SEO friendly dengan Next.js App Router
- ✅ Image optimization dengan Next.js Image
- ✅ Error handling dan loading states

## Prerequisites

- Node.js 18+
- WordPress installation (local atau remote)
- WordPress REST API enabled

## Setup

### 1. Install Dependencies

```bash
npm install
# atau
bun install
```

### 2. Konfigurasi Environment

Copy file `env.example` ke `.env.local` dan update nilai-nilainya:

```bash
cp env.example .env.local
```

Update `.env.local` dengan URL WordPress Anda:

```env
WORDPRESS_API_URL=http://your-wordpress-site.com/wp-json/wp/v2
NEXT_PUBLIC_WORDPRESS_API_URL=http://your-wordpress-site.com/wp-json/wp/v2
WORDPRESS_SITE_URL=http://your-wordpress-site.com
```

### 3. WordPress Setup

Pastikan WordPress Anda sudah dikonfigurasi dengan benar:

1. **Enable REST API** (sudah enabled secara default di WordPress 4.7+)
2. **Set Permalink Structure** ke "Post name" di Settings > Permalinks
3. **Create some posts** untuk testing
4. **Add featured images** ke posts untuk tampilan yang lebih baik

### 4. Test WordPress API

Test apakah WordPress API Anda berfungsi dengan mengakses:

```
http://your-wordpress-site.com/wp-json/wp/v2/posts
```

### 5. Run Development Server

```bash
npm run dev
# atau
bun dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## Struktur Proyek

```
src/
├── app/
│   └── [[...route]]/
│       └── page.tsx          # Dynamic routing untuk semua halaman
├── components/
│   ├── PostCard.tsx          # Komponen untuk preview post
│   └── PostContent.tsx       # Komponen untuk tampilan post lengkap
└── lib/
    ├── wordpress.ts          # WordPress API configuration dan functions
    └── utils.ts              # Utility functions
```

## Routes

- `/` - Homepage (menampilkan semua posts)
- `/post/[slug]` - Single post page
- `/page/[slug]` - Single page
- `/category/[slug]` - Category page

## WordPress API Endpoints

Proyek ini menggunakan endpoint WordPress REST API berikut:

- `GET /wp-json/wp/v2/posts` - Get all posts
- `GET /wp-json/wp/v2/posts?slug=[slug]` - Get post by slug
- `GET /wp-json/wp/v2/pages` - Get all pages
- `GET /wp-json/wp/v2/pages?slug=[slug]` - Get page by slug
- `GET /wp-json/wp/v2/categories` - Get all categories
- `GET /wp-json/wp/v2/media/[id]` - Get media by ID

## Customization

### Menambah Custom Fields

Jika Anda menggunakan Advanced Custom Fields (ACF), tambahkan endpoint ACF ke konfigurasi:

```env
WORDPRESS_ACF_URL=http://your-wordpress-site.com/wp-json/acf/v3
```

### Menambah Authentication

Untuk mengakses private content, tambahkan authentication:

```env
WORDPRESS_USERNAME=your_username
WORDPRESS_PASSWORD=your_application_password
```

### Styling

Proyek menggunakan Tailwind CSS. Anda bisa customize styles di:

- `src/app/globals.css`
- Komponen individual di folder `src/components/`

## Deployment

### Vercel (Recommended)

1. Push code ke GitHub
2. Connect repository ke Vercel
3. Set environment variables di Vercel dashboard
4. Deploy

### Other Platforms

1. Build project: `npm run build`
2. Set environment variables
3. Deploy sesuai platform

## Troubleshooting

### Error: "Cannot fetch from WordPress API"

1. Pastikan WordPress site Anda bisa diakses
2. Check URL di `.env.local`
3. Test API endpoint langsung di browser
4. Check CORS settings di WordPress

### Posts tidak muncul

1. Pastikan posts sudah published
2. Check WordPress permalink settings
3. Verify REST API enabled

### Images tidak muncul

1. Pastikan featured images sudah di-set di WordPress
2. Check image URLs di browser developer tools
3. Verify media library accessible

## Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

MIT License
