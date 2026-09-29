import type { ReactNode } from "react";
import { Reveal, Words } from "./Reveal";
import styles from "./SectionHead.module.css";

type Segment = string | { text: string; className?: string };

/** "§ 02 — Services" marker, a serif statement and an optional aside. */
export function SectionHead({
  index,
  label,
  title,
  aside,
  id,
  as = "h2",
}: {
  index: string;
  label: string;
  title: Segment[];
  aside?: ReactNode;
  id?: string;
  as?: "h1" | "h2";
}) {
  return (
    <header className={styles.head}>
      <p className="marker">
        <b>§ {index}</b> {label}
      </p>
      <div className={styles.row}>
        <Words as={as} segments={title} className={styles.title + " serif"} />
        {id && <span id={id} className="visually-hidden">{title.map((t) => (typeof t === "string" ? t : t.text)).join(" ")}</span>}
        {aside && (
          <Reveal className={styles.aside} delay={0.2}>
            {aside}
          </Reveal>
        )}
      </div>
    </header>
  );
}
