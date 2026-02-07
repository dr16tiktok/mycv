"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
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

type StepId = (typeof steps)[number]["id"];

export default function Home() {
  const [index, setIndex] = useState(0);
  const [form, setForm] = useState<Record<StepId, string>>({
    fullName: "",
    role: "",
    city: "",
    email: "",
  });

  const step = steps[index];
  const total = steps.length;

  const canNext = useMemo(() => {
    if (!step) return false;
    if (!step.required) return true;
    return form[step.id].trim().length > 0;
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
              <p className="mt-2 text-sm text-zinc-400">{step.subtitle}</p>
            </div>

            <div>
              <input
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-4 text-base outline-none transition focus:border-sky-400"
                placeholder={step.placeholder}
                value={form[step.id]}
                onChange={(e) =>
                  setForm({ ...form, [step.id]: e.target.value })
                }
              />
            </div>

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
