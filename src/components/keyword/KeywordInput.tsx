import { useEffect, useRef, useState } from 'react';
import { useKeywordStore } from '../../store/keywordStore';
import { TypingPlaceholder } from '../hero/TypingPlaceholder';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';
import { trackEvent } from '../../utils/analytics';
import { XIcon } from '@phosphor-icons/react/dist/csr/X';

export function KeywordInput() {
  const { rawInput, setRawInput, status, analyze } = useKeywordStore();
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isLoading = status === 'loading';

  const keywords = rawInput
    .split('\n')
    .map((k) => k.trim())
    .filter(Boolean);
  const count = keywords.length;
  const overLimit = count > 100;
  const showPlaceholder = !focused && rawInput.length === 0;

  const autoGrow = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const lineHeight = 24;
    const minRows = 4;
    const maxRows = 12;
    const rows = Math.min(Math.max(Math.ceil(el.scrollHeight / lineHeight), minRows), maxRows);
    el.style.height = `${rows * lineHeight}px`;
  };

  useEffect(() => {
    autoGrow();
  }, [rawInput]);

  const handlePaste = (e: import('react').ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text');
    const lines = pasted
      .split(/[\n,]/)
      .map((k) => k.trim())
      .filter(Boolean);
    const existing = rawInput.split('\n').filter(Boolean);
    const merged = Array.from(new Set([...existing, ...lines]));
    setRawInput(merged.join('\n'));
  };

  const handleSubmit = (e: import('react').FormEvent) => {
    e.preventDefault();
    if (overLimit || count === 0 || isLoading) return;
    trackEvent('keyword_analysis', { keyword_count: count });
    analyze(keywords);
  };

  return (
    <form
      onSubmit={handleSubmit}
      aria-busy={isLoading}
      className="bg-white rounded-xl border border-[var(--color-border)] shadow-sm overflow-hidden"
    >
      <div className="relative">
        <textarea
          ref={textareaRef}
          name="keywords"
          autoComplete="off"
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onPaste={handlePaste}
          disabled={isLoading}
          rows={4}
          className="w-full resize-none px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder-transparent focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-inset disabled:bg-gray-50"
          style={{ minHeight: 96, lineHeight: '24px' }}
        />
        <TypingPlaceholder active={showPlaceholder} />
        {rawInput.length > 0 && !isLoading && (
          <button
            type="button"
            onClick={() => setRawInput('')}
            aria-label="입력 초기화"
            className="absolute top-3 right-3 p-1 rounded text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-gray-100"
          >
            <XIcon size={16} aria-hidden="true" />
          </button>
        )}
      </div>
      <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--color-border)] bg-gray-50 gap-3">
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-medium ${
              overLimit ? 'text-red-600' : 'text-[var(--color-text-muted)]'
            }`}
          >
            {count} / 100
          </span>
          {overLimit && (
            <span className="text-xs text-red-600">최대 100개까지 입력 가능합니다.</span>
          )}
        </div>
        <Button type="submit" disabled={overLimit || count === 0 || isLoading}>
          {isLoading ? (
            <>
              <Spinner size={14} />
              분석 중…
            </>
          ) : (
            '분석하기'
          )}
        </Button>
      </div>
    </form>
  );
}
