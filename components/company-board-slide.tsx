"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";

// Card bounds include the full nameplate and white padding on a 900 × 506 PDF preview.
const threeCards = [[108, 305], [351, 548], [595, 792]];
const fourCards = [[35, 212], [253, 431], [471, 650], [689, 867]];
const slides: Record<number, {
  top: number;
  bottom: number;
  cards: number[][];
  portraits: boolean[];
}> = {
  3: {
    top: 167,
    bottom: 356,
    cards: [[35, 189], [204, 358], [373, 527], [541, 697], [710, 865]],
    portraits: [true, true, true, true, true],
  },
  4: { top: 141, bottom: 384, cards: threeCards, portraits: [true, true, true] },
  5: { top: 148, bottom: 372, cards: fourCards, portraits: [true, true, true, true] },
  6: { top: 137, bottom: 385, cards: threeCards, portraits: [false, true, true] },
  7: { top: 158, bottom: 384, cards: threeCards, portraits: [false, false, false] },
  8: { top: 144, bottom: 373, cards: fourCards, portraits: [true, true, false, true] },
  9: { top: 167, bottom: 372, cards: fourCards, portraits: [false, false, false, false] },
};

export default function CompanyBoardSlide({ page, src, alt, rtl }: {
  page: number;
  src: string;
  alt: string;
  rtl: boolean;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [seen, setSeen] = useState(false);
  const [active, setActive] = useState(0);
  const { top, bottom, cards, portraits } = slides[page];
  const height = bottom - top;
  const hasPortraits = portraits.some(Boolean);
  const orderedCards = cards.map(([left, right], index) => ({ left, right, portrait: portraits[index] }));
  if (rtl) orderedCards.reverse();

  function scrollStep(row: HTMLDivElement) {
    const [first, second] = row.children as HTMLCollectionOf<HTMLElement>;
    return second.getBoundingClientRect().left - first.getBoundingClientRect().left;
  }

  function goTo(index: number) {
    const row = rowRef.current;
    if (row) row.scrollTo({ left: index * scrollStep(row) });
  }

  useEffect(() => {
    const row = rowRef.current;
    if (!row || !loaded || !hasPortraits || seen) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.45) {
        setSeen(true);
        observer.disconnect();
      }
    }, { threshold: 0.45 });

    observer.observe(row);
    return () => observer.disconnect();
  }, [loaded, hasPortraits, seen]);

  return (
    <div className="company-board-slide">
      <h2 className="company-board-title">{alt}</h2>
      <Image
        className="company-group-slide company-board-original"
        src={src}
        width={1600}
        height={900}
        alt={alt}
        onLoad={() => setLoaded(true)}
        unoptimized
      />
      <div
        ref={rowRef}
        className="company-board-row"
        data-loaded={loaded}
        data-seen={seen}
        style={{
          "--company-board-top": `${top / 506 * 100}%`,
          "--company-board-height": `${height / 506 * 100}%`,
        } as CSSProperties}
        onScroll={(event) => {
          const row = event.currentTarget;
          const step = scrollStep(row);
          if (step) setActive(Math.max(0, Math.min(cards.length - 1, Math.round(row.scrollLeft / step))));
        }}
        aria-hidden="true"
      >
        {orderedCards.map(({ left, right, portrait }) => {
          const width = right - left;
          return (
            <div
              className="company-board-card"
              data-portrait={portrait}
              key={left}
              style={{
                "--company-board-left": `${left / 900 * 100}%`,
                "--company-board-width": `${width / 900 * 100}%`,
                "--company-board-ratio": `${width} / ${height}`,
                "--company-board-image": `url("${src}")`,
                backgroundSize: `${900 / width * 100}% ${506 / height * 100}%`,
                backgroundPosition: `${left / (900 - width) * 100}% ${top / (506 - height) * 100}%`,
              } as CSSProperties}
            />
          );
        })}
      </div>
      <div className="company-board-navigation">
        <button
          type="button"
          aria-label={rtl ? "مدیر قبلی" : "Previous leader"}
          disabled={active === 0}
          onClick={() => goTo(active - 1)}
        >
          {rtl ? <ChevronRight aria-hidden="true" size={20} /> : <ChevronLeft aria-hidden="true" size={20} />}
        </button>
        <span aria-live="polite">
          {(active + 1).toLocaleString(rtl ? "fa-IR" : "en")} / {cards.length.toLocaleString(rtl ? "fa-IR" : "en")}
        </span>
        <button
          type="button"
          aria-label={rtl ? "مدیر بعدی" : "Next leader"}
          disabled={active === cards.length - 1}
          onClick={() => goTo(active + 1)}
        >
          {rtl ? <ChevronLeft aria-hidden="true" size={20} /> : <ChevronRight aria-hidden="true" size={20} />}
        </button>
      </div>
    </div>
  );
}
