import type { ReactNode } from "react";
import styles from "./Frames.module.css";

/** A quiet browser chrome for real product screens. */
export function BrowserFrame({ url, children, className }: { url: string; children: ReactNode; className?: string }) {
  return (
    <div className={`${styles.browser} ${className ?? ""}`} dir="ltr">
      <div className={styles.bar} aria-hidden="true">
        <span className={styles.dots}>
          <i />
          <i />
          <i />
        </span>
        <span className={styles.url}>{url}</span>
      </div>
      <div className={styles.viewport}>{children}</div>
    </div>
  );
}

export function PhoneFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={`${styles.phone} ${className ?? ""}`}>
      <div className={styles.screen}>{children}</div>
    </div>
  );
}
