import Link from "next/link";
import { PageIntro } from "@/components/site/PageIntro";
import { type Locale, localePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";

export function NotFoundView({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);
  const p = t.pages.notFound;
  return (
    <PageIntro index="404" label={p.label} title={p.heading} lede={p.lede}>
      <Link href={localePath(lang, "/projects")} className="link-line" style={{ gridColumn: "8 / -1", fontWeight: 500, justifySelf: "start" }}>
        {p.link} {t.arrow}
      </Link>
    </PageIntro>
  );
}
