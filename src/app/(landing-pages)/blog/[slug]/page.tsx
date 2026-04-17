import BlogDetails from "./blog-details";

type BlogDetailsPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BlogDetailsPage({ params }: BlogDetailsPageProps) {
  const { slug } = await params;

  return <BlogDetails slug={slug} />;
}
