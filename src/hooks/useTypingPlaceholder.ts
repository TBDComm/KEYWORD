import { useEffect, useState } from 'react';

const KEYWORDS = [
  '컨텐츠박스그룹',
  '다이어트 보조제',
  '스마트스토어 위탁판매',
  '홈카페 원두',
  '블로그 상위노출',
  '제주 렌트카',
  '스킨케어 루틴',
  '무선 청소기 추천',
];

const TYPE_SPEED = 90;
const DELETE_SPEED = 45;
const PAUSE_AFTER_TYPE = 1800;
const GAP_AFTER_DELETE = 400;

export function useTypingPlaceholder(active: boolean) {
  const [text, setText] = useState('');

  useEffect(() => {
    if (!active) return;

    let index = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timerId: ReturnType<typeof setTimeout>;

    const tick = () => {
      const current = KEYWORDS[index % KEYWORDS.length];

      if (!isDeleting) {
        setText(current.slice(0, charIndex + 1));
        charIndex++;
        if (charIndex === current.length) {
          isDeleting = true;
          timerId = setTimeout(tick, PAUSE_AFTER_TYPE);
          return;
        }
        timerId = setTimeout(tick, TYPE_SPEED);
      } else {
        setText(current.slice(0, charIndex - 1));
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          index++;
          timerId = setTimeout(tick, GAP_AFTER_DELETE);
          return;
        }
        timerId = setTimeout(tick, DELETE_SPEED);
      }
    };

    timerId = setTimeout(tick, GAP_AFTER_DELETE);
    return () => clearTimeout(timerId);
  }, [active]);

  return text;
}
