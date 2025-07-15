import DynamicPageRoute from "@/pages/dynamic-page-route";

export default async function Page({
  params,
}: {
  params: Promise<{ route: string[] }>;
}) {
  const { route } = await params;
  return <DynamicPageRoute route={route} />;
}

export { generateMetadata } from "@/lib/generate-meta-data";
