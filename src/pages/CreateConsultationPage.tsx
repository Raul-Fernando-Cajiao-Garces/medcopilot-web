import type { FC, FormEvent } from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import type { Doctor } from '../types/doctor.js';
import type { Patient } from '../types/patient.js';
import { getAllDoctors } from '../services/doctorService.js';
import { getAllPatients } from '../services/patientService.js';
import { createConsultation } from '../services/consultationService.js';
import { LoadingSpinner } from '../components/LoadingSpinner.js';
import { ErrorMessage } from '../components/ErrorMessage.js';

export const CreateConsultationPage: FC = () => {
  const navigate = useNavigate();

  // Listas de entidades relacionadas para los campos de selección
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loadingInitial, setLoadingInitial] = useState<boolean>(true);

  // Estados controlados del formulario
  const [patientId, setPatientId] = useState<string>('');
  const [doctorId, setDoctorId] = useState<string>('');
  const [symptoms, setSymptoms] = useState<string>('');
  const [temperature, setTemperature] = useState<string>('36.5');
  const [painLevel, setPainLevel] = useState<string>('3');
  const [proposedIndications, setProposedIndications] = useState<string>('');

  // Estados de envío y error
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Cargar pacientes y médicos al montar el componente
  useEffect(() => {
    const loadSelectData = async (): Promise<void> => {
      try {
        setLoadingInitial(true);
        const [docsData, patsData] = await Promise.all([
          getAllDoctors(),
          getAllPatients(),
        ]);
        setDoctors(docsData);
        setPatients(patsData);

        if (docsData[0]) {
          setDoctorId(docsData[0].id.toString());
        }
        if (patsData[0]) {
          setPatientId(patsData[0].id.toString());
        }
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : 'Error al cargar los catálogos médicos de la API.';
        setApiError(msg);
      } finally {
        setLoadingInitial(false);
      }
    };

    void loadSelectData();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setApiError(null);

    // Validación básica previa
    if (!patientId || Number(patientId) <= 0) {
      setApiError('Por favor selecciona un paciente válido.');
      return;
    }

    if (!doctorId || Number(doctorId) <= 0) {
      setApiError('Por favor selecciona un médico válido.');
      return;
    }

    if (!symptoms.trim() || symptoms.trim().length < 5) {
      setApiError('Los síntomas deben tener al menos 5 caracteres.');
      return;
    }

    const tempNum = Number(temperature);
    if (Number.isNaN(tempNum) || tempNum < 34 || tempNum > 43) {
      setApiError('La temperatura corporal debe situarse entre 34.0°C y 43.0°C.');
      return;
    }

    const painNum = Number(painLevel);
    if (Number.isNaN(painNum) || painNum < 0 || painNum > 10) {
      setApiError('La escala de dolor EVA debe ser un valor de 0 a 10.');
      return;
    }

    try {
      setSubmitting(true);
      const newConsultation = await createConsultation({
        patientId: Number(patientId),
        doctorId: Number(doctorId),
        symptoms: symptoms.trim(),
        temperature: tempNum,
        painLevel: painNum,
        proposedIndications: proposedIndications.trim(),
      });

      // Navegación por código con useNavigate al detalle del nuevo registro
      void navigate(`/consultations/${newConsultation.id}`);
    } catch (err: unknown) {
      // Capturar y mostrar mensaje en español devuelto por la API
      const errorObj = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const responseMessage =
        errorObj.response?.data?.message ??
        errorObj.message ??
        'Error al registrar la consulta médica.';
      setApiError(responseMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingInitial) {
    return <LoadingSpinner message="Cargando pacientes y médicos disponibles..." />;
  }

  // Obtener información del paciente seleccionado para mostrar advertencia previa
  const selectedPatient = patients.find((p) => p.id === Number(patientId));

  return (
    <div className="create-consultation-page" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <div style={{ marginBottom: '0.5rem' }}>
            <Link to="/consultations" className="btn btn-secondary" aria-label="Volver a la lista">
              ⬅️ Volver
            </Link>
          </div>
          <h1 className="page-title">Registrar Nueva Consulta Médica</h1>
          <p className="page-subtitle">
            Ingreso de signos vitales, sintomatología, auditoría metabólica y generación RAG
          </p>
        </div>
      </div>

      {apiError && <ErrorMessage message={apiError} />}

      <form onSubmit={(e) => void handleSubmit(e)} className="card" noValidate>
        {/* Selección de Paciente (Relación desde la API) */}
        <div className="form-group">
          <label htmlFor="patient-select" className="form-label">
            👤 Paciente (*):
          </label>
          <select
            id="patient-select"
            className="form-control"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            required
            aria-label="Seleccionar paciente para la consulta"
          >
            {patients.map((pat) => (
              <option key={pat.id} value={pat.id}>
                {pat.fullName} (Doc: {pat.documentId})
              </option>
            ))}
          </select>
        </div>

        {/* Antecedentes clínicos del paciente seleccionado */}
        {selectedPatient && (
          <div
            className="alert alert-info"
            style={{ fontSize: '0.86rem', padding: '0.65rem 0.95rem' }}
          >
            <div>
              <p>
                <strong>Perfil metabólico registrado:</strong>{' '}
                {selectedPatient.metabolicProfile}
              </p>
              <p style={{ marginTop: '0.2rem' }}>
                <strong>Alergias documentadas:</strong>{' '}
                <span
                  style={{
                    color:
                      selectedPatient.allergies !== 'Ninguna'
                        ? 'var(--color-danger)'
                        : 'inherit',
                  }}
                >
                  {selectedPatient.allergies}
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Selección de Médico (Relación desde la API) */}
        <div className="form-group">
          <label htmlFor="doctor-select" className="form-label">
            🩺 Médico Evaluador (*):
          </label>
          <select
            id="doctor-select"
            className="form-control"
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
            required
            aria-label="Seleccionar médico evaluador"
          >
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.fullName} — {doc.specialty}
              </option>
            ))}
          </select>
        </div>

        {/* Síntomas y Motivo de Consulta */}
        <div className="form-group">
          <label htmlFor="symptoms-input" className="form-label">
            📋 Motivo de Consulta y Síntomas (*):
          </label>
          <textarea
            id="symptoms-input"
            className="form-control"
            rows={4}
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Describe en detalle los síntomas, tiempo de evolución y motivo de consulta..."
            required
            aria-label="Síntomas y motivo de consulta"
          />
        </div>

        {/* Signos Vitales: Temperatura y Nivel de Dolor */}
        <div className="clinical-grid">
          <div className="form-group">
            <label htmlFor="temperature-input" className="form-label">
              🌡️ Temperatura Corporal (°C) (*):
            </label>
            <input
              id="temperature-input"
              type="number"
              step="0.1"
              min="34.0"
              max="43.0"
              className="form-control"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              required
              aria-label="Temperatura corporal en grados Celsius"
            />
          </div>

          <div className="form-group">
            <label htmlFor="pain-input" className="form-label">
              ⚡ Escala EVA de Dolor (0 a 10) (*):
            </label>
            <input
              id="pain-input"
              type="number"
              min="0"
              max="10"
              className="form-control"
              value={painLevel}
              onChange={(e) => setPainLevel(e.target.value)}
              required
              aria-label="Escala de dolor de 0 a 10"
            />
          </div>
        </div>

        {/* Indicaciones Médicas Propuestas */}
        <div className="form-group">
          <label htmlFor="indications-input" className="form-label">
            💊 Indicaciones y Fármacos Propuestos (Opcional):
          </label>
          <textarea
            id="indications-input"
            className="form-control"
            rows={3}
            value={proposedIndications}
            onChange={(e) => setProposedIndications(e.target.value)}
            placeholder="Ej. Paracetamol 500mg, dieta líquida, suero oral..."
            aria-label="Indicaciones médicas y medicamentos propuestos"
          />
        </div>

        {/* Botón de Envío Deshabilitado Durante la Petición */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
          <Link to="/consultations" className="btn btn-secondary" aria-label="Cancelar y volver">
            Cancelar
          </Link>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
            aria-label="Enviar formulario y crear consulta médica"
          >
            {submitting ? 'Procesando RAG Clínico...' : '💾 Guardar y Generar SOAP'}
          </button>
        </div>
      </form>
    </div>
  );
};
