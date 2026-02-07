import type { CvData } from "@/lib/cv";
import { bulletsFromText } from "@/lib/cv";

function SectionTitle({ children }: { children: React.ReactNode }) {
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
    <div className="rounded-[28px] bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200">
      <div className="grid grid-cols-[220px_1fr] gap-6 p-6">
        {/* Sidebar */}
        <aside className="rounded-2xl bg-zinc-50 p-4 ring-1 ring-zinc-200">
          <div className="text-lg font-semibold leading-tight">
            {data.fullName}
          </div>
          <div className="mt-1 text-sm text-zinc-500">{data.role}</div>

          <div className="mt-4 h-px bg-zinc-200" />

          <div className="mt-4 grid gap-2 text-xs text-zinc-600">
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
                  {data.socials.slice(0, 4).map((s) => (
                    <div key={s.label} className="break-all">
                      <span className="text-zinc-500">{s.label}:</span> {s.value}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 h-px bg-zinc-200" />

          <div className="mt-4">
            <SectionTitle>Habilidades</SectionTitle>
            <div className="mt-2 flex flex-wrap gap-2">
              {data.skills.slice(0, 12).map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-white px-2 py-1 text-[11px] text-zinc-700 ring-1 ring-zinc-200"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </aside>

        {/* Main */}
        <section className="min-w-0">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5">
            <SectionTitle>Perfil</SectionTitle>
            <p className="mt-2 text-sm leading-relaxed text-zinc-700">
              {data.summary}
            </p>
          </div>

          <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5">
            <SectionTitle>Experiencia</SectionTitle>
            <ul className="mt-3 grid gap-2">
              {exp.length > 0 ? (
                exp.slice(0, 8).map((b, i) => (
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

          <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5">
            <SectionTitle>Educación</SectionTitle>
            <ul className="mt-3 grid gap-2">
              {edu.length > 0 ? (
                edu.slice(0, 6).map((b, i) => (
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
    </div>
  );
}
