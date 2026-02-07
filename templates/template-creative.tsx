import type { ReactNode } from "react";
import type { CvData } from "@/lib/cv";
import { bulletsFromText } from "@/lib/cv";
import { CvPaper } from "@/components/CvPaper";

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-700">
      {children}
    </div>
  );
}

export function TemplateCreative({ data }: { data: CvData }) {
  const exp = bulletsFromText(data.experience);
  const edu = bulletsFromText(data.education);

  return (
    <CvPaper className="rounded-2xl">
      {/* Header band */}
      <div className="bg-gradient-to-r from-sky-500 to-indigo-500 px-10 py-10 text-white">
        <div className="text-sm/6 text-white/90">{data.role}</div>
        <div className="text-4xl font-semibold tracking-tight">
          {data.fullName}
        </div>
        <div className="mt-3 text-sm text-white/90">
          {data.city} · {data.email}
        </div>
      </div>

      <div className="p-10">
        <div className="grid grid-cols-[1fr_240px] gap-8">
          <div className="min-w-0">
            <SectionTitle>Perfil</SectionTitle>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              {data.summary}
            </p>

            <div className="mt-7">
              <SectionTitle>Experiencia</SectionTitle>
              <div className="mt-4 grid gap-2">
                {exp.length > 0 ? (
                  exp.slice(0, 10).map((b, i) => (
                    <div key={i} className="flex gap-2 text-sm text-zinc-700">
                      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                      <span>{b}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-zinc-500">(Sin datos aún)</div>
                )}
              </div>
            </div>
          </div>

          <aside>
            <div className="rounded-2xl bg-zinc-50 p-5 ring-1 ring-zinc-200">
              <SectionTitle>Habilidades</SectionTitle>
              <div className="mt-3 flex flex-wrap gap-2">
                {data.skills.slice(0, 14).map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-white px-3 py-1 text-[11px] text-zinc-700 ring-1 ring-zinc-200"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <div className="mt-6">
                <SectionTitle>Educación</SectionTitle>
                <ul className="mt-3 grid gap-2">
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

              {data.socials.length > 0 && (
                <div className="mt-6">
                  <SectionTitle>Links</SectionTitle>
                  <ul className="mt-3 grid gap-1">
                    {data.socials.slice(0, 6).map((s) => (
                      <li key={s.label} className="text-xs text-zinc-700">
                        <span className="text-zinc-500">{s.label}:</span> {s.value}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </CvPaper>
  );
}
