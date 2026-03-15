import { useTypingPlaceholder } from '../../hooks/useTypingPlaceholder';

interface TypingPlaceholderProps {
  active: boolean;
}

export function TypingPlaceholder({ active }: TypingPlaceholderProps) {
  const text = useTypingPlaceholder(active);

  if (!active) return null;

  return (
    <span
      className="absolute inset-0 flex items-center px-4 text-[var(--color-text-muted)] pointer-events-none select-none text-sm"
      aria-hidden="true"
    >
      {text}
      <span className="ml-px w-px h-4 bg-[var(--color-text-muted)] animate-pulse" />
    </span>
  );
}
