import { BrowserFrame, PhoneFrame } from "@/components/site/Frames";
import type { Preview } from "@/content/services";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import styles from "./ServicePreview.module.css";

/** A small artefact that shows what each service produces. */
export function ServicePreview({ preview, lang = "en" }: { preview: Preview; lang?: Locale }) {
  const t = getDictionary(lang).services;
  switch (preview.kind) {
    case "image":
      return (
        <BrowserFrame url={t.liveProduct} className={styles.browser}>
          <img src={preview.src} alt={preview.alt} width={900} height={562} loading="lazy" decoding="async" />
        </BrowserFrame>
      );
    case "phone":
      return (
        <div className={styles.phoneWrap}>
          <PhoneFrame className={styles.phone}>
            <img src={preview.src} alt={preview.alt} width={600} height={1298} loading="lazy" decoding="async" />
          </PhoneFrame>
        </div>
      );
    case "blueprint":
      return (
        <div className={styles.blueprint}>
          <img src={preview.src} alt={preview.alt} width={900} height={562} loading="lazy" decoding="async" />
          <div className={styles.overlay} aria-hidden="true">
            <span className={styles.col} style={{ left: "13%" }} />
            <span className={styles.col} style={{ left: "61%" }} />
            <span className={styles.box} style={{ left: "13%", top: "12%", width: "48%", height: "14%" }}>
              <em>H1 · 32/40</em>
            </span>
            <span className={styles.box} style={{ left: "61.5%", top: "34%", width: "37%", height: "18%" }}>
              <em>card · 8pt grid</em>
            </span>
            <span className={styles.measure} style={{ left: "13%", top: "88%", width: "48%" }}>
              <em>624</em>
            </span>
          </div>
        </div>
      );
    case "cluster":
      return (
        <div className={styles.cluster} aria-label="Illustration: a Kubernetes cluster across two availability zones" role="img" dir="ltr">
          <p className={styles.head}>
            <span>aws · eks</span>
            <span className={styles.ok}>● healthy</span>
          </p>
          <div className={styles.zones}>
            {["zone a", "zone b"].map((z) => (
              <div key={z} className={styles.zone}>
                <span className={styles.zoneLabel}>{z}</span>
                {[0, 1].map((n) => (
                  <div key={n} className={styles.node}>
                    {Array.from({ length: 3 }, (_, k) => (
                      <i key={k} />
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <p className={styles.pipeline}>
            <span>git push</span>→<span>build</span>→<span>test</span>→<span>deploy</span>
          </p>
        </div>
      );
    case "plan":
      return (
        <div className={styles.plan} aria-label={t.plan.title} role="img">
          <p className={styles.planTitle}>{t.plan.title}</p>
          {t.plan.rows.map(([k, v]) => (
            <p key={k} className={styles.planRow}>
              <span>{k}</span>
              <span>{v}</span>
            </p>
          ))}
          <p className={styles.planNote}>{t.plan.note}</p>
        </div>
      );
  }
}
