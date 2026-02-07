# Templates

Objetivo: ofrecer **diseños visuales de CV** (no placeholders) que el usuario pueda elegir.

## Dónde viven
- `templates/` contiene los templates reales:
  - `template-classic.tsx`
  - `template-minimal.tsx`
  - `template-creative.tsx`
- `templates/index.tsx` expone:
  - `templateRegistry` (metadata: id, nombre, descripción)
  - `RenderTemplate` (render por id)

## Contrato de datos (schema)
- Fuente: `lib/cv.ts`
- Tipo principal: `CvData`

Regla: **los templates NO deben inventar datos**, solo renderizar lo que reciben.

## Cómo agregar un template nuevo
1) Crear archivo en `templates/template-<id>.tsx`
2) Exportar el componente
3) Agregar el `id` al tipo `TemplateId` en `templates/index.tsx`
4) Agregar metadata en `templateRegistry`
5) Extender `RenderTemplate` para que renderice el nuevo template

## Guidelines visuales
- Mantener apariencia de CV (jerarquía, secciones, legibilidad).
- Evitar layouts rotos en mobile: los previews se muestran escalados.
- Preferir tokens/colores consistentes (zinc + acento sky por ahora).

## Roadmap
- Thumbnails estáticos (SVG/PNG) por template.
- Export a PDF (print CSS / server-side render).
- Schema más estructurado (experiencias con campos + bullets).
