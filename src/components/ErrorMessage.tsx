import type { FC } from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="alert alert-danger" role="alert" aria-live="assertive">
      <div>
        <p>
          <strong>⚠️ Error Clínico: </strong>
          {message}
        </p>
        {onRetry && (
          <button
            type="button"
            className="btn btn-secondary"
            style={{ marginTop: '0.5rem', padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
            onClick={onRetry}
            aria-label="Reintentar operación médica"
          >
            🔄 Reintentar
          </button>
        )}
      </div>
    </div>
  );
};
