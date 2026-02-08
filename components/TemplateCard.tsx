"use client";

import type { CvData } from "@/lib/cv";
import type { TemplateId, TemplateMeta } from "@/templates";
import { RenderTemplate } from "@/templates";
import { A4_HEIGHT, A4_WIDTH } from "@/components/CvPaper";

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

      <div className="mt-4 overflow-hidden rounded-2xl bg-zinc-100 p-3 ring-1 ring-zinc-200">
        {/* Mini preview (scaled)
            NOTE: transform doesn't affect layout size, so we wrap it in a sized box.
        */}
        <div className="flex justify-center">
          {(() => {
            const s = 0.3;
            return (
              <div
                className="relative overflow-hidden"
                style={{ width: A4_WIDTH * s, height: A4_HEIGHT * s }}
              >
                <div
                  className="absolute left-0 top-0 origin-top-left"
                  style={{ transform: `scale(${s})`, width: A4_WIDTH, height: A4_HEIGHT }}
                >
                  <RenderTemplate id={meta.id} data={data} />
                </div>
              </div>
            );
          })()}
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
