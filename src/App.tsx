import type { FC } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { Navbar } from './components/Navbar.js';
import { ConsultationListPage } from './pages/ConsultationListPage.js';
import { ConsultationDetailPage } from './pages/ConsultationDetailPage.js';
import { CreateConsultationPage } from './pages/CreateConsultationPage.js';
import { NotFoundPage } from './pages/NotFoundPage.js';

export const App: FC = () => {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />

        <main className="main-content" role="main">
          <Routes>
            {/* Redirección automática desde / hacia la lista principal */}
            <Route path="/" element={<Navigate to="/consultations" replace />} />

            {/* Rutas obligatorias de la aplicación */}
            <Route path="/consultations" element={<ConsultationListPage />} />
            <Route path="/consultations/new" element={<CreateConsultationPage />} />
            <Route path="/consultations/:id" element={<ConsultationDetailPage />} />

            {/* Ruta para páginas no encontradas (404) */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <footer className="footer" role="contentinfo">
          <p>
            MedCopilot — Sistema Asistente Clínico y Metabólico | UISRAEL Desarrollo de Software II
          </p>
        </footer>
      </div>
    </BrowserRouter>
  );
};
