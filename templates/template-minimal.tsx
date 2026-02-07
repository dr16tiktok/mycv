import type { ReactNode } from "react";
import type { CvData } from "@/lib/cv";
import { bulletsFromText, initialsFromName } from "@/lib/cv";
import { CvPaper } from "@/components/CvPaper";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
        {title}
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

export function TemplateMinimal({ data }: { data: CvData }) {
  const exp = bulletsFromText(data.experience);
  const edu = bulletsFromText(data.education);
  const initials = initialsFromName(data.fullName);

  return (
    <CvPaper className="rounded-2xl">
      <div className="grid grid-cols-[240px_1fr] gap-8 p-10">
        {/* Sidebar */}
        <aside className="rounded-2xl bg-zinc-50 p-6 ring-1 ring-zinc-200">
          <div className="flex justify-center">
            <div className="h-28 w-28 overflow-hidden rounded-full bg-zinc-900 text-white">
              <div className="flex h-full w-full items-center justify-center text-3xl font-semibold">
                {initials}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="text-[13px] font-semibold tracking-[0.28em] text-zinc-500">
              CONTACT
            </div>
            <div className="mt-3 grid gap-2 text-xs text-zinc-700">
              <div className="break-words">{data.city}</div>
              <div className="break-all">{data.email}</div>
              {data.socials.slice(0, 4).map((s) => (
                <div key={s.label} className="break-all text-zinc-600">
                  {s.value}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 h-px bg-zinc-200" />

          <div className="mt-6">
            <div className="text-[13px] font-semibold tracking-[0.28em] text-zinc-500">
              SKILLS
            </div>
            <ul className="mt-3 grid gap-1 text-xs text-zinc-700">
              {data.skills.slice(0, 12).map((s) => (
                <li key={s} className="flex items-start gap-2">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 h-px bg-zinc-200" />

          <div className="mt-6">
            <div className="text-[13px] font-semibold tracking-[0.28em] text-zinc-500">
              EDUCATION
            </div>
            <ul className="mt-3 grid gap-2">
              {edu.length > 0 ? (
                edu.slice(0, 8).map((b, i) => (
                  <li key={i} className="text-xs leading-relaxed text-zinc-700">
                    {b}
                  </li>
                ))
              ) : (
                <li className="text-xs text-zinc-500">(Sin datos aún)</li>
              )}
            </ul>
          </div>
        </aside>

        {/* Main */}
        <section className="min-w-0">
          <div className="text-4xl font-semibold tracking-tight">
            {data.fullName}
          </div>
          <div className="mt-2 text-sm uppercase tracking-[0.18em] text-zinc-500">
            {data.role}
          </div>
          <div className="mt-4 h-px bg-zinc-200" />

          <div className="mt-6 grid gap-7">
            <Section title="Profile">
              <p className="text-sm leading-relaxed text-zinc-700">
                {data.summary}
              </p>
            </Section>

            <Section title="Work Experience">
              <ul className="grid gap-2">
                {exp.length > 0 ? (
                  exp.slice(0, 12).map((b, i) => (
                    <li key={i} className="text-sm text-zinc-700">
                      {b}
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-zinc-500">(Sin datos aún)</li>
                )}
              </ul>
            </Section>
          </div>
        </section>
      </div>
    </CvPaper>
  );
}
