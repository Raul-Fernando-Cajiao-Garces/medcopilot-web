import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import type { Consultation } from '../types/consultation.js';
import {
  getConsultationById,
  updateConsultation,
  deleteConsultation,
} from '../services/consultationService.js';
import { TriageBadge } from '../components/TriageBadge.js';
import { LoadingSpinner } from '../components/LoadingSpinner.js';
import { ErrorMessage } from '../components/ErrorMessage.js';

export const ConsultationDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Estados de edición del médico
  const [doctorNotes, setDoctorNotes] = useState<string>('');
  const [updating, setUpdating] = useState<boolean>(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchConsultation = async (): Promise<void> => {
    if (!id) {
      setError('Identificador de consulta no proporcionado.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getConsultationById(Number(id));
      setConsultation(data);
      setDoctorNotes(data.doctorNotes);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'No se pudo cargar la consulta clínica.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchConsultation();
  }, [id]);

  // Actualizar notas y firmar consulta médica
  const handleSignConsultation = async (): Promise<void> => {
    if (!consultation) return;

    try {
      setUpdating(true);
      setActionMessage(null);
      const updated = await updateConsultation(consultation.id, {
        doctorNotes,
        validatedByDoctor: true,
      });
      setConsultation(updated);
      setActionMessage('✓ Consulta validada y firmada exitosamente por el médico tratante.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar la firma médica.';
      setError(msg);
    } finally {
      setUpdating(false);
    }
  };

  // Eliminar consulta médica
  const handleDeleteConsultation = async (): Promise<void> => {
    if (!consultation) return;

    const confirmed = window.confirm(
      `¿Confirmas la eliminación definitiva de la consulta #${consultation.id} de ${consultation.patientName}?`
    );
    if (!confirmed) return;

    try {
      setUpdating(true);
      await deleteConsultation(consultation.id);
      void navigate('/consultations');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al eliminar la consulta médica.';
      setError(msg);
      setUpdating(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Recuperando expediente clínico y análisis RAG..." />;
  }

  if (error || !consultation) {
    return (
      <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
        <ErrorMessage message={error || 'No se encontró la consulta médica.'} />
        <Link to="/consultations" className="btn btn-secondary">
          ⬅️ Volver al Historial de Consultas
        </Link>
      </div>
    );
  }

  return (
    <div className="consultation-detail-page">
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Link to="/consultations" className="btn btn-secondary" aria-label="Volver a la lista de consultas">
              ⬅️ Volver
            </Link>
            <TriageBadge priority={consultation.triagePriority} />
            {consultation.validatedByDoctor ? (
              <span className="badge badge-signed">✓ Validado por Médico</span>
            ) : (
              <span className="badge badge-pending">Firma Pendiente</span>
            )}
          </div>
          <h1 className="page-title">
            Consulta Médica #{consultation.id} — {consultation.patientName}
          </h1>
          <p className="page-subtitle">
            Atendido por: {consultation.doctorName} ({consultation.doctorSpecialty})
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => void handleDeleteConsultation()}
            disabled={updating}
            aria-label="Eliminar esta consulta médica"
          >
            🗑️ Eliminar Consulta
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="alert alert-success" role="status">
          {actionMessage}
        </div>
      )}

      {/* Grid de Datos del Paciente y Médico (Relación Visible Requerida por Rúbrica) */}
      <div className="clinical-grid" style={{ marginBottom: '1.25rem' }}>
        <div className="card">
          <h2 className="clinical-section-title">👤 Datos del Paciente (Entidad Relacionada)</h2>
          <p style={{ marginBottom: '0.4rem' }}>
            <strong>Nombre Completo:</strong> {consultation.patientName}
          </p>
          <p style={{ marginBottom: '0.4rem' }}>
            <strong>Alergias Documentadas:</strong>{' '}
            <span style={{ color: consultation.patientAllergies !== 'Ninguna' ? 'var(--color-danger)' : 'inherit' }}>
              {consultation.patientAllergies || 'Ninguna'}
            </span>
          </p>
          <p>
            <strong>Perfil Metabólico / Antecedentes:</strong>{' '}
            {consultation.patientMetabolicProfile || 'Sin antecedentes metabólicos'}
          </p>
        </div>

        <div className="card">
          <h2 className="clinical-section-title">🩺 Médico Tratante (Entidad Relacionada)</h2>
          <p style={{ marginBottom: '0.4rem' }}>
            <strong>Profesional:</strong> {consultation.doctorName}
          </p>
          <p style={{ marginBottom: '0.4rem' }}>
            <strong>Especialidad Médica:</strong> {consultation.doctorSpecialty}
          </p>
          <p>
            <strong>Fecha de Atención:</strong> {new Date(consultation.createdAt).toLocaleString('es-EC')}
          </p>
        </div>
      </div>

      {/* Signos Vitales y Triaje */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <h2 className="clinical-section-title">📊 Exploración Física y Triaje</h2>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          <p>🌡️ Temperatura: <strong>{consultation.temperature}°C</strong></p>
          <p>⚡ Escala EVA de Dolor: <strong>{consultation.painLevel}/10</strong></p>
          <p>⏱️ Tiempo de evolución: <strong>{consultation.dias ?? 1} días</strong></p>
          <p>🚨 Clasificación de Triaje: <strong>{consultation.triagePriority}</strong></p>
        </div>
        <p style={{ fontSize: '0.95rem' }}>
          <strong>Motivo de Consulta y Síntomas Reportados:</strong> {consultation.symptoms}
        </p>
      </div>

      {/* Auditoría Metabólica y Farmacológica */}
      <div className="card" style={{ marginBottom: '1.25rem', borderLeft: '4px solid var(--color-warning)' }}>
        <h2 className="clinical-section-title" style={{ color: '#b45309' }}>
          ⚠️ Auditoría Metabólica y Farmacológica
        </h2>
        <div style={{ whiteSpace: 'pre-wrap', fontSize: '0.92rem', color: '#78350f' }}>
          {consultation.metabolicAlerts}
        </div>
      </div>

      {/* Contexto Bibliográfico RAG */}
      {consultation.ragContext && (
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <h2 className="clinical-section-title">📚 Evidencia Bibliográfica Recuperada (RAG)</h2>
          <div className="rag-box">{consultation.ragContext}</div>
        </div>
      )}

      {/* Borrador SOAP Estructurado */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <h2 className="clinical-section-title">📝 Borrador Clínico SOAP (Subjetivo, Objetivo, Análisis, Plan)</h2>
        <div className="soap-box">{consultation.soapDraft}</div>
      </div>

      {/* Validación y Firma del Médico */}
      <div className="card">
        <h2 className="clinical-section-title">✍️ Validación y Observaciones del Profesional</h2>
        <div className="form-group">
          <label htmlFor="doctor-notes" className="form-label">
            Notas Clínicas Adicionales del Médico:
          </label>
          <textarea
            id="doctor-notes"
            className="form-control"
            rows={4}
            value={doctorNotes}
            onChange={(e) => setDoctorNotes(e.target.value)}
            placeholder="Escribe aquí las observaciones finales, evolución o ajustes terapéuticos..."
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => void handleSignConsultation()}
            disabled={updating}
            aria-label="Firmar y validar esta consulta médica"
          >
            {updating ? 'Validando...' : '✓ Firmar y Validar Consulta'}
          </button>
        </div>
      </div>
    </div>
  );
};
