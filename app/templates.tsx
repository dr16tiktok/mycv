type CvData = {
  fullName: string;
  role: string;
  city: string;
  email: string;
  summary: string;
  experience: string;
  education: string;
  skills: string[];
  socials: { label: string; value: string }[];
};

const sectionTitle = "text-xs uppercase tracking-[0.3em] text-zinc-500";

export function TemplateClassic({ data }: { data: CvData }) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-6 text-zinc-900 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-semibold">{data.fullName}</div>
          <div className="text-sm text-zinc-500">
            {data.role} · {data.city}
          </div>
        </div>
        <div className="text-xs text-zinc-500">{data.email}</div>
      </div>

      <div className="mt-5 text-sm text-zinc-700">{data.summary}</div>

      <div className="mt-6 grid gap-4">
        <div>
          <div className={sectionTitle}>Experiencia</div>
          <div className="mt-2 whitespace-pre-line text-sm text-zinc-700">
            {data.experience}
          </div>
        </div>
        <div>
          <div className={sectionTitle}>Educación</div>
          <div className="mt-2 whitespace-pre-line text-sm text-zinc-700">
            {data.education}
          </div>
        </div>
        <div>
          <div className={sectionTitle}>Habilidades</div>
          <div className="mt-2 text-sm text-zinc-700">
            {data.skills.join(" · ")}
          </div>
        </div>
      </div>
    </div>
  );
}

export function TemplateMinimal({ data }: { data: CvData }) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-zinc-50">
      <div className="text-sm text-zinc-500">{data.role}</div>
      <div className="text-3xl font-semibold">{data.fullName}</div>
      <div className="mt-1 text-sm text-zinc-400">
        {data.city} · {data.email}
      </div>

      <div className="mt-5 text-sm text-zinc-300">{data.summary}</div>

      <div className="mt-6 grid gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            Experiencia
          </div>
          <div className="mt-2 whitespace-pre-line text-sm text-zinc-200">
            {data.experience}
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            Educación
          </div>
          <div className="mt-2 whitespace-pre-line text-sm text-zinc-200">
            {data.education}
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            Habilidades
          </div>
          <div className="mt-2 text-sm text-zinc-200">
            {data.skills.join(" · ")}
          </div>
        </div>
      </div>
    </div>
  );
}

export function TemplateCreative({ data }: { data: CvData }) {
  return (
    <div className="rounded-3xl border border-sky-400/30 bg-gradient-to-br from-sky-500/10 via-zinc-950 to-zinc-950 p-6 text-zinc-50">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-sky-200">{data.role}</div>
          <div className="text-3xl font-semibold">{data.fullName}</div>
          <div className="mt-1 text-sm text-zinc-300">
            {data.city}
          </div>
        </div>
        <div className="rounded-full border border-sky-400/40 px-3 py-1 text-xs text-sky-200">
          {data.email}
        </div>
      </div>

      <div className="mt-5 text-sm text-zinc-200">{data.summary}</div>

      <div className="mt-6 grid gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-sky-300">
            Experiencia
          </div>
          <div className="mt-2 whitespace-pre-line text-sm text-zinc-100">
            {data.experience}
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-sky-300">
            Educación
          </div>
          <div className="mt-2 whitespace-pre-line text-sm text-zinc-100">
            {data.education}
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-sky-300">
            Habilidades
          </div>
          <div className="mt-2 text-sm text-zinc-100">
            {data.skills.join(" · ")}
          </div>
        </div>
      </div>
    </div>
  );
}
