import type { CvData } from "@/lib/cv";
import { bulletsFromText } from "@/lib/cv";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-200">
      {children}
    </div>
  );
}

export function TemplateCreative({ data }: { data: CvData }) {
  const exp = bulletsFromText(data.experience);
  const edu = bulletsFromText(data.education);

  return (
    <div className="rounded-[28px] bg-gradient-to-br from-sky-500/15 via-zinc-950 to-zinc-950 text-zinc-50 shadow-sm ring-1 ring-sky-400/20">
      <div className="p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm text-sky-200">{data.role}</div>
            <div className="text-3xl font-semibold tracking-tight">
              {data.fullName}
            </div>
            <div className="mt-2 text-sm text-zinc-300">{data.city}</div>
          </div>
          <div className="rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-xs text-sky-200">
            {data.email}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-[1fr_220px] gap-6">
          <div className="min-w-0">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <SectionTitle>Perfil</SectionTitle>
              <p className="mt-2 text-sm leading-relaxed text-zinc-200">
                {data.summary}
              </p>
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-5">
              <SectionTitle>Experiencia</SectionTitle>
              <div className="mt-3 grid gap-2">
                {exp.length > 0 ? (
                  exp.slice(0, 8).map((b, i) => (
                    <div key={i} className="flex gap-2 text-sm text-zinc-100">
                      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-sky-300" />
                      <span>{b}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-zinc-400">(Sin datos aún)</div>
                )}
              </div>
            </div>
          </div>

          <aside className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <SectionTitle>Habilidades</SectionTitle>
            <div className="mt-3 flex flex-wrap gap-2">
              {data.skills.slice(0, 12).map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-sky-400/25 bg-sky-400/10 px-2.5 py-1 text-[11px] text-sky-100"
                >
                  {s}
                </span>
              ))}
            </div>

            <div className="mt-5">
              <SectionTitle>Educación</SectionTitle>
              <ul className="mt-3 grid gap-2">
                {edu.length > 0 ? (
                  edu.slice(0, 6).map((b, i) => (
                    <li key={i} className="text-sm text-zinc-200">
                      {b}
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-zinc-400">(Sin datos aún)</li>
                )}
              </ul>
            </div>

            {data.socials.length > 0 && (
              <div className="mt-5">
                <SectionTitle>Links</SectionTitle>
                <ul className="mt-3 grid gap-1">
                  {data.socials.slice(0, 4).map((s) => (
                    <li key={s.label} className="text-xs text-zinc-200">
                      <span className="text-zinc-400">{s.label}:</span> {s.value}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
