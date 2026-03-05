"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { bulletsFromText, type CvData } from "@/lib/cv";
import { RenderTemplate, templateRegistry, type TemplateId } from "@/templates";
import { TemplateCard } from "@/components/TemplateCard";
import { A4_HEIGHT, A4_WIDTH } from "@/components/CvPaper";

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
    title: "¿Cuál es tu ubicación (ciudad/país)?",
    subtitle: "No hace falta dirección completa.",
    placeholder: "Ej: Miami Beach, USA",
    required: true,
  },
  {
    id: "phone",
    title: "¿Cuál es tu teléfono?",
    subtitle: "Con código de país.",
    placeholder: "Ej: +1 786 123 4567",
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
    id: "languages",
    title: "Idiomas",
    subtitle: "Elegí opciones y también podés escribir los tuyos.",
    kind: "languages" as const,
  },
  {
    id: "workMode",
    title: "Modalidad de trabajo (opcional)",
    subtitle: "Elegí la modalidad que preferís.",
    kind: "workMode" as const,
  },
  {
    id: "relocation",
    title: "¿Aceptás relocalización?",
    subtitle: "Podés cambiarlo después.",
    kind: "relocation" as const,
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

const languageOptions = ["Español", "Inglés", "Portugués", "Francés", "Italiano", "Alemán"];

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

type WizardDraft = {
  form: Record<BaseStepId, string>;
  socials: Record<SocialId, boolean>;
  socialLinks: Record<SocialId, string>;
  summary: string;
  education: string;
  experiences: ExperienceDraft[];
  skills: string[];
  languages: string[];
  workMode: string;
  relocation: string;
  templateId: TemplateId;
};

const STORAGE_KEY = "mycv:wizard";
const APPLICATIONS_KEY = "mycv:applications";

type ApplicationItem = {
  id: string;
  company: string;
  role: string;
  url: string;
  status: "saved" | "applied" | "interview" | "rejected";
  createdAt: string;
};

function isValidEmail(value: string): boolean {
  if (!value.trim()) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 8;
}

function isProbablyUrl(value: string): boolean {
  const v = value.trim();
  if (!v) return true;
  if (v.startsWith("@")) return true; // X username
  return /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/.*)?$/i.test(v);
}

function loadDraft(): WizardDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as WizardDraft;
  } catch {
    return null;
  }
}

function loadApplications(): ApplicationItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(APPLICATIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ApplicationItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function Home() {
  const [index, setIndex] = useState(0);
  const [form, setForm] = useState<Record<BaseStepId, string>>(() => {
    const draft = loadDraft();
    return (
      draft?.form ?? {
        fullName: "",
        role: "",
        city: "",
        phone: "",
        email: "",
      }
    );
  });
  const [socials, setSocials] = useState<Record<SocialId, boolean>>(() => {
    const draft = loadDraft();
    return (
      draft?.socials ?? {
        linkedin: false,
        github: false,
        x: false,
        portfolio: false,
      }
    );
  });
  const [socialLinks, setSocialLinks] = useState<Record<SocialId, string>>(() => {
    const draft = loadDraft();
    return (
      draft?.socialLinks ?? {
        linkedin: "",
        github: "",
        x: "",
        portfolio: "",
      }
    );
  });
  const [summary, setSummary] = useState(() => loadDraft()?.summary ?? "");
  const [education, setEducation] = useState(() => loadDraft()?.education ?? "");

  const [experiences, setExperiences] = useState<ExperienceDraft[]>(() => loadDraft()?.experiences ?? []);

  const [skills, setSkills] = useState<string[]>(() => loadDraft()?.skills ?? []);
  const [skillInput, setSkillInput] = useState("");
  const [languages, setLanguages] = useState<string[]>(() => loadDraft()?.languages ?? []);
  const [languageInput, setLanguageInput] = useState("");
  const [workMode, setWorkMode] = useState(() => loadDraft()?.workMode ?? "");
  const [relocation, setRelocation] = useState(() => loadDraft()?.relocation ?? "Sí");

  const [templateId, setTemplateId] = useState<TemplateId>(
    () => loadDraft()?.templateId ?? templateRegistry[0].id
  );
  const [previewZoom, setPreviewZoom] = useState(0.55);
  const [applications, setApplications] = useState<ApplicationItem[]>(() => loadApplications());
  const [applicationDraft, setApplicationDraft] = useState({
    company: "",
    role: "",
    url: "",
    status: "saved" as ApplicationItem["status"],
  });

  useEffect(() => {
    try {
      const payload: WizardDraft = {
        form,
        socials,
        socialLinks,
        summary,
        education,
        experiences,
        skills,
        languages,
        workMode,
        relocation,
        templateId,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore
    }
  }, [education, experiences, form, languages, relocation, skills, socialLinks, socials, summary, templateId, workMode]);

  useEffect(() => {
    try {
      localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applications));
    } catch {
      // ignore
    }
  }, [applications]);

  function openPrintView() {
    try {
      localStorage.setItem("mycv:print", JSON.stringify({ templateId, cvData }));
    } catch {
      // ignore
    }

    window.open("/print", "_blank", "noopener,noreferrer");
  }

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

    const extra: WizardStep[] = extraSteps as unknown as WizardStep[];

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
  }, [socials]);

  const step = steps[index];
  const total = steps.length;

  const canNext = useMemo(() => {
    if (!step) return false;

    if (step.kind === "base") {
      const value = form[step.id as BaseStepId].trim();
      if (!value) return false;
      if (step.id === "email") return isValidEmail(value);
      if (step.id === "phone") return isValidPhone(value);
      return true;
    }

    if (step.kind === "social") {
      const value = socialLinks[step.id as SocialId] ?? "";
      return isProbablyUrl(value);
    }

    return true;
  }, [form, socialLinks, step]);

  const goNext = () => {
    if (!step) return;
    if (index < total - 1) setIndex(index + 1);
  };

  const goPrev = () => {
    if (!step) return;
    if (index > 0) setIndex(index - 1);
  };

  const skip = () => {
    if (!step) return;
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

  const toggleLanguage = (label: string) => {
    setLanguages((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const addCustomLanguage = () => {
    const value = languageInput.trim();
    if (!value) return;
    if (!languages.includes(value)) setLanguages([...languages, value]);
    setLanguageInput("");
  };

  const addExperience = () => {
    const id =
      globalThis.crypto?.randomUUID?.() ??
      `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    setExperiences((prev) => [
      ...prev,
      { id, company: "", title: "", dates: "", bulletsText: "" },
    ]);
  };

  const updateExperience = (
    id: string,
    field: keyof Omit<ExperienceDraft, "id">,
    value: string
  ) => {
    setExperiences((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  };

  const removeExperience = (id: string) => {
    setExperiences((prev) => prev.filter((e) => e.id !== id));
  };

  const downloadProfileJson = () => {
    const blob = new Blob([JSON.stringify(cvData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(cvData.fullName || "mycv").replace(/\s+/g, "-").toLowerCase()}-profile.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const addApplication = () => {
    const company = applicationDraft.company.trim();
    const role = applicationDraft.role.trim();
    const url = applicationDraft.url.trim();
    if (!company || !role) return;
    if (url && !isProbablyUrl(url)) return;

    const id = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setApplications((prev) => [
      {
        id,
        company,
        role,
        url,
        status: applicationDraft.status,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    setApplicationDraft({ company: "", role: "", url: "", status: "saved" });
  };

  const removeApplication = (id: string) => {
    setApplications((prev) => prev.filter((item) => item.id !== id));
  };

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

  const cvData: CvData = {
    fullName: form.fullName || "Tu Nombre",
    role: form.role || "Tu Rol",
    city: form.city || "Ubicación",
    phone: form.phone || "",
    email: form.email || "tu@email.com",
    workMode,
    relocation,
    languages,
    summary: summary || "Resumen profesional...",
    experience: legacyExperienceText,
    education: education || "Carrera — Universidad (Año)",
    skills: skills.length > 0 ? skills : ["Habilidades"],
    socials: socialsList,
    experiences: structuredExperiences,
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
                {step.id === "email" && form.email.trim().length > 0 && !isValidEmail(form.email) && (
                  <p className="mt-2 text-xs text-rose-300">Ingresá un email válido (ej: nombre@dominio.com).</p>
                )}
                {step.id === "phone" && form.phone.trim().length > 0 && !isValidPhone(form.phone) && (
                  <p className="mt-2 text-xs text-rose-300">Ingresá un teléfono válido con código de país.</p>
                )}
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
                {socialLinks[step.id as SocialId].trim().length > 0 && !isProbablyUrl(socialLinks[step.id as SocialId]) && (
                  <p className="mt-2 text-xs text-rose-300">Formato inválido. Usá URL (https://...) o @usuario para X.</p>
                )}
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
                        <div className="mb-3 text-sm font-semibold text-zinc-200">
                          Experiencia {idx + 1}
                        </div>
                        <div className="grid gap-2">
                          <input
                            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none transition focus:border-sky-400"
                            placeholder="Empresa"
                            value={e.company}
                            onChange={(ev) => updateExperience(e.id, "company", ev.target.value)}
                          />
                          <input
                            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none transition focus:border-sky-400"
                            placeholder="Cargo"
                            value={e.title}
                            onChange={(ev) => updateExperience(e.id, "title", ev.target.value)}
                          />
                          <input
                            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none transition focus:border-sky-400"
                            placeholder="Fechas (ej: 2023 — Presente)"
                            value={e.dates}
                            onChange={(ev) => updateExperience(e.id, "dates", ev.target.value)}
                          />
                          <textarea
                            className="min-h-[110px] w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none transition focus:border-sky-400"
                            placeholder="Logros / responsabilidades (una línea por bullet)"
                            value={e.bulletsText}
                            onChange={(ev) => updateExperience(e.id, "bulletsText", ev.target.value)}
                          />
                        </div>
                        <div className="mt-3 flex justify-end">
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

            {step.kind === "languages" && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-2">
                  {languageOptions.map((label) => {
                    const active = languages.includes(label);
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => toggleLanguage(label)}
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
                    placeholder="Agregar idioma..."
                    value={languageInput}
                    onChange={(e) => setLanguageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCustomLanguage();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addCustomLanguage}
                    className="rounded-2xl border border-zinc-800 px-4 py-3 text-sm text-zinc-200 transition hover:border-zinc-600"
                  >
                    Agregar
                  </button>
                </div>

                {languages.length > 0 && (
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-sm text-zinc-300">
                    {languages.join(" · ")}
                  </div>
                )}
              </div>
            )}

            {step.kind === "workMode" && (
              <div>
                <select
                  value={workMode}
                  onChange={(e) => setWorkMode(e.target.value)}
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-4 text-base outline-none transition focus:border-sky-400"
                >
                  <option value="">No especificar</option>
                  <option value="Remoto">Remoto</option>
                  <option value="Híbrido">Híbrido</option>
                  <option value="Presencial">Presencial</option>
                </select>
              </div>
            )}

            {step.kind === "relocation" && (
              <div>
                <select
                  value={relocation}
                  onChange={(e) => setRelocation(e.target.value)}
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-4 text-base outline-none transition focus:border-sky-400"
                >
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                  <option value="Depende">Depende</option>
                </select>
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

                <div className="flex items-center justify-between gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 px-3 py-2">
                  <button
                    type="button"
                    onClick={() =>
                      setPreviewZoom((z) => Math.max(0.35, Math.round((z - 0.05) * 100) / 100))
                    }
                    className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-200"
                  >
                    Zoom −
                  </button>

                  <div className="flex items-center gap-2">
                    <div className="text-xs text-zinc-400">
                      {Math.round(previewZoom * 100)}%
                    </div>
                    <button
                      type="button"
                      onClick={openPrintView}
                      className="rounded-xl bg-sky-400 px-3 py-2 text-xs font-semibold text-zinc-950 hover:bg-sky-300"
                    >
                      Descargar PDF
                    </button>
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

                <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs text-zinc-400">Perfil y tracking</div>
                    <button
                      type="button"
                      onClick={downloadProfileJson}
                      className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-zinc-200"
                    >
                      Descargar JSON
                    </button>
                  </div>

                  <div className="mt-3 grid gap-2">
                    <input
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs outline-none focus:border-sky-400"
                      placeholder="Empresa"
                      value={applicationDraft.company}
                      onChange={(e) => setApplicationDraft((prev) => ({ ...prev, company: e.target.value }))}
                    />
                    <input
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs outline-none focus:border-sky-400"
                      placeholder="Rol"
                      value={applicationDraft.role}
                      onChange={(e) => setApplicationDraft((prev) => ({ ...prev, role: e.target.value }))}
                    />
                    <input
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs outline-none focus:border-sky-400"
                      placeholder="URL de vacante (opcional)"
                      value={applicationDraft.url}
                      onChange={(e) => setApplicationDraft((prev) => ({ ...prev, url: e.target.value }))}
                    />
                    {applicationDraft.url.trim().length > 0 && !isProbablyUrl(applicationDraft.url) && (
                      <p className="text-xs text-rose-300">URL inválida.</p>
                    )}
                    <div className="flex items-center gap-2">
                      <select
                        value={applicationDraft.status}
                        onChange={(e) =>
                          setApplicationDraft((prev) => ({
                            ...prev,
                            status: e.target.value as ApplicationItem["status"],
                          }))
                        }
                        className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs outline-none focus:border-sky-400"
                      >
                        <option value="saved">Guardada</option>
                        <option value="applied">Aplicada</option>
                        <option value="interview">Entrevista</option>
                        <option value="rejected">Rechazada</option>
                      </select>
                      <button
                        type="button"
                        onClick={addApplication}
                        className="rounded-xl bg-sky-400 px-3 py-2 text-xs font-semibold text-zinc-950"
                      >
                        + Agregar
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 grid gap-2">
                    {applications.length === 0 ? (
                      <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-400">
                        Sin aplicaciones registradas todavía.
                      </div>
                    ) : (
                      applications.slice(0, 5).map((item) => (
                        <div key={item.id} className="flex items-center justify-between gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs">
                          <div className="min-w-0">
                            <div className="truncate text-zinc-200">{item.company} · {item.role}</div>
                            <div className="truncate text-zinc-500">{item.status}{item.url ? ` · ${item.url}` : ""}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeApplication(item.id)}
                            className="rounded-lg border border-zinc-700 px-2 py-1 text-zinc-300"
                          >
                            Quitar
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="overflow-auto rounded-3xl bg-zinc-100 p-3 ring-1 ring-zinc-200">
                  {/*
                    NOTE: CSS transform does not affect layout size.
                    On mobile this made the preview feel “too long / stretched” because the
                    scaled-down page still reserved the full (unscaled) A4 height.
                  */}
                  <div
                    className="mx-auto relative overflow-hidden"
                    style={{ width: A4_WIDTH * previewZoom, height: A4_HEIGHT * previewZoom }}
                  >
                    <div
                      className="origin-top-left absolute left-0 top-0"
                      style={{ transform: `scale(${previewZoom})`, width: A4_WIDTH, height: A4_HEIGHT }}
                    >
                      <RenderTemplate id={templateId} data={cvData} />
                    </div>
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
