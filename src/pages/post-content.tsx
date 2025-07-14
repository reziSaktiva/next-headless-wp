"use client";

import { WPPost } from "@/lib/wordpress";
import { formatDate, getImageUrl } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";

// Types
interface PostContentProps {
  post: WPPost;
  featuredImageUrl?: string;
}

// Helper components
const PostHeader = ({ post, imageUrl }: { post: WPPost; imageUrl: string }) => (
  <header className="mb-8">
    <h1 className="text-4xl font-bold text-gray-900 mb-4">
      {post.title.rendered}
    </h1>

    <div className="flex items-center text-gray-600 mb-6">
      <time dateTime={post.date} className="text-sm">
        {formatDate(post.date, "dd MMMM yyyy")}
      </time>
      {post.categories && post.categories.length > 0 && (
        <>
          <span className="mx-2">•</span>
          <span className="text-sm">Category</span>
        </>
      )}
    </div>

    {imageUrl && (
      <div className="relative h-96 w-full mb-8">
        <Image
          src={imageUrl}
          alt={post.title.rendered}
          fill
          className="object-cover rounded-lg"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
        />
      </div>
    )}
  </header>
);

const LoadingSkeleton = () => (
  <div className="text-gray-800 leading-relaxed">
    <div className="animate-pulse space-y-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className={`h-4 bg-gray-200 rounded ${
            index === 3 ? "w-3/4" : "w-full"
          }`}
        />
      ))}
    </div>
  </div>
);

const PostContentBody = ({ content }: { content: string }) => (
  <div
    dangerouslySetInnerHTML={{ __html: content }}
    className="text-gray-800 leading-relaxed"
    suppressHydrationWarning
  />
);

const ActionButton = ({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) => (
  <button
    className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
    onClick={onClick}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const PostFooter = ({ post }: { post: WPPost }) => (
  <footer className="mt-12 pt-8 border-t border-gray-200">
    <div className="flex items-center justify-between text-sm text-gray-600">
      <div>
        <span>Last updated: {formatDate(post.modified, "dd MMMM yyyy")}</span>
      </div>
      <div className="flex items-center space-x-4">
        <ActionButton
          icon={
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          }
          label="Like"
        />
        <ActionButton
          icon={
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
              />
            </svg>
          }
          label="Share"
        />
      </div>
    </div>
  </footer>
);

// Custom hook for client-side rendering
const useClientSide = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
};

// Main component
export default function PostContent({
  post,
  featuredImageUrl,
}: PostContentProps) {
  const isClient = useClientSide();
  const imageUrl = getImageUrl(featuredImageUrl || "");
  console.log("post", post);

  return (
    <article className="max-w-4xl mx-auto">
      <PostHeader post={post} imageUrl={imageUrl} />

      <div className="prose prose-lg max-w-none">
        {isClient ? (
          <PostContentBody content={post.content.rendered} />
        ) : (
          <LoadingSkeleton />
        )}
      </div>

      <PostFooter post={post} />
    </article>
  );
}
