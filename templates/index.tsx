import type { CvData } from "@/lib/cv";
import { TemplateClassic } from "./template-classic";
import { TemplateMinimal } from "./template-minimal";
import { TemplateCreative } from "./template-creative";
import { TemplateAts } from "./template-ats";

export type TemplateId = "classic" | "minimal" | "creative" | "ats";

export type TemplateMeta = {
  id: TemplateId;
  name: string;
  description: string;
};

export const templateRegistry: TemplateMeta[] = [
  {
    id: "classic",
    name: "Clásico",
    description: "Foto + sidebar + secciones tipo CV Canva (corporativo).",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Blanco, elegante, ultra legible (recruiter-friendly).",
  },
  {
    id: "creative",
    name: "Creativo",
    description: "Header con color + layout moderno tipo portfolio.",
  },
  {
    id: "ats",
    name: "ATS Pro",
    description: "Una columna, ultra claro, optimizado para ATS y recruiters.",
  },
];

export function RenderTemplate({
  id,
  data,
}: {
  id: TemplateId;
  data: CvData;
}) {
  if (id === "classic") return <TemplateClassic data={data} />;
  if (id === "minimal") return <TemplateMinimal data={data} />;
  if (id === "creative") return <TemplateCreative data={data} />;
  return <TemplateAts data={data} />;
}
