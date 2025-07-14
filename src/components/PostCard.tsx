"use client";

import { WPPost } from "@/lib/wordpress";
import { formatDate, getExcerpt, getImageUrl } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface PostCardProps {
  post: WPPost;
  featuredImageUrl?: string;
  currentPath?: string; // Optional prop for server components
}

export default function PostCard({
  post,
  featuredImageUrl,
  currentPath,
}: PostCardProps) {
  const pathname = usePathname();
  const excerpt = getExcerpt(post.excerpt.rendered || post.content.rendered);
  const formattedDate = formatDate(post.date);
  const imageUrl = getImageUrl(featuredImageUrl || "");

  // Use currentPath prop if provided (for server components), otherwise use pathname hook
  const currentPathName = currentPath || pathname;

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {imageUrl && (
        <div className="relative h-48 w-full">
          <Image
            src={imageUrl}
            alt={post.title.rendered}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <time dateTime={post.date}>{formattedDate}</time>
          {post.categories && post.categories.length > 0 && (
            <>
              <span className="mx-2">•</span>
              <span>Category</span>
            </>
          )}
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
          <Link
            href={`${currentPathName}/${post.slug}`}
            className="hover:text-blue-600 transition-colors duration-200"
          >
            {post.title.rendered}
          </Link>
        </h2>

        <p className="text-gray-600 mb-4 line-clamp-3">{excerpt}</p>

        <Link
          href={`${currentPathName}/${post.slug}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
        >
          Baca selengkapnya
          <svg
            className="ml-2 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </article>
  );
}
