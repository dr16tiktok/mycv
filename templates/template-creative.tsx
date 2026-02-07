import type { ReactNode } from "react";
import type { CvData } from "@/lib/cv";
import { bulletsFromText, initialsFromName } from "@/lib/cv";
import { CvPaper } from "@/components/CvPaper";

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-700">
      {children}
    </div>
  );
}

export function TemplateCreative({ data }: { data: CvData }) {
  const expLegacy = bulletsFromText(data.experience);
  const expItems = data.experiences && data.experiences.length > 0 ? data.experiences : null;
  const edu = bulletsFromText(data.education);
  const initials = initialsFromName(data.fullName);

  return (
    <CvPaper className="rounded-2xl">
      <div className="relative overflow-hidden">
        {/* Background shapes */}
        <div className="absolute -right-28 -top-24 h-72 w-72 rotate-12 rounded-[48px] bg-sky-200/70" />
        <div className="absolute -right-14 -top-10 h-56 w-56 rotate-12 rounded-[48px] bg-indigo-200/70" />

        {/* Header band */}
        <div className="relative bg-gradient-to-r from-sky-500 to-indigo-500 px-10 py-10 text-white">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="text-sm/6 text-white/90">{data.role}</div>
              <div className="text-4xl font-semibold tracking-tight">
                {data.fullName}
              </div>
              <div className="mt-3 text-sm text-white/90">
                {data.city} · {data.email}
              </div>
            </div>

            <div className="h-20 w-20 overflow-hidden rounded-2xl bg-white/15 ring-1 ring-white/25">
              <div className="flex h-full w-full items-center justify-center text-2xl font-semibold">
                {initials}
              </div>
            </div>
          </div>
        </div>

        <div className="p-10">
          <div className="grid grid-cols-[1fr_240px] gap-8">
            <div className="min-w-0">
              <SectionTitle>Profile</SectionTitle>
              <p className="mt-3 text-sm leading-relaxed text-zinc-700">
                {data.summary}
              </p>

              <div className="mt-7">
                <SectionTitle>Work Experience</SectionTitle>

                {expItems ? (
                  <div className="mt-4 grid gap-5">
                    {expItems.slice(0, 3).map((job, j) => (
                      <div
                        key={j}
                        className="rounded-2xl border border-zinc-200 bg-white p-4"
                      >
                        <div className="flex items-baseline justify-between gap-4">
                          <div className="text-sm font-semibold text-zinc-900">
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
                          <div className="mt-3 grid gap-2">
                            {job.bullets.slice(0, 5).map((b, i) => (
                              <div
                                key={i}
                                className="flex gap-2 text-sm text-zinc-700"
                              >
                                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                                <span>{b}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 grid gap-2">
                    {expLegacy.length > 0 ? (
                      expLegacy.slice(0, 10).map((b, i) => (
                        <div key={i} className="flex gap-2 text-sm text-zinc-700">
                          <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                          <span>{b}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-zinc-500">(Sin datos aún)</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <aside>
              <div className="rounded-2xl bg-zinc-50 p-5 ring-1 ring-zinc-200">
                <SectionTitle>Skills</SectionTitle>
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
                  <SectionTitle>Education</SectionTitle>
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
      </div>
    </CvPaper>
  );
}
