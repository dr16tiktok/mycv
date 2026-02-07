import type { CvData } from "@/lib/cv";
import { bulletsFromText } from "@/lib/cv";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
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

  return (
    <div className="rounded-[28px] bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200">
      <div className="p-7">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <div className="text-3xl font-semibold tracking-tight">
              {data.fullName}
            </div>
            <div className="mt-1 text-sm text-zinc-600">{data.role}</div>
          </div>
          <div className="text-right text-xs text-zinc-600">
            <div>{data.city}</div>
            <div className="break-all">{data.email}</div>
          </div>
        </div>

        <div className="mt-6 grid gap-6">
          <Section title="Perfil">
            <p className="text-sm leading-relaxed text-zinc-700">
              {data.summary}
            </p>
          </Section>

          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <Section title="Experiencia">
                <ul className="grid gap-2">
                  {exp.length > 0 ? (
                    exp.slice(0, 10).map((b, i) => (
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

            <Section title="Educación">
              <ul className="grid gap-1">
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
            </Section>

            <Section title="Habilidades">
              <div className="flex flex-wrap gap-2">
                {data.skills.slice(0, 12).map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] text-zinc-700"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}
