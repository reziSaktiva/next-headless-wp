import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale/id";

// Format WordPress date to readable format
export function formatDate(
  dateString: string,
  formatString: string = "dd MMMM yyyy"
): string {
  try {
    const date = parseISO(dateString);
    return format(date, formatString, { locale: id });
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
}

// Strip HTML tags from content
export function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "");
}

// Truncate text to specified length
export function truncateText(text: string, maxLength: number = 150): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}

// Get excerpt from content
export function getExcerpt(content: string, maxLength: number = 150): string {
  const strippedContent = stripHtml(content);
  return truncateText(strippedContent, maxLength);
}

// Generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// Check if string is a valid URL
export function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// Get image URL with fallback
export function getImageUrl(
  imageUrl: string,
  fallbackUrl: string = "/placeholder.jpg"
): string {
  if (!imageUrl || !isValidUrl(imageUrl)) {
    return fallbackUrl;
  }
  return imageUrl;
}

// Convert WordPress content to plain text
export function wpContentToText(content: string): string {
  if (!content) return "";

  // Remove HTML tags
  let text = stripHtml(content);

  // Decode HTML entities
  text = text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ");

  return text.trim();
}

// Get reading time estimate
export function getReadingTime(
  content: string,
  wordsPerMinute: number = 200
): number {
  const text = wpContentToText(content);
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
