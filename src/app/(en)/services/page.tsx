import { ServicesView, servicesMeta } from "@/views/Services";

export const metadata = servicesMeta("en");

export default function Page() {
  return <ServicesView lang="en" />;
}
