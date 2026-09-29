import { ProjectsView, projectsMeta } from "@/views/Projects";

export const metadata = projectsMeta("ar");

export default function Page() {
  return <ProjectsView lang="ar" />;
}
