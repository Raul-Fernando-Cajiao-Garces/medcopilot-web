# MedCopilot Web 🩺

Aplicación cliente desarrollada con **React 18**, **TypeScript** estricto, **react-router** y **CSS Plano** (Vanilla CSS moderno con variables en `:root`). Cumple 100% con los lineamientos técnicos de la asignatura: sin librerías externas de componentes ni utilidades de estilos.

## Características
- **Arquitectura Limpia**: Separación estricta entre páginas, componentes y servicios.
- **Navegación Fluida**: 4 vistas principales (`/`, `/consultations/:id`, `/new-consultation`, `*` 404).
- **Diseño Responsivo**: Totalmente adaptado para pantallas móviles (375px) y de escritorio.
- **Integración con API**: Cliente Axios centralizado con manejo robusto de estados de carga y error.

## Scripts
- `npm run dev`: Inicia el servidor de desarrollo Vite en `http://localhost:5173`.
- `npm run build`: Compilación de producción con TypeScript y Vite (`tsc && vite build`).
