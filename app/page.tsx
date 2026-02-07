"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TemplateClassic,
  TemplateCreative,
  TemplateMinimal,
} from "./templates";

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
    id: "experience",
    title: "Experiencia (resumen)",
    subtitle: "Contá tus principales logros y responsabilidades.",
    placeholder: "• Lanzamiento de X...\n• Lideré Y...",
    kind: "experience" as const,
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

const templates = [
  { id: "classic", name: "Clásico" },
  { id: "minimal", name: "Minimal" },
  { id: "creative", name: "Creativo" },
];

type BaseStepId = (typeof baseSteps)[number]["id"];

type SocialId = (typeof socialOptions)[number]["id"];

type ExtraStepId = (typeof extraSteps)[number]["id"];

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
  const [extras, setExtras] = useState<Record<ExtraStepId, string>>({
    summary: "",
    experience: "",
    education: "",
    skills: "",
  });
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [templateId, setTemplateId] = useState(templates[0].id);

  const steps = useMemo(() => {
    const selected = socialOptions.filter((s) => socials[s.id]);
    const socialSteps = selected.map((s) => ({
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

    return [
      ...baseSteps.map((s) => ({ ...s, kind: "base" as const })),
      {
        id: "socials",
        title: "¿Qué redes querés agregar?",
        subtitle: "Elegí todas las que apliquen.",
        kind: "socials" as const,
      },
      ...socialSteps,
      ...extraSteps,
    ];
  }, [socials]);

  const step = steps[index];
  const total = steps.length;

  const canNext = useMemo(() => {
    if (!step) return false;
    if (step.kind === "base") {
      return form[step.id as BaseStepId].trim().length > 0;
    }
    return true;
  }, [form, step]);

  const goNext = () => {
    if (index < total - 1) setIndex(index + 1);
  };

  const goPrev = () => {
    if (index > 0) setIndex(index - 1);
  };

  const skip = () => {
    goNext();
  };

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

            {(step.kind === "summary" ||
              step.kind === "experience" ||
              step.kind === "education") && (
              <div>
                <textarea
                  className="min-h-[160px] w-full resize-none rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-4 text-base outline-none transition focus:border-sky-400"
                  placeholder={step.placeholder}
                  value={extras[step.id as ExtraStepId]}
                  onChange={(e) =>
                    setExtras({
                      ...extras,
                      [step.id as ExtraStepId]: e.target.value,
                    })
                  }
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
              <div className="grid gap-3">
                {templates.map((t) => {
                  const active = t.id === templateId;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTemplateId(t.id)}
                      className={`flex items-center justify-between rounded-2xl border px-4 py-4 text-left transition ${
                        active
                          ? "border-sky-400 bg-sky-400/10"
                          : "border-zinc-800 bg-zinc-900"
                      }`}
                    >
                      <div>
                        <div className="text-base font-semibold">{t.name}</div>
                        <div className="text-sm text-zinc-400">
                          Estilo limpio y elegante.
                        </div>
                      </div>
                      <div
                        className={`h-3 w-3 rounded-full ${
                          active ? "bg-sky-400" : "bg-zinc-700"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            )}

            {step.kind === "preview" && (() => {
              const data = {
                fullName: form.fullName || "Tu Nombre",
                role: form.role || "Tu Rol",
                city: form.city || "Ciudad",
                email: form.email || "tu@email.com",
                summary: extras.summary || "Resumen profesional...",
                experience: extras.experience || "Experiencia destacada...",
                education: extras.education || "Educación...",
                skills: skills.length > 0 ? skills : ["Habilidades"],
                socials: [],
              };

              return (
                <div className="grid gap-4">
                  {templateId === "classic" && <TemplateClassic data={data} />}
                  {templateId === "minimal" && <TemplateMinimal data={data} />}
                  {templateId === "creative" && <TemplateCreative data={data} />}
                </div>
              );
            })()}

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
