import DynamicPageRoute from "../../pages/dynamic-page-route";

export default async function PageRoute(props: {
  params: Promise<{ route: string[] }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { route } = await props.params;
  const searchParams = await props.searchParams;

  // Use dynamic routing for all routes
  return <DynamicPageRoute route={route || []} searchParams={searchParams} />;
}
