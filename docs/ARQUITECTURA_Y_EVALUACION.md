# Manual de Arquitectura y Evaluación - MedCopilot Web

Este documento detalla la estructura técnica, componentes y flujo de datos de la interfaz de usuario desarrollada para el proyecto final de Desarrollo de Software II (UISRAEL).

## 1. Lineamientos Técnicos Cumplidos
- **React 18 + TypeScript estricto**: Cero uso de `any`, funciones flecha en todos los componentes.
- **Enrutamiento Estricto**: Todo el enrutamiento importado exclusivamente desde `'react-router'` (`BrowserRouter`, `Routes`, `Route`, `NavLink`, `useParams`, `useNavigate`). Prohibido `react-router-dom`.
- **CSS Plano (Vanilla CSS)**: Estilos centralizados en `src/index.css` con variables CSS en `:root`, diseño responsivo verificado a 375px de ancho.
- **Cliente HTTP Centralizado**: Conexión con `axios` a través de `src/services/apiClient.ts`, leyendo `VITE_API_BASE_URL` desde `.env.development`.

## 2. Mapa de Rutas
| Ruta | Componente | Descripción |
|---|---|---|
| `/` | `ConsultationListPage` | Lista de consultas con buscador en tiempo real y filtro por triaje |
| `/consultations/:id` | `ConsultationDetailPage` | Detalle clínico completo con alertas metabólicas y borrador SOAP |
| `/new-consultation` | `CreateConsultationPage` | Formulario de registro con selectores de paciente y médico |
| `*` | `NotFoundPage` | Página de error 404 personalizada con enlace de retorno |

## 3. Protocolo para la Sustentación Oral (10 min)
1. **Demostración de Navegación**: Recorrer las 4 rutas con la barra de direcciones visible.
2. **Creación de Registro**: Llenar una consulta desde `/new-consultation`, verificar validaciones y redirección.
3. **Inspección de Datos Relacionados**: En el detalle, demostrar la información del paciente (alergias) y del médico (especialidad).
4. **Historial de Git**: Mostrar los 10 Pull Requests aprobados y fusionados en GitHub.
