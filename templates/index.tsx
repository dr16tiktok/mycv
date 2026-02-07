import type { CvData } from "@/lib/cv";
import { TemplateClassic } from "./template-classic";
import { TemplateMinimal } from "./template-minimal";
import { TemplateCreative } from "./template-creative";

export type TemplateId = "classic" | "minimal" | "creative";

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
  return <TemplateCreative data={data} />;
}
