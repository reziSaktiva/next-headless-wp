// WordPress API Configuration
export const WORDPRESS_CONFIG = {
  apiUrl:
    process.env.WORDPRESS_API_URL || "http://localhost:8000/wp-json/wp/v2",
  siteUrl: process.env.WORDPRESS_SITE_URL || "http://localhost:8000",
  menusUrl:
    process.env.WORDPRESS_MENUS_URL ||
    "http://localhost:8000/wp-json/wp/v2/menus",
  acfUrl:
    process.env.WORDPRESS_ACF_URL || "http://localhost:8000/wp-json/acf/v3",
};

// Helper function for API calls
async function wpFetch(endpoint: string, params?: Record<string, any>) {
  // Ensure the endpoint starts with /wp-json/wp/v2/ if it doesn't already
  const fullEndpoint = endpoint.startsWith("/wp-json/")
    ? endpoint
    : `/wp-json/wp/v2${endpoint}`;
  const url = new URL(fullEndpoint, WORDPRESS_CONFIG.siteUrl);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      mode: "cors",
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("API Error:", response.status, text.substring(0, 500));
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Non-JSON response:", text.substring(0, 1000));
      console.error("Full response text:", text);
      throw new Error("API returned non-JSON response");
    }

    const data = await response.json();

    // Check for total posts in headers
    const totalPostsHeader = response.headers.get("x-wp-total");
    const totalPagesHeader = response.headers.get("x-wp-totalpages");

    if (totalPostsHeader) {
      console.log("Total posts from header:", totalPostsHeader);
    }
    if (totalPagesHeader) {
      console.log("Total pages from header:", totalPagesHeader);
    }

    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

// WordPress API endpoints
export const WP_ENDPOINTS = {
  posts: "/posts",
  pages: "/pages",
  categories: "/categories",
  tags: "/tags",
  users: "/users",
  media: "/media",
  menus: "/menus",
  acf: "/acf",
  settings: "/settings?embed=true",
  site: "/",
} as const;

// Types for WordPress data
export interface WPPost {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  meta: any[];
  _links: any;
  categories: number[];
  tags: number[];
  yoast_head_json?: {
    title?: string;
    description?: string;
    robots?: {
      index?: string;
      follow?: string;
      "max-snippet"?: string;
      "max-image-preview"?: string;
      "max-video-preview"?: string;
    };
    canonical?: string;
    og_locale?: string;
    og_type?: string;
    og_title?: string;
    og_description?: string;
    og_url?: string;
    og_site_name?: string;
    article_published_time?: string;
    og_image?: Array<{
      url?: string;
      width?: number;
      height?: number;
      type?: string;
    }>;
    author?: string;
    twitter_card?: string;
    twitter_misc?: {
      "Written by"?: string;
      "Est. reading time"?: string;
    };
    schema?: any;
  };
}

export interface WPPage {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  parent: number;
  menu_order: number;
  comment_status: string;
  ping_status: string;
  template: string;
  meta: any[];
  _links: any;
  yoast_head_json?: {
    title?: string;
    description?: string;
    robots?: {
      index?: string;
      follow?: string;
      "max-snippet"?: string;
      "max-image-preview"?: string;
      "max-video-preview"?: string;
    };
    canonical?: string;
    og_locale?: string;
    og_type?: string;
    og_title?: string;
    og_description?: string;
    og_url?: string;
    og_site_name?: string;
    article_published_time?: string;
    og_image?: Array<{
      url?: string;
      width?: number;
      height?: number;
      type?: string;
    }>;
    author?: string;
    twitter_card?: string;
    twitter_misc?: {
      "Written by"?: string;
      "Est. reading time"?: string;
    };
    schema?: any;
  };
}

export interface WPCategory {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
  meta: any[];
  _links: any;
}

export interface WPMedia {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  author: number;
  comment_status: string;
  ping_status: string;
  template: string;
  meta: any[];
  description: {
    rendered: string;
  };
  caption: {
    rendered: string;
  };
  alt_text: string;
  media_type: string;
  mime_type: string;
  media_details: {
    width: number;
    height: number;
    file: string;
    sizes: {
      [key: string]: {
        file: string;
        width: number;
        height: number;
        mime_type: string;
        source_url: string;
      };
    };
  };
  post: number;
  source_url: string;
  _links: any;
}

import { cache } from "react";

// WordPress API functions
export class WordPressAPI {
  private apiUrl: string;

  constructor(apiUrl?: string) {
    this.apiUrl = apiUrl || WORDPRESS_CONFIG.apiUrl;
  }

  // Get all posts
  getPosts = cache(
    async (params?: {
      page?: number;
      per_page?: number;
      categories?: number[];
      tags?: number[];
      search?: string;
      orderby?: string;
      order?: "asc" | "desc";
    }): Promise<{
      posts: WPPost[];
      totalPosts: number;
      totalPages: number;
    }> => {
      try {
        const posts = await wpFetch(WP_ENDPOINTS.posts, params);

        // Get total count by making a request to get total posts
        let totalPosts = 0;
        try {
          // Make a request with per_page=1 to get total count efficiently
          const url = new URL(WP_ENDPOINTS.posts, WORDPRESS_CONFIG.siteUrl);
          url.searchParams.set("per_page", "1");

          const response = await fetch(url.toString(), {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            mode: "cors",
          });

          if (response.ok) {
            const totalPostsHeader = response.headers.get("x-wp-total");
            if (totalPostsHeader) {
              totalPosts = parseInt(totalPostsHeader);
              console.log("Total posts from header:", totalPosts);
            } else {
              // Fallback: get all posts to count
              const allPosts = await wpFetch(WP_ENDPOINTS.posts, {
                per_page: 100,
              });
              totalPosts = allPosts.length;
            }
          }
        } catch (error) {
          console.warn("Could not get total posts count:", error);
          // Fallback: estimate based on current page and posts per page
          totalPosts =
            posts.length > 0
              ? (params?.page || 1) * (params?.per_page || 10)
              : 0;
        }

        const totalPages = Math.ceil(totalPosts / (params?.per_page || 10));

        return { posts, totalPosts, totalPages };
      } catch (error) {
        console.error("Error fetching posts:", error);
        throw error;
      }
    }
  );

  // Get single post by slug
  getPostBySlug = cache(async (slug: string): Promise<WPPost> => {
    try {
      const posts = await wpFetch(WP_ENDPOINTS.posts, { slug });
      return posts[0];
    } catch (error) {
      console.error("Error fetching post:", error);
      throw error;
    }
  });

  // Get all pages
  getPages = cache(
    async (params?: {
      page?: number;
      per_page?: number;
      parent?: number;
      orderby?: string;
      order?: "asc" | "desc";
    }): Promise<WPPage[]> => {
      try {
        return await wpFetch(WP_ENDPOINTS.pages, params);
      } catch (error) {
        console.error("Error fetching pages:", error);
        throw error;
      }
    }
  );

  // Get single page by slug
  getPageBySlug = cache(async (slug: string): Promise<WPPage> => {
    try {
      const pages = await wpFetch(WP_ENDPOINTS.pages, { slug });
      return pages[0];
    } catch (error) {
      console.error("Error fetching page:", error);
      throw error;
    }
  });

  // Get categories
  getCategories = cache(
    async (params?: {
      page?: number;
      per_page?: number;
      orderby?: string;
      order?: "asc" | "desc";
    }): Promise<WPCategory[]> => {
      try {
        return await wpFetch(WP_ENDPOINTS.categories, params);
      } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
      }
    }
  );

  // Get media by ID
  getMedia = cache(async (mediaId: number): Promise<WPMedia> => {
    try {
      return await wpFetch(`${WP_ENDPOINTS.media}/${mediaId}`);
    } catch (error) {
      console.error("Error fetching media:", error);
      throw error;
    }
  });

  // Get featured image URL
  getFeaturedImageUrl = cache(
    async (
      featuredMediaId: number,
      size: string = "medium"
    ): Promise<string> => {
      try {
        const media = await this.getMedia(featuredMediaId);
        return media.media_details.sizes[size]?.source_url || media.source_url;
      } catch (error) {
        console.error("Error fetching featured image:", error);
        return "";
      }
    }
  );

  // Get WordPress settings
  getSettings = cache(
    async (): Promise<{
      show_on_front: string;
      page_on_front?: number;
      page_for_posts?: number;
      title: string;
      description: string;
      posts_per_page: number;
    }> => {
      try {
        // Try to get settings from WordPress
        const settings = await wpFetch(WP_ENDPOINTS.settings);
        return settings;
      } catch (error) {
        console.error("Error fetching settings:", error);

        // Fallback: try to get basic site info from posts
        try {
          const posts = await wpFetch(WP_ENDPOINTS.posts, { per_page: 1 });
          if (posts.length > 0) {
            // Try to extract site info from the first post
            return {
              show_on_front: "posts",
              title: "WordPress Site",
              description: "A WordPress powered site",
              posts_per_page: 10,
            };
          }
        } catch (fallbackError) {
          console.error("Fallback also failed:", fallbackError);
        }

        // Return default settings
        return {
          show_on_front: "posts",
          title: "WordPress Site",
          description: "A WordPress powered site",
          posts_per_page: 10,
        };
      }
    }
  );

  // Get page by ID
  getPageById = cache(async (pageId: number): Promise<WPPage> => {
    try {
      return await wpFetch(`${WP_ENDPOINTS.pages}/${pageId}`);
    } catch (error) {
      console.error("Error fetching page by ID:", error);
      throw error;
    }
  });

  // Get site info from posts endpoint (fallback when settings not accessible)
  getSiteInfo = cache(
    async (): Promise<{
      title: string;
      description: string;
    }> => {
      try {
        // Try to get site info from posts endpoint
        const posts = await wpFetch(WP_ENDPOINTS.posts, { per_page: 1 });
        if (posts.length > 0) {
          // Extract site info from the first post's _links
          const firstPost = posts[0];
          return {
            title: "WordPress Site",
            description: "A WordPress powered site",
          };
        }
      } catch (error) {
        console.error("Error fetching site info:", error);
      }

      return {
        title: "WordPress Site",
        description: "A WordPress powered site",
      };
    }
  );

  // Get front settings (homepage/posts page info) from root endpoint (no auth required)
  getFrontSettings = cache(
    async (): Promise<{
      show_on_front: string;
      page_on_front?: number;
      page_for_posts?: number;
      title: string;
      description: string;
    }> => {
      try {
        const res = await fetch(`${WORDPRESS_CONFIG.siteUrl}/wp-json`);
        const data = await res.json();
        // Some WP setups put these in data.site, some in data directly
        const site = data.site || data;
        return {
          show_on_front: site.show_on_front || "posts",
          page_on_front: site.page_on_front,
          page_for_posts: site.page_for_posts,
          title: site.name || "WordPress Site",
          description: site.description || "A WordPress powered site",
        };
      } catch (error) {
        console.error("Error fetching front settings:", error);
        return {
          show_on_front: "posts",
          title: "WordPress Site",
          description: "A WordPress powered site",
        };
      }
    }
  );
}

// Create default instance
export const wp = new WordPressAPI();
