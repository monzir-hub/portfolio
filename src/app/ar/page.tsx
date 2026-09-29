import { pageMeta } from "@/views/meta";
import { HomeView } from "@/views/Home";

export const metadata = pageMeta("ar", "/");

export default function Page() {
  return <HomeView lang="ar" />;
}
