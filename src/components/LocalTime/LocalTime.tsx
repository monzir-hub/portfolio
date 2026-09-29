"use client";

import { useEffect, useState } from "react";
import { brand } from "@/content/brand";

const format = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: brand.timeZone,
});

/** Live local time in Cairo. Renders a stable placeholder on the server to avoid hydration mismatch. */
export function LocalTime({ className }: { className?: string }) {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const update = () => setTime(format.format(new Date()));
    update();
    const id = window.setInterval(update, 15_000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <time className={className} suppressHydrationWarning>
      {time ?? "--:--"}
    </time>
  );
}
