import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import type { Consultation } from '../types/consultation.js';
import { getAllConsultations } from '../services/consultationService.js';
import { TriageBadge } from '../components/TriageBadge.js';
import { LoadingSpinner } from '../components/LoadingSpinner.js';
import { ErrorMessage } from '../components/ErrorMessage.js';

export const ConsultationListPage: FC = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Estados controlados para búsqueda y filtro
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');

  const fetchConsultations = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllConsultations();
      setConsultations(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al cargar el historial de consultas.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchConsultations();
  }, []);

  // Lógica pura de filtrado y búsqueda
  const filteredConsultations = consultations.filter((c) => {
    const matchesPriority =
      priorityFilter === 'ALL' || c.triagePriority === priorityFilter;

    const term = searchTerm.toLowerCase().trim();
    if (!term) {
      return matchesPriority;
    }

    const matchesSearch =
      (c.patientName?.toLowerCase().includes(term) ?? false) ||
      (c.doctorName?.toLowerCase().includes(term) ?? false) ||
      c.symptoms.toLowerCase().includes(term) ||
      c.triagePriority.toLowerCase().includes(term);

    return matchesPriority && matchesSearch;
  });

  return (
    <div className="consultations-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Historial Clínico de Consultas</h1>
          <p className="page-subtitle">
            Monitoreo en tiempo real, auditoría metabólica y triaje con RAG asistido
          </p>
        </div>
        <Link
          to="/consultations/new"
          className="btn btn-primary"
          aria-label="Registrar una nueva consulta médica"
        >
          ➕ Registrar Consulta
        </Link>
      </div>

      {/* Barra de Filtro y Buscador con Contador Obligatorio */}
      <section className="card" aria-label="Filtros y búsqueda de consultas">
        <div className="filter-bar">
          <div className="search-input-wrapper">
            <label htmlFor="search-input" className="form-label">
              🔍 Buscar por paciente, médico o síntomas
            </label>
            <input
              id="search-input"
              type="text"
              className="form-control"
              placeholder="Ej. Juan Pérez, dolor torácico, esteatosis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Buscar consultas por paciente, médico o síntomas"
            />
          </div>

          <div style={{ minWidth: '180px' }}>
            <label htmlFor="priority-select" className="form-label">
              Prioridad de Triaje
            </label>
            <select
              id="priority-select"
              className="form-control"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              aria-label="Filtrar por prioridad de triaje"
            >
              <option value="ALL">Todas las prioridades</option>
              <option value="URGENT">Solo Urgentes (URGENT)</option>
              <option value="NORMAL">Solo Normales (NORMAL)</option>
            </select>
          </div>
        </div>

        {/* Contador de resultados */}
        <div className="counter-badge" role="status" aria-live="polite">
          Mostrando <strong>{filteredConsultations.length}</strong> de{' '}
          <strong>{consultations.length}</strong> consultas médicas registradas
        </div>
      </section>

      {/* Manejo de estados: Carga, Error y Datos */}
      {loading && <LoadingSpinner message="Consultando base clínica PostgreSQL..." />}

      {error && <ErrorMessage message={error} onRetry={() => void fetchConsultations()} />}

      {!loading && !error && filteredConsultations.length === 0 && (
        <div className="empty-state" role="status">
          <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>No se encontraron consultas médicas</p>
          <p style={{ marginTop: '0.35rem' }}>
            {searchTerm || priorityFilter !== 'ALL'
              ? 'Intenta modificando los términos del buscador o los filtros de prioridad.'
              : 'Aún no hay registros en la base de datos. Haz clic en "Registrar Consulta" para comenzar.'}
          </p>
        </div>
      )}

      {!loading && !error && filteredConsultations.length > 0 && (
        <div className="consultations-list" role="feed" aria-label="Lista de consultas médicas">
          {filteredConsultations.map((consultation) => (
            <article key={consultation.id} className="card" style={{ marginBottom: '1rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  marginBottom: '0.75rem',
                }}
              >
                <div>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-text)' }}>
                    Consulta #{consultation.id} — {consultation.patientName ?? 'Paciente no asignado'}
                  </h2>
                  <p style={{ fontSize: '0.88rem', color: 'var(--color-muted)' }}>
                    Atendido por: {consultation.doctorName ?? 'Médico no asignado'} (
                    {consultation.doctorSpecialty ?? 'Medicina General'})
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <TriageBadge priority={consultation.triagePriority} />
                  {consultation.validatedByDoctor ? (
                    <span className="badge badge-signed">✓ Firmado</span>
                  ) : (
                    <span className="badge badge-pending">Pendiente Firma</span>
                  )}
                </div>
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <p style={{ fontSize: '0.92rem', color: '#334155' }}>
                  <strong>Motivo de consulta / Síntomas: </strong>
                  {consultation.symptoms}
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '1.25rem',
                  fontSize: '0.85rem',
                  color: 'var(--color-muted)',
                  marginBottom: '1rem',
                  flexWrap: 'wrap',
                }}
              >
                <span>🌡️ Temp: <strong>{consultation.temperature}°C</strong></span>
                <span>⚡ Dolor EVA: <strong>{consultation.painLevel}/10</strong></span>
                <span>📅 Fecha: <strong>{new Date(consultation.createdAt).toLocaleDateString('es-EC')}</strong></span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Link
                  to={`/consultations/${consultation.id}`}
                  className="btn btn-secondary"
                  aria-label={`Ver detalle clínico completo de la consulta ${consultation.id}`}
                >
                  👁️ Ver Detalle y SOAP
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
