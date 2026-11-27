"use client";

import Image from "next/image";
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

export default function CompanyBoardSlide({ page, src, alt }: {
  page: number;
  src: string;
  alt: string;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [seen, setSeen] = useState(false);
  const { top, bottom, cards, portraits } = slides[page];
  const height = bottom - top;
  const hasPortraits = portraits.some(Boolean);

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
      <Image
        className="company-group-slide"
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
        style={{ top: `${top / 506 * 100}%`, height: `${height / 506 * 100}%` }}
        aria-hidden="true"
      >
        {cards.map(([left, right], index) => {
          const width = right - left;
          return (
            <div
              className="company-board-card"
              data-portrait={portraits[index]}
              key={left}
              style={{
                left: `${left / 900 * 100}%`,
                width: `${width / 900 * 100}%`,
                "--company-board-image": `url("${src}")`,
                backgroundSize: `${900 / width * 100}% ${506 / height * 100}%`,
                backgroundPosition: `${left / (900 - width) * 100}% ${top / (506 - height) * 100}%`,
              } as CSSProperties}
            />
          );
        })}
      </div>
    </div>
  );
}
