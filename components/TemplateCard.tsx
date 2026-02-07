"use client";

import type { CvData } from "@/lib/cv";
import type { TemplateId, TemplateMeta } from "@/templates";
import { RenderTemplate } from "@/templates";

export function TemplateCard({
  meta,
  active,
  onSelect,
  data,
}: {
  meta: TemplateMeta;
  active: boolean;
  onSelect: (id: TemplateId) => void;
  data: CvData;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(meta.id)}
      className={`w-full rounded-3xl border p-4 text-left transition ${
        active ? "border-sky-400 bg-sky-400/10" : "border-zinc-800 bg-zinc-900"
      }`}
    >
      <div className="text-base font-semibold">{meta.name}</div>
      <div className="mt-1 text-sm text-zinc-400">{meta.description}</div>

      <div className="mt-4 overflow-hidden rounded-2xl bg-zinc-950 p-3 ring-1 ring-zinc-800">
        {/* Mini preview (scaled) */}
        <div
          className="origin-top-left"
          style={{ transform: "scale(0.42)", width: 760 }}
        >
          <RenderTemplate id={meta.id} data={data} />
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-zinc-400">
        <span
          className={`inline-block h-2 w-2 rounded-full ${
            active ? "bg-sky-400" : "bg-zinc-700"
          }`}
        />
        {active ? "Seleccionado" : "Seleccionar"}
      </div>
    </button>
  );
}
