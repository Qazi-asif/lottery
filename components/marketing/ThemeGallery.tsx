"use client";

import { useState } from "react";
import { TicketWall } from "@/components/marketing/TicketWall";
import { DISPLAY_MODES } from "@/lib/marketing/display-themes";
import type { DisplayThemeId } from "@/lib/display-style";

export function ThemeGallery({
  surface = "paper",
}: {
  surface?: "paper" | "ink";
}) {
  const [modeId, setModeId] = useState<DisplayThemeId>("plain");
  const [lang, setLang] = useState<"en" | "es">("en");
  const [layout, setLayout] = useState<"landscape" | "portrait">("landscape");
  const dark = surface === "ink";

  return (
    <div className="grid gap-8 [&>*]:min-w-0 lg:grid-cols-[19rem_1fr] lg:items-start">
      <div>
        <div
          className="flex gap-3 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible"
          role="tablist"
          aria-label="Display modes"
        >
          {DISPLAY_MODES.map((mode) => {
            const active = mode.id === modeId;

            return (
              <button
                key={mode.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setModeId(mode.id)}
                className={`shrink-0 rounded-lg border-l-2 p-4 text-left transition-all duration-150 lg:w-full ${
                  active
                    ? "sheet border-l-flag"
                    : dark
                      ? "border-l-[#f11112]/40 bg-black hover:bg-[#f11112]/10"
                      : "border-l-[#f11112]/25 bg-black hover:bg-[#111111]"
                }`}
              >
                <span className="flex items-center justify-between gap-3">
                  <span
                    className={`wonk font-display text-[16px] font-semibold tracking-tight ${
                      active
                        ? "text-ink"
                        : dark
                          ? "text-ink-soft"
                          : "text-ink-soft"
                    }`}
                  >
                    {mode.name}
                  </span>
                  {active ? (
                    <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-flag">
                      On screen
                    </span>
                  ) : null}
                </span>
                <span
                  className={`mt-1.5 hidden text-[13px] leading-relaxed lg:block ${
                    dark && !active ? "text-ink-faint" : "text-ink-soft"
                  }`}
                >
                  {mode.blurb}
                </span>
              </button>
            );
          })}
        </div>

        <div
          className={`mt-5 space-y-3 border-t border-dashed pt-5 ${
            dark ? "border-white/15" : "border-rule-strong"
          }`}
        >
          <Segmented
            label="Language"
            tone={dark ? "paper" : "ink"}
            options={[
              { value: "en", label: "English" },
              { value: "es", label: "Español" },
            ]}
            value={lang}
            onChange={(value) => setLang(value as "en" | "es")}
          />
          <Segmented
            label="Layout"
            tone={dark ? "paper" : "ink"}
            options={[
              { value: "landscape", label: "Landscape" },
              { value: "portrait", label: "Portrait" },
            ]}
            value={layout}
            onChange={(value) => setLayout(value as "landscape" | "portrait")}
          />
        </div>
      </div>

      <div className={layout === "portrait" ? "mx-auto w-full max-w-md" : ""}>
        <TicketWall
          themeId={modeId}
          lang={lang}
          layout={layout}
          count={layout === "portrait" ? 8 : 12}
        />
      </div>
    </div>
  );
}

function Segmented({
  label,
  options,
  value,
  onChange,
  tone = "ink",
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  tone?: "ink" | "paper";
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span
        className={`font-mono text-[10px] font-semibold uppercase tracking-[0.16em] ${
          "text-ink-faint"
        }`}
      >
        {label}
      </span>
      <div
        className="inline-flex rounded-full border border-rule-strong bg-sheet p-0.5"
        role="group"
        aria-label={label}
      >
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={value === option.value}
            className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-medium transition-colors ${
              value === option.value
                ? "bg-flag text-white"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
