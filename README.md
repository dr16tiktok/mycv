# MyCV

Web app mobile‑first para crear un CV mediante un flujo de preguntas (wizard) y exportarlo a PDF.

## Stack
- Next.js (App Router)
- Tailwind CSS
- Framer Motion
- TypeScript

## Scripts
```bash
npm run dev
npm run build
npm run export
npm run start
```

## Deploy (GitHub Pages)
- La app se publica en: https://dr16tiktok.github.io/mycv/
- Workflow: `.github/workflows/gh-pages.yml`

## Convenciones
Ver `AGENTS.md` y `docs/SCREEN-FORMAT.md`.

## Estado MVP (Sprint 1)
- [x] Wizard mobile-first funcionando
- [x] Selección de template
- [x] Preview en vivo
- [x] Exportar a PDF (vista print)
- [x] Persistencia local del wizard (no pierde datos al recargar)
- [x] Validación base de campos (email/links)
- [ ] Guardar historial de CV por versión
- [x] Tracking inicial de aplicaciones (localStorage)

## Próximos pasos (prioridad)
1. Validaciones y mensajes de error UX-friendly.
2. Historial de versiones del CV en local.
3. Módulo de seguimiento de postulaciones.
4. Optimización ATS (palabras clave por rol).
