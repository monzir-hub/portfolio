import { ProjectView, projectMeta, projectSlugs } from "@/views/Projects";

type Params = { slug: string };

export const generateStaticParams = projectSlugs;

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  return projectMeta("en", (await params).slug);
}

export default async function Page({ params }: { params: Promise<Params> }) {
  return <ProjectView lang="en" slug={(await params).slug} />;
}
