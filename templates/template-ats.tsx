import type { CvData } from "@/lib/cv";
import { bulletsFromText } from "@/lib/cv";
import { CvPaper } from "@/components/CvPaper";

function SectionTitle({ title }: { title: string }) {
  return (
    <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
      {title}
    </h2>
  );
}

export function TemplateAts({ data }: { data: CvData }) {
  const expLegacy = bulletsFromText(data.experience);
  const expItems = data.experiences && data.experiences.length > 0 ? data.experiences : null;
  const edu = bulletsFromText(data.education);

  return (
    <CvPaper className="rounded-none ring-0 shadow-none">
      <div className="px-12 py-10 text-zinc-900">
        <header className="border-b border-zinc-300 pb-4">
          <h1 className="text-3xl font-bold tracking-tight">{data.fullName}</h1>
          <p className="mt-1 text-sm text-zinc-700">{data.role}</p>
          <p className="mt-2 text-xs text-zinc-600">
            {data.city}
            {data.phone ? ` · ${data.phone}` : ""} · {data.email}
          </p>
          {(data.workMode || data.relocation) && (
            <p className="mt-1 text-xs text-zinc-600">
              {data.workMode ? `Modalidad: ${data.workMode}` : ""}
              {data.workMode && data.relocation ? " · " : ""}
              {data.relocation ? `Relocalización: ${data.relocation}` : ""}
            </p>
          )}
        </header>

        <section className="mt-5">
          <SectionTitle title="Resumen" />
          <p className="mt-2 text-sm leading-relaxed text-zinc-700">{data.summary}</p>
        </section>

        <section className="mt-5">
          <SectionTitle title="Experiencia" />
          {expItems ? (
            <div className="mt-3 grid gap-4">
              {expItems.slice(0, 4).map((job, idx) => (
                <article key={idx}>
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="text-sm font-semibold text-zinc-900">{job.title || "Cargo"}</h3>
                    <span className="text-xs text-zinc-500">{job.dates || "Fechas"}</span>
                  </div>
                  <div className="text-xs text-zinc-600">{job.company || "Empresa"}</div>
                  {job.bullets.length > 0 && (
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700">
                      {job.bullets.slice(0, 6).map((bullet, i) => (
                        <li key={i}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700">
              {expLegacy.length > 0 ? (
                expLegacy.slice(0, 12).map((item, i) => <li key={i}>{item}</li>)
              ) : (
                <li>(Sin datos aún)</li>
              )}
            </ul>
          )}
        </section>

        <section className="mt-5 grid grid-cols-2 gap-8">
          <div>
            <SectionTitle title="Educación" />
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700">
              {edu.length > 0 ? edu.slice(0, 8).map((e, i) => <li key={i}>{e}</li>) : <li>(Sin datos aún)</li>}
            </ul>
          </div>
          <div>
            <SectionTitle title="Skills" />
            <p className="mt-2 text-sm text-zinc-700">{data.skills.join(" · ")}</p>
            {data.languages && data.languages.length > 0 && (
              <>
                <SectionTitle title="Idiomas" />
                <p className="mt-2 text-sm text-zinc-700">{data.languages.join(" · ")}</p>
              </>
            )}
          </div>
        </section>
      </div>
    </CvPaper>
  );
}
