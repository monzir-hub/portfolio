import type { ReactNode } from "react";
import { Reveal, Words } from "./Reveal";
import styles from "./PageIntro.module.css";

type Segment = string | { text: string; className?: string };

/** Opening of every inner page: a marker, a large serif statement and a lede. */
export function PageIntro({ index, label, title, lede, children }: { index: string; label: string; title: Segment[]; lede: string; children?: ReactNode }) {
  return (
    <header className={styles.intro + " wine"}>
      <div className="wrap">
        <p className="marker">
          <b>§ {index}</b> {label}
        </p>
        <Words as="h1" animateOnMount delay={0.1} className={styles.title + " serif"} segments={title} />
        <div className={styles.row}>
          <Reveal className={styles.lede} delay={0.5}>
            {lede}
          </Reveal>
          {children}
        </div>
      </div>
    </header>
  );
}
