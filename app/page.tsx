"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { bulletsFromText, type CvData } from "@/lib/cv";
import { RenderTemplate, templateRegistry, type TemplateId } from "@/templates";
import { TemplateCard } from "@/components/TemplateCard";

const baseSteps = [
  {
    id: "fullName",
    title: "¿Cuál es tu nombre completo?",
    subtitle: "Es el título principal de tu CV.",
    placeholder: "Ej: Daniel Rodriguez",
    required: true,
  },
  {
    id: "role",
    title: "¿Cuál es el rol o cargo deseado?",
    subtitle: "Ayuda a enfocar tu perfil.",
    placeholder: "Ej: Growth Manager",
    required: true,
  },
  {
    id: "city",
    title: "¿En qué ciudad y país estás?",
    subtitle: "Ej: Miami Beach, FL",
    placeholder: "Ciudad, País",
    required: true,
  },
  {
    id: "email",
    title: "¿Cuál es tu email?",
    subtitle: "Para que te contacten.",
    placeholder: "tucorreo@email.com",
    required: true,
  },
];

const socialOptions = [
  { id: "linkedin", label: "LinkedIn" },
  { id: "github", label: "GitHub" },
  { id: "x", label: "X / Twitter" },
  { id: "portfolio", label: "Portfolio" },
];

const extraSteps = [
  {
    id: "summary",
    title: "Resumen profesional",
    subtitle: "2–3 líneas sobre tu perfil.",
    placeholder: "Soy emprendedor...",
    kind: "summary" as const,
  },
  {
    id: "experienceHome",
    title: "Experiencia laboral",
    subtitle: "Agregá uno o más trabajos. Después se verá como un CV real.",
    kind: "experienceHome" as const,
  },
  {
    id: "education",
    title: "Educación",
    subtitle: "Título, institución y año.",
    placeholder: "Lic. en Marketing — UBA (2016)",
    kind: "education" as const,
  },
  {
    id: "skills",
    title: "Habilidades",
    subtitle: "Seleccioná o agregá las tuyas.",
    kind: "skills" as const,
  },
  {
    id: "template",
    title: "Elegí un template",
    subtitle: "Podés cambiarlo después.",
    kind: "template" as const,
  },
  {
    id: "preview",
    title: "Preview",
    subtitle: "Así se verá tu CV.",
    kind: "preview" as const,
  },
];

const experienceEditSteps = [
  {
    id: "expCompany",
    title: "Empresa",
    subtitle: "¿Dónde trabajaste?",
    placeholder: "Ej: Borcelle Studio",
    required: true,
    kind: "expCompany" as const,
  },
  {
    id: "expTitle",
    title: "Cargo",
    subtitle: "¿Cuál fue tu puesto?",
    placeholder: "Ej: Marketing Manager",
    required: true,
    kind: "expTitle" as const,
  },
  {
    id: "expDates",
    title: "Fechas",
    subtitle: "Ej: 2023 — Presente",
    placeholder: "Ej: 2025 — 2029",
    required: true,
    kind: "expDates" as const,
  },
  {
    id: "expBullets",
    title: "Logros / responsabilidades",
    subtitle: "Una línea por bullet.",
    placeholder: "• Logro 1...\n• Logro 2...",
    required: false,
    kind: "expBullets" as const,
  },
];

type ExperienceEditKind =
  | "expCompany"
  | "expTitle"
  | "expDates"
  | "expBullets";

type ExperienceDraft = {
  id: string;
  company: string;
  title: string;
  dates: string;
  bulletsText: string;
};

const skillOptions = [
  "Producto",
  "Growth",
  "Ventas",
  "Marketing",
  "Operaciones",
  "Automatización",
  "Data",
  "IA",
  "E-commerce",
  "UX/UI",
];

// Templates are defined in @/templates (registry)

type BaseStepId = (typeof baseSteps)[number]["id"];

type SocialId = (typeof socialOptions)[number]["id"];

type WizardStep = {
  id: string;
  kind: string;
  title: string;
  subtitle?: string;
  placeholder?: string;
  required?: boolean;
};

export default function Home() {
  const [index, setIndex] = useState(0);
  const [form, setForm] = useState<Record<BaseStepId, string>>({
    fullName: "",
    role: "",
    city: "",
    email: "",
  });
  const [socials, setSocials] = useState<Record<SocialId, boolean>>({
    linkedin: false,
    github: false,
    x: false,
    portfolio: false,
  });
  const [socialLinks, setSocialLinks] = useState<Record<SocialId, string>>({
    linkedin: "",
    github: "",
    x: "",
    portfolio: "",
  });
  const [summary, setSummary] = useState("");
  const [education, setEducation] = useState("");

  const [experiences, setExperiences] = useState<ExperienceDraft[]>([]);
  const [editingExpId, setEditingExpId] = useState<string | null>(null);

  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  const [templateId, setTemplateId] = useState<TemplateId>(
    templateRegistry[0].id
  );
  const [previewZoom, setPreviewZoom] = useState(0.55);

  const steps = useMemo<WizardStep[]>(() => {
    const selected = socialOptions.filter((s) => socials[s.id]);
    const socialSteps: WizardStep[] = selected.map((s) => ({
      id: s.id,
      title: `Tu ${s.label}`,
      subtitle: "Pegá el link o usuario.",
      placeholder:
        s.id === "linkedin"
          ? "linkedin.com/in/tuusuario"
          : s.id === "github"
          ? "github.com/tuusuario"
          : s.id === "x"
          ? "@tuusuario"
          : "https://tu-portfolio.com",
      required: false,
      kind: "social" as const,
    }));

    const extra: WizardStep[] = (extraSteps as unknown as WizardStep[]).flatMap((s) => {
      if (s.kind === "experienceHome") {
        return [
          s,
          ...(editingExpId
            ? (experienceEditSteps as unknown as WizardStep[])
            : []),
        ];
      }
      return [s];
    });

    return [
      ...baseSteps.map((s) => ({ ...s, kind: "base" } as WizardStep)),
      {
        id: "socials",
        title: "¿Qué redes querés agregar?",
        subtitle: "Elegí todas las que apliquen.",
        kind: "socials",
      } as WizardStep, 
      ...socialSteps,
      ...extra,
    ];
  }, [socials, editingExpId]);

  const step = steps[index];
  const total = steps.length;

  const editingExp = useMemo(() => {
    if (!editingExpId) return null;
    return experiences.find((e) => e.id === editingExpId) ?? null;
  }, [editingExpId, experiences]);

  const canNext = useMemo(() => {
    if (!step) return false;

    if (step.kind === "base") {
      return form[step.id as BaseStepId].trim().length > 0;
    }

    if (step.kind === "expCompany") return (editingExp?.company ?? "").trim().length > 0;
    if (step.kind === "expTitle") return (editingExp?.title ?? "").trim().length > 0;
    if (step.kind === "expDates") return (editingExp?.dates ?? "").trim().length > 0;

    return true;
  }, [editingExp, form, step]);

  const goNext = () => {
    if (!step) return;

    if (step.kind === "expBullets") {
      setEditingExpId(null);
      return;
    }

    if (index < total - 1) setIndex(index + 1);
  };

  const goPrev = () => {
    if (!step) return;

    if (step.kind === "expCompany") {
      setEditingExpId(null);
      return;
    }

    if (index > 0) setIndex(index - 1);
  };

  const skip = () => {
    if (!step) return;
    if (step.kind === "expBullets") {
      setEditingExpId(null);
      return;
    }
    goNext();
  };

  useEffect(() => {
    if (editingExpId) {
      const target = steps.findIndex((s) => s.kind === "expCompany");
      if (target >= 0 && target !== index) setIndex(target);
      return;
    }

    // If we just finished/canceled experience editing, return to the home screen.
    if (
      step?.kind === "expCompany" ||
      step?.kind === "expTitle" ||
      step?.kind === "expDates" ||
      step?.kind === "expBullets"
    ) {
      const home = steps.findIndex((s) => s.kind === "experienceHome");
      if (home >= 0 && home !== index) setIndex(home);
    }
  }, [editingExpId, index, step?.kind, steps]);

  const toggleSkill = (label: string) => {
    setSkills((prev) =>
      prev.includes(label)
        ? prev.filter((s) => s !== label)
        : [...prev, label]
    );
  };

  const addCustomSkill = () => {
    const value = skillInput.trim();
    if (!value) return;
    if (!skills.includes(value)) setSkills([...skills, value]);
    setSkillInput("");
  };

  const addExperience = () => {
    const id =
      (globalThis.crypto as any)?.randomUUID?.() ??
      `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    setExperiences((prev) => [
      ...prev,
      { id, company: "", title: "", dates: "", bulletsText: "" },
    ]);
    setEditingExpId(id);
  };

  const removeExperience = (id: string) => {
    setExperiences((prev) => prev.filter((e) => e.id !== id));
    if (editingExpId === id) setEditingExpId(null);
  };

  const updateEditingExperience = (
    field: keyof Omit<ExperienceDraft, "id">,
    value: string
  ) => {
    if (!editingExpId) return;
    setExperiences((prev) =>
      prev.map((e) => (e.id === editingExpId ? { ...e, [field]: value } : e))
    );
  };

  const cvData = useMemo<CvData>(() => {
    const socialsList = socialOptions
      .filter((s) => socials[s.id] && socialLinks[s.id].trim().length > 0)
      .map((s) => ({ label: s.label, value: socialLinks[s.id].trim() }));

    const structuredExperiences = experiences
      .map((e) => ({
        company: e.company.trim(),
        title: e.title.trim(),
        dates: e.dates.trim(),
        bullets: bulletsFromText(e.bulletsText),
      }))
      .filter((e) => e.company || e.title || e.dates || e.bullets.length > 0);

    const legacyExperienceText = structuredExperiences.length
      ? structuredExperiences
          .map((e) => {
            const header = `${e.company} — ${e.title} (${e.dates})`;
            const bullets = e.bullets.map((b) => `• ${b}`).join("\n");
            return bullets ? `${header}\n${bullets}` : header;
          })
          .join("\n\n")
      : "• Logro principal...\n• Responsabilidad clave...";

    return {
      fullName: form.fullName || "Tu Nombre",
      role: form.role || "Tu Rol",
      city: form.city || "Ciudad",
      email: form.email || "tu@email.com",
      summary: summary || "Resumen profesional...",
      experience: legacyExperienceText,
      education: education || "Carrera — Universidad (Año)",
      skills: skills.length > 0 ? skills : ["Habilidades"],
      socials: socialsList,
      experiences: structuredExperiences,
    };
  }, [education, experiences, form, skills, socials, socialLinks, summary]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-6 pb-24 pt-10">
        <div className="mb-8">
          <div className="text-xs uppercase tracking-[0.2em] text-zinc-400">
            MyCV · Wizard
          </div>
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-sky-400 transition-all"
              style={{ width: `${((index + 1) / total) * 100}%` }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.section
            key={step.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="flex flex-1 flex-col gap-6"
          >
            <div>
              <h1 className="text-2xl font-semibold leading-tight">
                {step.title}
              </h1>
              {step.subtitle && (
                <p className="mt-2 text-sm text-zinc-400">{step.subtitle}</p>
              )}
            </div>

            {step.kind === "base" && (
              <div>
                <input
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-4 text-base outline-none transition focus:border-sky-400"
                  placeholder={step.placeholder}
                  value={form[step.id as BaseStepId]}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      [step.id as BaseStepId]: e.target.value,
                    })
                  }
                />
              </div>
            )}

            {step.kind === "socials" && (
              <div className="grid gap-3">
                {socialOptions.map((s) => (
                  <label
                    key={s.id}
                    className={`flex items-center justify-between rounded-2xl border px-4 py-4 transition ${
                      socials[s.id]
                        ? "border-sky-400 bg-sky-400/10"
                        : "border-zinc-800 bg-zinc-900"
                    }`}
                  >
                    <span>{s.label}</span>
                    <input
                      type="checkbox"
                      checked={socials[s.id]}
                      onChange={() =>
                        setSocials({
                          ...socials,
                          [s.id]: !socials[s.id],
                        })
                      }
                      className="h-5 w-5 accent-sky-400"
                    />
                  </label>
                ))}
              </div>
            )}

            {step.kind === "social" && (
              <div>
                <input
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-4 text-base outline-none transition focus:border-sky-400"
                  placeholder={step.placeholder}
                  value={socialLinks[step.id as SocialId]}
                  onChange={(e) =>
                    setSocialLinks({
                      ...socialLinks,
                      [step.id as SocialId]: e.target.value,
                    })
                  }
                />
              </div>
            )}

            {step.kind === "summary" && (
              <div>
                <textarea
                  className="min-h-[160px] w-full resize-none rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-4 text-base outline-none transition focus:border-sky-400"
                  placeholder={step.placeholder}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                />
              </div>
            )}

            {step.kind === "experienceHome" && (
              <div className="flex flex-col gap-4">
                <div className="grid gap-3">
                  {experiences.length === 0 ? (
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-sm text-zinc-300">
                      Todavía no agregaste experiencias.
                    </div>
                  ) : (
                    experiences.map((e, idx) => (
                      <div
                        key={e.id}
                        className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4"
                      >
                        <div className="text-sm font-semibold">
                          {e.company || `Experiencia ${idx + 1}`}
                        </div>
                        <div className="mt-1 text-xs text-zinc-400">
                          {(e.title || "Cargo") + " · " + (e.dates || "Fechas")}
                        </div>
                        <div className="mt-3 flex gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingExpId(e.id)}
                            className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-200"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => removeExperience(e.id)}
                            className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-200"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <button
                  type="button"
                  onClick={addExperience}
                  className="rounded-2xl bg-sky-400 px-4 py-4 text-sm font-semibold text-zinc-950 transition hover:bg-sky-300"
                >
                  + Agregar experiencia
                </button>
              </div>
            )}

            {(step.kind === "expCompany" ||
              step.kind === "expTitle" ||
              step.kind === "expDates") && (
              <div>
                <input
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-4 text-base outline-none transition focus:border-sky-400"
                  placeholder={step.placeholder}
                  value={
                    step.kind === "expCompany"
                      ? editingExp?.company ?? ""
                      : step.kind === "expTitle"
                      ? editingExp?.title ?? ""
                      : editingExp?.dates ?? ""
                  }
                  onChange={(e) => {
                    const v = e.target.value;
                    if (step.kind === "expCompany")
                      updateEditingExperience("company", v);
                    else if (step.kind === "expTitle")
                      updateEditingExperience("title", v);
                    else updateEditingExperience("dates", v);
                  }}
                />
              </div>
            )}

            {step.kind === "expBullets" && (
              <div>
                <textarea
                  className="min-h-[200px] w-full resize-none rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-4 text-base outline-none transition focus:border-sky-400"
                  placeholder={step.placeholder}
                  value={editingExp?.bulletsText ?? ""}
                  onChange={(e) =>
                    updateEditingExperience("bulletsText", e.target.value)
                  }
                />
                <div className="mt-2 text-xs text-zinc-400">
                  Tip: empezá cada línea con “•” o “-” para que quede prolijo.
                </div>
              </div>
            )}

            {step.kind === "education" && (
              <div>
                <textarea
                  className="min-h-[160px] w-full resize-none rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-4 text-base outline-none transition focus:border-sky-400"
                  placeholder={step.placeholder}
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                />
              </div>
            )}

            {step.kind === "skills" && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-2">
                  {skillOptions.map((label) => {
                    const active = skills.includes(label);
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => toggleSkill(label)}
                        className={`rounded-full border px-4 py-2 text-sm transition ${
                          active
                            ? "border-sky-400 bg-sky-400/15 text-sky-200"
                            : "border-zinc-800 bg-zinc-900 text-zinc-300"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-2">
                  <input
                    className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-base outline-none transition focus:border-sky-400"
                    placeholder="Agregar habilidad..."
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCustomSkill();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addCustomSkill}
                    className="rounded-2xl border border-zinc-800 px-4 py-3 text-sm text-zinc-200 transition hover:border-zinc-600"
                  >
                    Agregar
                  </button>
                </div>

                {skills.length > 0 && (
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-sm text-zinc-300">
                    {skills.join(" · ")}
                  </div>
                )}
              </div>
            )}

            {step.kind === "template" && (
              <div className="grid gap-4">
                {templateRegistry.map((meta) => (
                  <TemplateCard
                    key={meta.id}
                    meta={meta}
                    active={meta.id === templateId}
                    onSelect={setTemplateId}
                    data={cvData}
                  />
                ))}
              </div>
            )}

            {step.kind === "preview" && (
              <div className="grid gap-3">
                <div className="text-xs text-zinc-400">
                  Preview del template:{" "}
                  <span className="text-zinc-200">
                    {templateRegistry.find((t) => t.id === templateId)?.name}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900 px-3 py-2">
                  <button
                    type="button"
                    onClick={() =>
                      setPreviewZoom((z) => Math.max(0.35, Math.round((z - 0.05) * 100) / 100))
                    }
                    className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-200"
                  >
                    Zoom −
                  </button>
                  <div className="text-xs text-zinc-400">
                    {Math.round(previewZoom * 100)}%
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setPreviewZoom((z) => Math.min(1, Math.round((z + 0.05) * 100) / 100))
                    }
                    className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-200"
                  >
                    Zoom +
                  </button>
                </div>

                <div className="overflow-auto rounded-3xl bg-zinc-100 p-3 ring-1 ring-zinc-200">
                  <div
                    className="origin-top-left"
                    style={{ transform: `scale(${previewZoom})` }}
                  >
                    <RenderTemplate id={templateId} data={cvData} />
                  </div>
                </div>
              </div>
            )}

            <div className="mt-auto grid grid-cols-2 gap-3">
              <button
                onClick={index === 0 ? undefined : goPrev}
                className="rounded-2xl border border-zinc-800 px-4 py-4 text-sm text-zinc-300 transition hover:border-zinc-600 disabled:opacity-40"
                disabled={index === 0}
              >
                Atrás
              </button>
              <button
                onClick={skip}
                className="rounded-2xl border border-zinc-800 px-4 py-4 text-sm text-zinc-300 transition hover:border-zinc-600"
              >
                Saltar
              </button>
              <button
                onClick={goNext}
                disabled={!canNext}
                className="col-span-2 rounded-2xl bg-sky-400 px-4 py-4 text-sm font-semibold text-zinc-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </motion.section>
        </AnimatePresence>
      </main>
    </div>
  );
}
