import type { FC } from 'react';
import { NavLink } from 'react-router';

export const Navbar: FC = () => {
  return (
    <header className="navbar" role="banner">
      <div className="navbar-container">
        <NavLink to="/consultations" className="navbar-brand" aria-label="Ir a inicio MedCopilot">
          <span>🩺 MedCopilot</span>
          <span className="brand-badge">RAG Clínico</span>
        </NavLink>

        <nav className="navbar-nav" aria-label="Navegación principal">
          <NavLink
            to="/consultations"
            end
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            aria-label="Ver lista de consultas médicas"
          >
            📋 Consultas
          </NavLink>
          <NavLink
            to="/consultations/new"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            aria-label="Crear nueva consulta clínica"
          >
            ➕ Nueva Consulta
          </NavLink>
        </nav>
      </div>
    </header>
  );
};
