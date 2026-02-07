# AGENTS.md — Proyecto MyCV

Este repo es para construir un producto web mobile‑first que guía al usuario a crear su CV mediante un flujo tipo wizard (1 pregunta por pantalla).

## Principios de UX/UI (no romper)
- **Una pregunta por pantalla**.
- Botones fijos abajo: **Siguiente** y **Saltar**.
- Tipografía grande, foco mobile.
- Espaciado consistente (margen 16–24px).
- Misma estructura de pantalla en todo el flujo.
- Preview siempre responde a los datos ingresados.

## Estructura de pantallas (base)
1. Bienvenida
2. Datos básicos (nombre, rol, ciudad, email)
3. Redes sociales (toggle/checkbox -> pantallas individuales)
4. Resumen profesional
5. Experiencia (bloques repetibles)
6. Educación
7. Habilidades
8. Proyectos
9. Template
10. Exportar

## Convenciones
- Componentes en `/components`.
- Wizard en `/app/wizard`.
- Datos en `/lib/schema`.
- Templates en `/templates`.

## Estilo visual
- Look “app‑like”, limpio, premium.
- Colores: neutros + acento suave.
- Animaciones sutiles (Framer Motion).
