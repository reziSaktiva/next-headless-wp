import { wp } from "@/lib/wordpress";
import PostContent from "@/pages/post-content";
import PostsPage from "./posts";
import NotFound from "@/app/not-found";
import PreviewBanner from "@/components/PreviewBanner";
import PreviewError from "@/components/PreviewError";

// Types
interface RouteProps {
  route: string[];
  searchParams?: { [key: string]: string | string[] | undefined };
}

interface WordPressSettings {
  show_on_front: string;
  title: string;
  description: string;
  posts_per_page?: number;
  page_on_front?: number;
  page_for_posts?: number;
}

// Helper functions
const getDefaultSettings = (): WordPressSettings => ({
  show_on_front: "posts",
  title: "WordPress Site",
  description: "A WordPress powered site",
  posts_per_page: 10,
});

const getWordPressSettings = async (): Promise<WordPressSettings> => {
  try {
    return await wp.getFrontSettings();
  } catch (error) {
    console.log("Front settings not accessible, using defaults");
    return getDefaultSettings();
  }
};

const renderPostContent = (
  post: any,
  featuredImageUrl: string | undefined,
  isPreview: boolean = false
) => (
  <div className="min-h-screen bg-gray-50">
    {isPreview && <PreviewBanner />}
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PostContent post={post} featuredImageUrl={featuredImageUrl} />
    </div>
  </div>
);

const getFeaturedImageUrl = async (
  mediaId: number
): Promise<string | undefined> => {
  try {
    return await wp.getFeaturedImageUrl(mediaId);
  } catch (error) {
    console.log("Failed to get featured image:", error);
    return "";
  }
};

// Homepage handling
const handleHomepage = async (
  settings: WordPressSettings,
  route: string[],
  searchParams?: { [key: string]: string | string[] | undefined }
) => {
  const isPreview = searchParams?.preview === "true";

  // Static page as homepage
  if (settings.show_on_front === "page" && settings.page_on_front) {
    try {
      const page = await wp.getPageById(settings.page_on_front, isPreview);
      const featuredImageUrl = await getFeaturedImageUrl(page.featured_media);
      return renderPostContent(page, featuredImageUrl, isPreview);
    } catch (error) {
      console.error("Error fetching front page:", error);
      return <NotFound />;
    }
  }

  // Posts as homepage
  if (settings.show_on_front === "posts") {
    return <PostsPage searchParams={searchParams} />;
  }

  return <NotFound />;
};

// Page handling
const handlePage = async (
  slug: string,
  settings: WordPressSettings,
  route: string[],
  searchParams?: { [key: string]: string | string[] | undefined }
) => {
  const isPreview = searchParams?.preview === "true";

  try {
    // First, try to get the page
    const page = await wp.getPageBySlug(slug, isPreview);

    // If there's a second segment in the route, it might be a post slug
    if (route[1]) {
      // Check if this page is the posts page
      if (settings.page_for_posts && settings.page_for_posts === page.id) {
        // Try to get the post
        try {
          const post = await wp.getPostBySlug(route[1], isPreview);
          const featuredImageUrl = await getFeaturedImageUrl(
            post.featured_media
          );
          return renderPostContent(post, featuredImageUrl, isPreview);
        } catch (postError) {
          return <NotFound />;
        }
      } else {
        return <NotFound />;
      }
    }

    // If no second segment, check if this is the posts page
    if (settings.page_for_posts && settings.page_for_posts === page.id) {
      // This is the posts page, render posts archive
      return <PostsPage searchParams={searchParams} />;
    }

    // If not posts page, render the page
    const featuredImageUrl = await getFeaturedImageUrl(page.featured_media);
    return renderPostContent(page, featuredImageUrl, isPreview);
  } catch (error) {
    return null;
  }
};

// Post handling
const handlePost = async (slug: string, isPreview: boolean = false) => {
  try {
    const post = await wp.getPostBySlug(slug, isPreview);
    const featuredImageUrl = await getFeaturedImageUrl(post.featured_media);
    return renderPostContent(post, featuredImageUrl, isPreview);
  } catch (error) {
    return null;
  }
};

// Main component
export default async function DynamicPageRoute({
  route,
  searchParams,
}: RouteProps) {
  try {
    const settings = await getWordPressSettings();

    const isPreview = searchParams?.preview === "true";
    const previewId = searchParams?.p;

    // Handle preview with ID
    if (isPreview && previewId) {
      // Check if authentication is configured
      if (!process.env.WORDPRESS_USERNAME || !process.env.WORDPRESS_PASSWORD) {
        return (
          <PreviewError error="Preview requires authentication. Please configure WORDPRESS_USERNAME and WORDPRESS_PASSWORD in .env.local" />
        );
      }

      const postId = parseInt(previewId as string);
      if (!isNaN(postId)) {
        try {
          // Try to get as post first
          const post = await wp.getPostById(postId, true);
          const featuredImageUrl = await getFeaturedImageUrl(
            post.featured_media
          );
          return renderPostContent(post, featuredImageUrl, true);
        } catch (error) {
          try {
            // Try to get as page
            const page = await wp.getPageById(postId, true);
            const featuredImageUrl = await getFeaturedImageUrl(
              page.featured_media
            );
            return renderPostContent(page, featuredImageUrl, true);
          } catch (pageError) {
            return (
              <PreviewError error="Post or page not found" postId={postId} />
            );
          }
        }
      } else {
        return <PreviewError error="Invalid preview ID format" />;
      }
    }

    // Handle homepage (empty route)
    if (!route || route.length === 0) {
      return await handleHomepage(settings, route, searchParams);
    }

    const slug = route[0];

    // Try to find a page first
    const pageResult = await handlePage(slug, settings, route, searchParams);
    if (pageResult) return pageResult;

    // If page not found and no second segment, try as post
    if (!route[1]) {
      try {
        const post = await wp.getPostBySlug(slug, isPreview);
        const featuredImageUrl = await getFeaturedImageUrl(post.featured_media);
        return renderPostContent(post, featuredImageUrl, isPreview);
      } catch (postError) {
        // Post not found, continue to 404
      }
    }

    // If not found, return 404
    return <NotFound />;
  } catch (error) {
    return <NotFound />;
  }
}
