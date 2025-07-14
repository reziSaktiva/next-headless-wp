import { wp } from "@/lib/wordpress";
import PostCard from "@/components/PostCard";
import Pagination from "@/components/Pagination";

// Posts page component (when WordPress has static homepage)
export default async function PostsPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  try {
    const params = searchParams;
    const currentPage = params?.page ? parseInt(params.page as string) : 1;
    const perPage = 6;

    const { posts, totalPosts, totalPages } = await wp.getPosts({
      per_page: perPage,
      page: currentPage,
      orderby: "date",
      order: "desc",
    });

    // Get WordPress settings for title (with fallback)
    let settings;
    try {
      settings = await wp.getFrontSettings();
    } catch (error) {
      console.log("Front settings not accessible, using defaults");
      settings = {
        title: "WordPress Site",
        description: "A WordPress powered site",
      };
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {settings.title}
            </h1>
            <p className="text-xl text-gray-600">{settings.description}</p>
          </header>

          {posts.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Tidak ada post tersedia
              </h2>
              <p className="text-gray-600">
                Pastikan WordPress Anda sudah berjalan dan memiliki post.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {posts.map(async (post: any) => {
                  const featuredImageUrl = post.featured_media
                    ? await wp.getFeaturedImageUrl(post.featured_media)
                    : "";

                  return (
                    <PostCard
                      key={post.id}
                      post={post}
                      featuredImageUrl={featuredImageUrl}
                    />
                  );
                })}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalPosts={totalPosts}
              />
            </>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Error Loading Posts
          </h1>
          <p className="text-gray-600 mb-4">
            Tidak dapat mengambil data dari WordPress API.
          </p>
        </div>
      </div>
    );
  }
}
