import type { FC } from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: FC<LoadingSpinnerProps> = ({
  message = 'Cargando información médica...',
}) => {
  return (
    <div
      className="spinner-container"
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="spinner" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
};
