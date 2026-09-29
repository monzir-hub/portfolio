"use client";

import { motion } from "motion/react";
import { useId, useMemo, useState } from "react";
import { Magnetic } from "@/components/site/Magnetic";
import { useLocale } from "@/i18n/LocaleProvider";
import styles from "./BriefBuilder.module.css";

/** Composes a project brief and hands it to the visitor's own email app. Nothing is stored or sent by this site. */
export function BriefBuilder() {
  const id = useId();
  const { t: dict, c } = useLocale();
  const t = dict.brief;
  const { stages, timelines } = t;
  const services = c.services;
  const brand = c.brand;
  const [picked, setPicked] = useState<string[]>([]);
  const [stage, setStage] = useState(stages[0]);
  const [timeline, setTimeline] = useState(timelines[2]);
  const [name, setName] = useState("");
  const [idea, setIdea] = useState("");

  const toggle = (s: string) => setPicked((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));

  const body = useMemo(
    () =>
      [
        t.hello,
        "",
        idea.trim() || t.defaultIdea,
        "",
        t.lookingFor + ": " + (picked.length ? picked.join(dict.dir === "rtl" ? "، " : ", ") : t.notSure),
        t.stageLabel + ": " + stage,
        t.timelineLabel + ": " + timeline,
        "",
        name.trim() ? t.thanks + (dict.dir === "rtl" ? "،\n" : ",\n") + name.trim() : t.thanks,
      ].join("\n"),
    [idea, picked, stage, timeline, name, t],
  );
  const subject = t.subject + (picked.length ? " · " + picked.join(", ") : "");
  const href = "mailto:" + brand.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);

  return (
    <form
      className={styles.form}
      aria-describedby={id + "-privacy"}
      onSubmit={(e) => {
        e.preventDefault();
        window.location.href = href;
      }}
    >
      <Group legend={t.need}>
        {services.map((s) => (
          <Chip key={s.id} type="checkbox" checked={picked.includes(s.name)} onChange={() => toggle(s.name)} label={s.name} />
        ))}
      </Group>
      <div className={styles.pair}>
        <Group legend={t.stage}>
          {stages.map((s) => (
            <Chip key={s} type="radio" name={id + "-stage"} checked={stage === s} onChange={() => setStage(s)} label={s} />
          ))}
        </Group>
        <Group legend={t.timeline}>
          {timelines.map((t) => (
            <Chip key={t} type="radio" name={id + "-time"} checked={timeline === t} onChange={() => setTimeline(t)} label={t} />
          ))}
        </Group>
      </div>
      <div className={styles.fields}>
        <label className={styles.field}>
          <span className="mono accent">{t.idea}</span>
          <textarea name="idea" rows={3} autoComplete="off" value={idea} onChange={(e) => setIdea(e.target.value)} placeholder={t.ideaPlaceholder} />
        </label>
        <label className={styles.field}>
          <span className="mono accent">{t.name}</span>
          <input name="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder={t.namePlaceholder} />
        </label>
      </div>

      <div className={styles.preview}>
        <p className={styles.previewBar + " mono"}>
          <span>brief.txt</span>
          <span dir="ltr">{t.to} {brand.email}</span>
        </p>
        <motion.pre key={body.length} className={styles.previewBody} initial={{ opacity: 0.6 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          {body}
        </motion.pre>
      </div>

      <div className={styles.submitRow}>
        <Magnetic strength={0.25}>
          <button type="submit" className={styles.submit}>
            {t.send} <span aria-hidden="true">{dict.arrow}</span>
          </button>
        </Magnetic>
        <p id={id + "-privacy"} className="muted">
          {t.privacy}
        </p>
      </div>
    </form>
  );
}

function Group({ legend, children }: { legend: string; children: React.ReactNode }) {
  return (
    <fieldset className={styles.group}>
      <legend className="mono accent">{legend}</legend>
      <div className={styles.chips}>{children}</div>
    </fieldset>
  );
}

function Chip({ label, checked, onChange, type, name }: { label: string; checked: boolean; onChange: () => void; type: "checkbox" | "radio"; name?: string }) {
  return (
    <label className={styles.chip} data-on={checked}>
      <input type={type} name={name} checked={checked} onChange={onChange} />
      {checked && <motion.span className={styles.chipFill} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.35 }} />}
      <span className={styles.chipText}>{label}</span>
    </label>
  );
}
