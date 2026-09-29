import { AboutView, aboutMeta } from "@/views/About";

export const metadata = aboutMeta("ar");

export default function Page() {
  return <AboutView lang="ar" />;
}
