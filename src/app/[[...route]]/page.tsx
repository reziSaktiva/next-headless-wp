import DynamicPageRoute from "@/pages/dynamic-page-route";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ route: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { route } = await params;
  const resolvedSearchParams = await searchParams;
  return <DynamicPageRoute route={route} searchParams={resolvedSearchParams} />;
}

export { generateMetadata } from "@/lib/generate-meta-data";
