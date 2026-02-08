"use client";

import { useEffect, useMemo, useState } from "react";
import type { CvData } from "@/lib/cv";
import { RenderTemplate, type TemplateId } from "@/templates";
import { CvPaper } from "@/components/CvPaper";

type StoredPrintPayload = {
  templateId: TemplateId;
  cvData: CvData;
  savedAt: number;
};

export default function PrintPage() {
  const [payload, setPayload] = useState<StoredPrintPayload | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("mycv:print");
      if (!raw) return;
      const parsed = JSON.parse(raw) as StoredPrintPayload;
      if (!parsed?.templateId || !parsed?.cvData) return;
      setPayload(parsed);
    } catch {
      // ignore
    }
  }, []);

  const canPrint = !!payload;

  // Trigger print once content is mounted.
  useEffect(() => {
    if (!canPrint) return;
    const t = setTimeout(() => {
      window.print();
    }, 250);
    return () => clearTimeout(t);
  }, [canPrint]);

  const title = useMemo(() => {
    if (!payload) return "Exportar";
    const name = payload.cvData.fullName?.trim();
    return name ? `CV - ${name}` : "CV";
  }, [payload]);

  return (
    <div className="min-h-screen bg-zinc-200 p-6 text-zinc-900">
      <style jsx global>{`
        @page {
          size: A4;
          margin: 0;
        }
        @media print {
          html,
          body {
            background: #fff !important;
          }
          .no-print {
            display: none !important;
          }
          .print-sheet {
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
          }
        }
      `}</style>

      <div className="no-print mx-auto mb-4 flex max-w-3xl items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">{title}</div>
          <div className="text-xs text-zinc-600">
            Se abrirá el diálogo de impresión. Elegí “Guardar como PDF”.
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            disabled={!canPrint}
            className="rounded-xl bg-sky-400 px-4 py-2 text-sm font-semibold text-zinc-950 disabled:opacity-50"
          >
            Imprimir / PDF
          </button>
          <button
            type="button"
            onClick={() => window.close()}
            className="rounded-xl border border-zinc-400 bg-white px-4 py-2 text-sm"
          >
            Cerrar
          </button>
        </div>
      </div>

      {!payload ? (
        <div className="no-print mx-auto max-w-2xl rounded-2xl border border-zinc-300 bg-white p-4 text-sm text-zinc-700">
          No encontré datos para exportar. Volvé a la vista previa y tocá “Descargar
          PDF”.
        </div>
      ) : (
        <div className="mx-auto flex w-full justify-center">
          <div className="print-sheet">
            <CvPaper>
              <RenderTemplate id={payload.templateId} data={payload.cvData} />
            </CvPaper>
          </div>
        </div>
      )}
    </div>
  );
}
