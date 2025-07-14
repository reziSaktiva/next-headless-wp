import { wp } from "@/lib/wordpress";
import PostContent from "@/components/PostContent";
import PostsPage from "./posts";
import NotFound from "@/app/not-found";

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

const renderPostContent = (post: any, featuredImageUrl: string) => (
  <div className="min-h-screen bg-gray-50">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PostContent post={post} featuredImageUrl={featuredImageUrl} />
    </div>
  </div>
);

const getFeaturedImageUrl = async (mediaId: number): Promise<string> => {
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
  // Static page as homepage
  if (settings.show_on_front === "page" && settings.page_on_front) {
    try {
      const page = await wp.getPageById(settings.page_on_front);
      const featuredImageUrl = await getFeaturedImageUrl(page.featured_media);
      return renderPostContent(page, featuredImageUrl);
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
  try {
    if (route[1]) {
      return handlePost(route[1]);
    }

    const page = await wp.getPageBySlug(slug);

    // Check if this is the posts page
    if (settings.page_for_posts && settings.page_for_posts === page.id) {
      return <PostsPage searchParams={searchParams} />;
    }

    const featuredImageUrl = await getFeaturedImageUrl(page.featured_media);
    return renderPostContent(page, featuredImageUrl);
  } catch (error) {
    console.log("Page not found, trying post...");
    return null;
  }
};

// Post handling
const handlePost = async (slug: string) => {
  try {
    const post = await wp.getPostBySlug(slug);
    const featuredImageUrl = await getFeaturedImageUrl(post.featured_media);
    return renderPostContent(post, featuredImageUrl);
  } catch (error) {
    console.log("Post not found...");
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

    // Handle homepage (empty route)
    if (!route || route.length === 0) {
      return await handleHomepage(settings, route, searchParams);
    }

    const slug = route[0];

    // Try to find a page first
    const pageResult = await handlePage(slug, settings, route, searchParams);
    if (pageResult) return pageResult;

    // If not found, return 404
    return <NotFound />;
  } catch (error) {
    console.error("Error in dynamic routing:", error);
    return <NotFound />;
  }
}
