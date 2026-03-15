import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { TypingPlaceholder } from './TypingPlaceholder';

export function SearchForm() {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();

  const showPlaceholder = !focused && value.length === 0;

  const handleSubmit = (e: import('react').FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    navigate('/keyword', { state: { query: value } });
  };

  const handlePaste = (e: import('react').ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text');
    const lines = pasted
      .split(/[\n,]/)
      .map((k) => k.trim())
      .filter(Boolean);
    const merged = Array.from(new Set([...value.split('\n').filter(Boolean), ...lines]));
    setValue(merged.join('\n'));
  };

  return (
    <form onSubmit={handleSubmit} aria-busy={false} className="w-full max-w-2xl mx-auto">
      <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="relative">
          <textarea
            name="keywords"
            autoComplete="off"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onPaste={handlePaste}
            rows={3}
            className="w-full resize-none px-4 py-3.5 text-sm text-[var(--color-text-primary)] placeholder-transparent focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-inset"
            style={{ minHeight: 56 }}
          />
          <TypingPlaceholder active={showPlaceholder} />
        </div>
        <div className="flex items-center justify-between px-4 pb-3 gap-3">
          <span className="text-xs text-[var(--color-text-muted)]">
            {value.split('\n').filter(Boolean).length} / 100
          </span>
          <Button type="submit" disabled={!value.trim()}>
            분석하기
          </Button>
        </div>
      </div>
    </form>
  );
}
