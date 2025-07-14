import { wp } from "@/lib/wordpress";
import DynamicPageRoute from "@/pages/dynamic-page-route";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ route: string[] }>;
}): Promise<Metadata> {
  const { route } = await params;
  const [slugPage, slugPost] = route || [];

  if (!slugPage) {
    // Homepage metadata
    try {
      const settings = await wp.getFrontSettings();
      return {
        title: settings.title,
        description: settings.description,
        openGraph: {
          title: settings.title,
          description: settings.description,
          type: "website",
        },
        twitter: {
          card: "summary_large_image",
          title: settings.title,
          description: settings.description,
        },
      };
    } catch (error) {
      console.error("Error generating homepage metadata:", error);
      return {
        title: "WordPress Site",
        description: "A WordPress powered site",
      };
    }
  }

  try {
    const content = slugPost
      ? await wp.getPostBySlug(slugPost)
      : await wp.getPageBySlug(slugPage);

    const yoastData = content.yoast_head_json;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    if (!yoastData) {
      // Fallback metadata if no Yoast data
      return {
        title: content.title?.rendered || "Page",
        description: content.excerpt?.rendered?.replace(/<[^>]*>/g, "") || "",
        openGraph: {
          title: content.title?.rendered,
          description: content.excerpt?.rendered?.replace(/<[^>]*>/g, ""),
          type: slugPost ? "article" : "website",
          publishedTime: content.date,
          modifiedTime: content.modified,
          url: `${baseUrl}/${content.slug}`,
        },
        twitter: {
          card: "summary_large_image",
          title: content.title?.rendered,
          description: content.excerpt?.rendered?.replace(/<[^>]*>/g, ""),
        },
      };
    }

    // Comprehensive SEO metadata from Yoast
    return {
      title: yoastData.title || content.title?.rendered || "Page",
      description:
        yoastData.description ||
        content.excerpt?.rendered?.replace(/<[^>]*>/g, "") ||
        "",

      // Robots directives
      robots: yoastData.robots
        ? {
            index: yoastData.robots.index === "index",
            follow: yoastData.robots.follow === "follow",
            nocache: true,
            googleBot: {
              index: yoastData.robots.index === "index",
              follow: yoastData.robots.follow === "follow",
              "max-snippet": yoastData.robots["max-snippet"]
                ? parseInt(yoastData.robots["max-snippet"])
                : undefined,
              "max-image-preview": yoastData.robots["max-image-preview"] as
                | "none"
                | "standard"
                | "large"
                | undefined,
              "max-video-preview": yoastData.robots["max-video-preview"]
                ? parseInt(yoastData.robots["max-video-preview"])
                : undefined,
            },
          }
        : undefined,

      // Canonical URL
      alternates: {
        canonical: yoastData.canonical || `${baseUrl}/${content.slug}`,
      },

      // Open Graph metadata
      openGraph: {
        title: yoastData.og_title || yoastData.title || content.title?.rendered,
        description:
          yoastData.og_description ||
          yoastData.description ||
          content.excerpt?.rendered?.replace(/<[^>]*>/g, ""),
        url:
          yoastData.og_url ||
          yoastData.canonical ||
          `${baseUrl}/${content.slug}`,
        siteName: yoastData.og_site_name,
        locale: yoastData.og_locale,
        type:
          (yoastData.og_type as "article" | "website") ||
          (slugPost ? "article" : "website"),
        publishedTime: yoastData.article_published_time || content.date,
        modifiedTime: content.modified,
        authors: yoastData.author ? [yoastData.author] : undefined,
        images: yoastData.og_image?.length
          ? yoastData.og_image.map((img) => ({
              url: img.url || "",
              width: img.width,
              height: img.height,
              type: img.type,
              alt: content.title?.rendered || "",
            }))
          : content.featured_media
          ? [
              {
                url: `${baseUrl}/api/featured-image/${content.featured_media}`,
                alt: content.title?.rendered || "",
              },
            ]
          : undefined,
      },

      // Twitter Card metadata
      twitter: {
        card:
          (yoastData.twitter_card as "summary" | "summary_large_image") ||
          "summary_large_image",
        title: yoastData.og_title || yoastData.title || content.title?.rendered,
        description:
          yoastData.og_description ||
          yoastData.description ||
          content.excerpt?.rendered?.replace(/<[^>]*>/g, ""),
        images: yoastData.og_image?.length
          ? yoastData.og_image.map((img) => img.url || "").filter(Boolean)
          : undefined,
        creator: yoastData.twitter_misc?.["Written by"],
      },

      // Article metadata
      authors: yoastData.author ? [{ name: yoastData.author }] : undefined,
      category: slugPost ? "article" : undefined,
      keywords:
        "tags" in content && content.tags
          ? content.tags.map((tag: any) => tag.name).join(", ")
          : undefined,

      // Additional metadata
      other: {
        "article:published_time":
          yoastData.article_published_time || content.date,
        "article:modified_time": content.modified,
        "article:author": yoastData.author || "",
        "twitter:label1": "Written by",
        "twitter:data1": yoastData.twitter_misc?.["Written by"] || "",
        "twitter:label2": "Est. reading time",
        "twitter:data2": yoastData.twitter_misc?.["Est. reading time"] || "",
        "og:image:width": yoastData.og_image?.[0]?.width?.toString() || "",
        "og:image:height": yoastData.og_image?.[0]?.height?.toString() || "",
        "og:image:type": yoastData.og_image?.[0]?.type || "",
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Page Not Found",
      description: "The page you are looking for does not exist.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ route: string[] }>;
}) {
  const { route } = await params;
  return <DynamicPageRoute route={route} />;
}
