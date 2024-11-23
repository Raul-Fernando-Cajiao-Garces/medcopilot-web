import type { FC } from 'react';
import type { TriagePriority } from '../types/consultation.js';

interface TriageBadgeProps {
  priority: TriagePriority;
}

export const TriageBadge: FC<TriageBadgeProps> = ({ priority }) => {
  const isUrgent = priority === 'URGENT';

  return (
    <span
      className={`badge ${isUrgent ? 'badge-urgent' : 'badge-normal'}`}
      aria-label={`Prioridad de triaje: ${isUrgent ? 'Urgente' : 'Normal'}`}
    >
      {isUrgent ? '🚨 URGENTE' : '🟢 NORMAL'}
    </span>
  );
};
