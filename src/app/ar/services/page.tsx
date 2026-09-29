import { ServicesView, servicesMeta } from "@/views/Services";

export const metadata = servicesMeta("ar");

export default function Page() {
  return <ServicesView lang="ar" />;
}
