import type { ReactNode } from "react";
import type { CvData } from "@/lib/cv";
import { bulletsFromText, initialsFromName } from "@/lib/cv";
import { CvPaper } from "@/components/CvPaper";

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
      {children}
    </div>
  );
}

function ContactRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="grid grid-cols-[14px_1fr] items-start gap-2">
      <div className="mt-[2px] h-2.5 w-2.5 rounded-full bg-zinc-300" />
      <div className="min-w-0 break-words">{value}</div>
    </div>
  );
}

export function TemplateClassic({ data }: { data: CvData }) {
  const expLegacy = bulletsFromText(data.experience);
  const expItems = data.experiences && data.experiences.length > 0 ? data.experiences : null;
  const edu = bulletsFromText(data.education);
  const initials = initialsFromName(data.fullName);

  return (
    <CvPaper className="rounded-2xl">
      {/* Decorative header band (like Canva-style templates) */}
      <div className="h-20 bg-zinc-100">
        <div className="h-full w-full bg-gradient-to-r from-zinc-100 via-zinc-100 to-zinc-200" />
      </div>
      <div className="-mt-14 grid grid-cols-[250px_1fr] gap-7 px-8 pb-10">
        {/* Sidebar */}
        <aside className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200">
          {/* Photo placeholder */}
          <div className="flex justify-center">
            <div className="h-28 w-28 overflow-hidden rounded-2xl bg-zinc-900 text-white">
              <div className="flex h-full w-full items-center justify-center text-3xl font-semibold">
                {initials}
              </div>
            </div>
          </div>

          <div className="mt-5 text-center">
            <div className="text-[13px] font-semibold tracking-[0.22em] text-zinc-500">
              CONTACTO
            </div>
          </div>

          <div className="mt-3 grid gap-2 text-xs text-zinc-600">
            <ContactRow label="city" value={data.city} />
            <ContactRow label="email" value={data.email} />
            {data.socials.slice(0, 4).map((s) => (
              <ContactRow
                key={s.label}
                label={s.label}
                value={`${s.label}: ${s.value}`}
              />
            ))}
          </div>

          <div className="mt-5 h-px bg-zinc-200" />

          <div className="mt-5">
            <div className="text-[13px] font-semibold tracking-[0.22em] text-zinc-500">
              EDUCACIÓN
            </div>
            <ul className="mt-3 grid gap-2">
              {edu.length > 0 ? (
                edu.slice(0, 6).map((b, i) => (
                  <li key={i} className="text-xs leading-relaxed text-zinc-700">
                    {b}
                  </li>
                ))
              ) : (
                <li className="text-xs text-zinc-500">(Sin datos aún)</li>
              )}
            </ul>
          </div>

          <div className="mt-5 h-px bg-zinc-200" />

          <div className="mt-5">
            <div className="text-[13px] font-semibold tracking-[0.22em] text-zinc-500">
              HABILIDADES
            </div>
            <ul className="mt-3 grid gap-1 text-xs text-zinc-700">
              {data.skills.slice(0, 10).map((s) => (
                <li key={s} className="flex items-start gap-2">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main */}
        <section className="min-w-0 pt-1">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
            <div className="text-3xl font-semibold tracking-tight">
              {data.fullName}
            </div>
            <div className="mt-1 text-sm uppercase tracking-[0.18em] text-zinc-500">
              {data.role}
            </div>
            <div className="mt-4 h-1 w-16 bg-zinc-300" />

            <div className="mt-6">
              <SectionTitle>Profile</SectionTitle>
              <p className="mt-3 text-sm leading-relaxed text-zinc-700">
                {data.summary}
              </p>
            </div>

            <div className="mt-7">
              <SectionTitle>Work Experience</SectionTitle>

              {expItems ? (
                <div className="mt-4 grid gap-5">
                  {expItems.slice(0, 3).map((job, j) => (
                    <div key={j} className="rounded-xl border border-zinc-200 p-4">
                      <div className="flex items-baseline justify-between gap-4">
                        <div className="text-sm font-semibold text-zinc-800">
                          {job.company || "Empresa"}
                        </div>
                        <div className="text-xs text-zinc-500">
                          {job.dates || "Fechas"}
                        </div>
                      </div>
                      <div className="mt-1 text-xs text-zinc-500">
                        {job.title || "Cargo"}
                      </div>
                      {job.bullets.length > 0 && (
                        <ul className="mt-3 grid gap-1">
                          {job.bullets.slice(0, 5).map((b, i) => (
                            <li key={i} className="text-sm text-zinc-700">
                              {b}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="mt-4 grid gap-2">
                  {expLegacy.length > 0 ? (
                    expLegacy.slice(0, 10).map((b, i) => (
                      <li key={i} className="text-sm text-zinc-700">
                        {b}
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-zinc-500">(Sin datos aún)</li>
                  )}
                </ul>
              )}
            </div>

            <div className="mt-7">
              <SectionTitle>Reference</SectionTitle>
              <div className="mt-3 text-sm text-zinc-500">
                Disponibles a pedido.
              </div>
            </div>
          </div>
        </section>
      </div>
    </CvPaper>
  );
}
