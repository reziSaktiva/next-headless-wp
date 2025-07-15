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
  // Authentication
  username: process.env.WORDPRESS_USERNAME,
  password: process.env.WORDPRESS_PASSWORD,
  applicationPassword: process.env.WORDPRESS_PASSWORD,
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

  // Prepare headers
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  // Add authentication header if credentials are provided
  if (WORDPRESS_CONFIG.username && WORDPRESS_CONFIG.applicationPassword) {
    const credentials = Buffer.from(
      `${WORDPRESS_CONFIG.username}:${WORDPRESS_CONFIG.applicationPassword}`
    ).toString("base64");
    headers.Authorization = `Basic ${credentials}`;
  } else if (WORDPRESS_CONFIG.username && WORDPRESS_CONFIG.password) {
    const credentials = Buffer.from(
      `${WORDPRESS_CONFIG.username}:${WORDPRESS_CONFIG.password}`
    ).toString("base64");
    headers.Authorization = `Basic ${credentials}`;
  }

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers,
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

export interface WPMenuItem {
  id: number;
  title: {
    rendered: string;
  };
  url: string;
  target: string;
  classes: string[];
  link_class: string[];
  xfn: string[];
  description: string;
  attr_title: string;
  object: string;
  object_id: number;
  parent: number;
  menu_order: number;
  type: string;
  type_label: string;
  _links: any;
}

export interface WPMenu {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
  items: WPMenuItem[];
}

import { cache } from "react";

// WordPress API functions
export class WordPressAPI {
  private apiUrl: string;

  constructor(apiUrl?: string) {
    this.apiUrl = apiUrl || WORDPRESS_CONFIG.apiUrl;
  }

  // Helper method to get authentication headers
  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    // Add authentication header if credentials are provided
    if (WORDPRESS_CONFIG.username && WORDPRESS_CONFIG.applicationPassword) {
      const credentials = Buffer.from(
        `${WORDPRESS_CONFIG.username}:${WORDPRESS_CONFIG.applicationPassword}`
      ).toString("base64");
      headers.Authorization = `Basic ${credentials}`;
    } else if (WORDPRESS_CONFIG.username && WORDPRESS_CONFIG.password) {
      const credentials = Buffer.from(
        `${WORDPRESS_CONFIG.username}:${WORDPRESS_CONFIG.password}`
      ).toString("base64");
      headers.Authorization = `Basic ${credentials}`;
    }

    return headers;
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
        // Get total posts and pages from headers
        const response = await fetch(
          `${
            WORDPRESS_CONFIG.siteUrl
          }/wp-json/wp/v2/posts?${new URLSearchParams(
            params as Record<string, string>
          )}`,
          {
            headers: this.getAuthHeaders(),
          }
        );

        const posts = (await response.json()) as WPPost[];
        const totalPosts = parseInt(
          response.headers.get("x-wp-total") || "0",
          10
        );
        const totalPages = parseInt(
          response.headers.get("x-wp-totalpages") || "0",
          10
        );

        return { posts, totalPosts, totalPages };
      } catch (error) {
        console.error("Error fetching posts:", error);
        throw error;
      }
    }
  );

  // Get single post by slug
  getPostBySlug = cache(
    async (slug: string, isPreview: boolean = false): Promise<WPPost> => {
      try {
        const params: Record<string, any> = { slug };

        // Add preview parameters if needed
        if (isPreview) {
          params.status = "draft,pending,publish";
        }

        const posts = await wpFetch(WP_ENDPOINTS.posts, params);
        return posts[0];
      } catch (error) {
        console.error("Error fetching post:", error);
        throw error;
      }
    }
  );

  // Get post by ID for preview (includes drafts and pending posts)
  getPostById = cache(
    async (postId: number, isPreview: boolean = false): Promise<WPPost> => {
      try {
        const params: Record<string, any> = {};

        // Add preview parameters if needed
        if (isPreview) {
          params.status = "draft,pending,publish";
        }

        return await wpFetch(`${WP_ENDPOINTS.posts}/${postId}`, params);
      } catch (error) {
        console.error("Error fetching post by ID:", error);
        throw error;
      }
    }
  );

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
  getPageBySlug = cache(
    async (slug: string, isPreview: boolean = false): Promise<WPPage> => {
      try {
        const params: Record<string, any> = { slug };

        // Add preview parameters if needed
        if (isPreview) {
          params.status = "draft,pending,publish";
        }

        const pages = await wpFetch(WP_ENDPOINTS.pages, params);
        return pages[0];
      } catch (error) {
        console.error("Error fetching page:", error);
        throw error;
      }
    }
  );

  // Get page by ID for preview (includes drafts and pending pages)
  getPageById = cache(
    async (pageId: number, isPreview: boolean = false): Promise<WPPage> => {
      try {
        const params: Record<string, any> = {};

        // Add preview parameters if needed
        if (isPreview) {
          params.status = "draft,pending,publish";
        }

        return await wpFetch(`${WP_ENDPOINTS.pages}/${pageId}`, params);
      } catch (error) {
        console.error("Error fetching page by ID:", error);
        throw error;
      }
    }
  );

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
  getMedia = cache(async (mediaId: number): Promise<WPMedia | undefined> => {
    try {
      if (!mediaId) {
        return undefined;
      }
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
    ): Promise<string | undefined> => {
      try {
        const media = await this.getMedia(featuredMediaId);
        return (
          media?.media_details.sizes[size]?.source_url || media?.source_url
        );
      } catch (error) {
        return undefined;
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
      posts_per_page?: number;
      title: string;
      description: string;
    }> => {
      try {
        // Prepare headers
        const headers: Record<string, string> = {
          Accept: "application/json",
          "Content-Type": "application/json",
        };

        // Add authentication header if credentials are provided
        if (WORDPRESS_CONFIG.username && WORDPRESS_CONFIG.applicationPassword) {
          const credentials = Buffer.from(
            `${WORDPRESS_CONFIG.username}:${WORDPRESS_CONFIG.applicationPassword}`
          ).toString("base64");
          headers.Authorization = `Basic ${credentials}`;
        } else if (WORDPRESS_CONFIG.username && WORDPRESS_CONFIG.password) {
          const credentials = Buffer.from(
            `${WORDPRESS_CONFIG.username}:${WORDPRESS_CONFIG.password}`
          ).toString("base64");
          headers.Authorization = `Basic ${credentials}`;
        }

        const res = await fetch(
          `${WORDPRESS_CONFIG.siteUrl}/wp-json/wp/v2/settings?embed=true`,
          {
            headers,
          }
        );
        const data = await res.json();
        // Some WP setups put these in data.site, some in data directly
        const site = data.site || data;
        return {
          show_on_front: site.show_on_front || "posts",
          page_on_front: site.page_on_front,
          page_for_posts: site.page_for_posts,
          posts_per_page: site.posts_per_page,
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

  // Get menu items by menu location or menu ID
  getMenuItems = cache(
    async (params?: {
      location?: string;
      menu_id?: number;
      menu_slug?: string;
    }): Promise<WPMenuItem[]> => {
      try {
        // Method 1: Try to get menu by slug (NextWP approach)
        if (params?.menu_slug) {
          try {
            const menusRes = await fetch(
              `${WORDPRESS_CONFIG.siteUrl}/wp-json/wp/v2/menus?slug=${params.menu_slug}`,
              {
                headers: this.getAuthHeaders(),
              }
            );

            const menus = (await menusRes.json()) as any[];

            if (menus && menus.length > 0) {
              const menu = menus[0];

              // Get menu items by menu id
              const menuItemsRes = await fetch(
                `${WORDPRESS_CONFIG.siteUrl}/wp-json/wp/v2/menu-items?menus=${menu.id}&acf_format=standard`,
                {
                  headers: this.getAuthHeaders(),
                }
              );

              if (menuItemsRes.ok) {
                const menuItems = (await menuItemsRes.json()) as WPMenuItem[];
                return menuItems;
              }
            } else {
              // List available menus for debugging
              const availableMenusRes = await fetch(
                `${WORDPRESS_CONFIG.siteUrl}/wp-json/wp/v2/menus`,
                {
                  headers: this.getAuthHeaders(),
                }
              );

              if (availableMenusRes.ok) {
                const availableMenus =
                  (await availableMenusRes.json()) as any[];
                console.warn(`No menu found with slug "${params.menu_slug}"`);
                if (availableMenus.length > 0) {
                  const availableSlugs = availableMenus
                    .map((menu) => menu.slug)
                    .join(", ");
                  console.warn(`Available menu slugs: ${availableSlugs}`);
                }
              }
            }
          } catch (error) {
            console.warn("Menu by slug method failed:", error);
          }
        }

        // Method 2: Try to get menu from theme customizer settings
        if (params?.location) {
          try {
            const customizerUrl = `${WORDPRESS_CONFIG.siteUrl}/wp-json/wp/v2/settings`;
            const response = await fetch(customizerUrl, {
              headers: this.getAuthHeaders(),
            });

            if (response.ok) {
              const settings = await response.json();
              // Check for menu locations in customizer settings
              if (
                settings.nav_menu_locations &&
                settings.nav_menu_locations[params.location]
              ) {
                const menuId = settings.nav_menu_locations[params.location];

                // Get menu items by menu id
                const menuItemsRes = await fetch(
                  `${WORDPRESS_CONFIG.siteUrl}/wp-json/wp/v2/menu-items?menus=${menuId}&acf_format=standard`,
                  {
                    headers: this.getAuthHeaders(),
                  }
                );

                if (menuItemsRes.ok) {
                  const menuItems = (await menuItemsRes.json()) as WPMenuItem[];
                  return menuItems;
                }
              }
            }
          } catch (error) {
            console.warn("Customizer settings check failed:", error);
          }
        }

        // Method 3: Try direct menu ID
        if (params?.menu_id) {
          try {
            const menuItemsRes = await fetch(
              `${WORDPRESS_CONFIG.siteUrl}/wp-json/wp/v2/menu-items?menus=${params.menu_id}&acf_format=standard`,
              {
                headers: this.getAuthHeaders(),
              }
            );

            if (menuItemsRes.ok) {
              const menuItems = (await menuItemsRes.json()) as WPMenuItem[];
              return menuItems;
            }
          } catch (error) {
            console.warn("Direct menu ID method failed:", error);
          }
        }

        // Method 4: Fallback to pages as menu items (common for simple sites)
        try {
          const pages = await this.getPages({ per_page: 20 });
          return pages.map((page) => ({
            id: page.id,
            title: { rendered: page.title.rendered },
            url: page.link,
            target: "_self",
            classes: [],
            link_class: [],
            xfn: [],
            description: page.excerpt.rendered,
            attr_title: page.title.rendered,
            object: "page",
            object_id: page.id,
            parent: page.parent,
            menu_order: page.menu_order,
            type: "post_type",
            type_label: "Page",
            _links: page._links,
          }));
        } catch (error) {
          console.warn("Pages fallback failed:", error);
        }

        console.warn("No menu items found with any method");
        return [];
      } catch (error) {
        console.error("Error fetching menu items:", error);
        return [];
      }
    }
  );

  // Get all available menus
  getMenus = cache(async (): Promise<WPMenu[]> => {
    try {
      const menus = await wpFetch(WP_ENDPOINTS.menus);
      return Array.isArray(menus) ? menus : [];
    } catch (error) {
      console.error("Error fetching menus:", error);
      return [];
    }
  });

  // Get site logo
  getSiteLogo = cache(
    async (): Promise<{
      url: string;
      width?: number;
      height?: number;
      alt?: string;
    } | null> => {
      try {
        // Try to get logo from customizer settings
        const customizerUrl = `${WORDPRESS_CONFIG.siteUrl}/wp-json/wp/v2/settings`;

        // Prepare headers
        const headers: Record<string, string> = {
          Accept: "application/json",
          "Content-Type": "application/json",
        };

        // Add authentication header if credentials are provided
        if (WORDPRESS_CONFIG.username && WORDPRESS_CONFIG.applicationPassword) {
          const credentials = Buffer.from(
            `${WORDPRESS_CONFIG.username}:${WORDPRESS_CONFIG.applicationPassword}`
          ).toString("base64");
          headers.Authorization = `Basic ${credentials}`;
        } else if (WORDPRESS_CONFIG.username && WORDPRESS_CONFIG.password) {
          const credentials = Buffer.from(
            `${WORDPRESS_CONFIG.username}:${WORDPRESS_CONFIG.password}`
          ).toString("base64");
          headers.Authorization = `Basic ${credentials}`;
        }

        const response = await fetch(customizerUrl, { headers });

        if (response.ok) {
          const settings = await response.json();

          // Check for logo in various possible locations
          if (settings.custom_logo) {
            // Get logo media details
            const logoMedia = await this.getMedia(settings.custom_logo);
            return {
              url: logoMedia?.source_url || "",
              width: logoMedia?.media_details.width,
              height: logoMedia?.media_details.height,
              alt: logoMedia?.alt_text || "Site Logo",
            };
          }
        }

        // Fallback: try to get logo from site options
        try {
          const optionsUrl = `${WORDPRESS_CONFIG.siteUrl}/wp-json/wp/v2/settings`;
          const optionsResponse = await fetch(optionsUrl, { headers });

          if (optionsResponse.ok) {
            const options = await optionsResponse.json();

            // Check for logo in site options
            if (options.site_logo) {
              const logoMedia = await this.getMedia(options.site_logo);
              return {
                url: logoMedia?.source_url || "",
                width: logoMedia?.media_details.width,
                height: logoMedia?.media_details.height,
                alt: logoMedia?.alt_text || "Site Logo",
              };
            }
          }
        } catch (optionsError) {
          console.warn("Could not fetch site options:", optionsError);
        }

        // Try to get logo from theme mods (some themes store it here)
        try {
          const themeModsUrl = `${WORDPRESS_CONFIG.siteUrl}/wp-json/wp/v2/settings`;
          const themeModsResponse = await fetch(themeModsUrl, { headers });

          if (themeModsResponse.ok) {
            const themeMods = await themeModsResponse.json();

            if (themeMods.custom_logo) {
              const logoMedia = await this.getMedia(themeMods.custom_logo);
              return {
                url: logoMedia?.source_url || "",
                width: logoMedia?.media_details.width,
                height: logoMedia?.media_details.height,
                alt: logoMedia?.alt_text || "Site Logo",
              };
            }
          }
        } catch (themeModsError) {
          console.warn("Could not fetch theme mods:", themeModsError);
        }

        return null;
      } catch (error) {
        console.error("Error fetching site logo:", error);
        return null;
      }
    }
  );
}

// Create default instance
export const wp = new WordPressAPI();
