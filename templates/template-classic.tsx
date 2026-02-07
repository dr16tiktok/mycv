import type { ReactNode } from "react";
import type { CvData } from "@/lib/cv";
import { bulletsFromText } from "@/lib/cv";
import { CvPaper } from "@/components/CvPaper";

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
      {children}
    </div>
  );
}

export function TemplateClassic({ data }: { data: CvData }) {
  const exp = bulletsFromText(data.experience);
  const edu = bulletsFromText(data.education);

  return (
    <CvPaper className="rounded-2xl">
      <div className="grid grid-cols-[240px_1fr] gap-7 p-8">
        {/* Sidebar */}
        <aside className="rounded-2xl bg-zinc-50 p-5 ring-1 ring-zinc-200">
          <div className="text-xl font-semibold leading-tight">
            {data.fullName}
          </div>
          <div className="mt-1 text-sm text-zinc-500">{data.role}</div>

          <div className="mt-5 h-px bg-zinc-200" />

          <div className="mt-5 grid gap-3 text-xs text-zinc-600">
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                Ubicación
              </div>
              <div>{data.city}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                Email
              </div>
              <div className="break-all">{data.email}</div>
            </div>
            {data.socials.length > 0 && (
              <div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">
                  Links
                </div>
                <div className="mt-1 grid gap-1">
                  {data.socials.slice(0, 5).map((s) => (
                    <div key={s.label} className="break-all">
                      <span className="text-zinc-500">{s.label}:</span> {s.value}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-5 h-px bg-zinc-200" />

          <div className="mt-5">
            <SectionTitle>Habilidades</SectionTitle>
            <div className="mt-2 flex flex-wrap gap-2">
              {data.skills.slice(0, 14).map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-white px-2.5 py-1 text-[11px] text-zinc-700 ring-1 ring-zinc-200"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </aside>

        {/* Main */}
        <section className="min-w-0">
          <div className="rounded-2xl border border-zinc-200 p-6">
            <SectionTitle>Perfil</SectionTitle>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              {data.summary}
            </p>
          </div>

          <div className="mt-5 rounded-2xl border border-zinc-200 p-6">
            <SectionTitle>Experiencia</SectionTitle>
            <ul className="mt-4 grid gap-2">
              {exp.length > 0 ? (
                exp.slice(0, 10).map((b, i) => (
                  <li key={i} className="flex gap-2 text-sm text-zinc-700">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                    <span className="min-w-0">{b}</span>
                  </li>
                ))
              ) : (
                <li className="text-sm text-zinc-500">(Sin datos aún)</li>
              )}
            </ul>
          </div>

          <div className="mt-5 rounded-2xl border border-zinc-200 p-6">
            <SectionTitle>Educación</SectionTitle>
            <ul className="mt-4 grid gap-2">
              {edu.length > 0 ? (
                edu.slice(0, 8).map((b, i) => (
                  <li key={i} className="text-sm text-zinc-700">
                    {b}
                  </li>
                ))
              ) : (
                <li className="text-sm text-zinc-500">(Sin datos aún)</li>
              )}
            </ul>
          </div>
        </section>
      </div>
    </CvPaper>
  );
}
