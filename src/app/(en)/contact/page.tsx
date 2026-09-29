import { ContactView, contactMeta } from "@/views/Contact";

export const metadata = contactMeta("en");

export default function Page() {
  return <ContactView lang="en" />;
}
