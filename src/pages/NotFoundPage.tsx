import type { FC } from 'react';
import { Link } from 'react-router';

export const NotFoundPage: FC = () => {
  return (
    <div
      className="not-found-page"
      style={{
        textAlign: 'center',
        padding: '4rem 1rem',
        maxWidth: '550px',
        margin: '0 auto',
      }}
      role="region"
      aria-label="Página de error 404"
    >
      <div className="card" style={{ padding: '2.5rem 1.5rem' }}>
        <p style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🔍</p>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
          404 — Página No Encontrada
        </h1>
        <p style={{ color: 'var(--color-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
          La ruta a la que intentas acceder no existe en el sistema clínico MedCopilot o ha sido reubicada.
        </p>
        <Link
          to="/consultations"
          className="btn btn-primary"
          aria-label="Regresar a la lista principal de consultas"
        >
          📋 Volver al Historial de Consultas
        </Link>
      </div>
    </div>
  );
};
