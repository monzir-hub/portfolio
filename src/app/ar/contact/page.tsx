import { ContactView, contactMeta } from "@/views/Contact";

export const metadata = contactMeta("ar");

export default function Page() {
  return <ContactView lang="ar" />;
}
