"use client";

import Image from "next/image";
import { boardMembers, boardRoles } from "@/data/company-board";
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
  const gridRef = useRef<HTMLUListElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [seen, setSeen] = useState(false);
  const { top, bottom, cards, portraits } = slides[page];
  const height = bottom - top;
  const hasPortraits = portraits.some(Boolean);
  const members = boardMembers[page].map(([fa, en, role], index) => ({
    name: rtl ? fa : en,
    role: boardRoles[role][rtl ? "fa" : "en"],
    index,
    portrait: portraits[index],
  }));
  if (rtl) members.reverse();

  useEffect(() => {
    const row = rowRef.current;
    const grid = gridRef.current;
    if (!row || !grid || !hasPortraits || seen) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.45)) {
        setSeen(true);
        observer.disconnect();
      }
    }, { threshold: 0.45 });

    if (loaded) observer.observe(row);
    observer.observe(grid);
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
                "--company-board-left": `${left / 900 * 100}%`,
                "--company-board-width": `${width / 900 * 100}%`,
                "--company-board-image": `url("${src}")`,
                backgroundSize: `${900 / width * 100}% ${506 / height * 100}%`,
                backgroundPosition: `${left / (900 - width) * 100}% ${top / (506 - height) * 100}%`,
              } as CSSProperties}
            />
          );
        })}
      </div>
      <ul className="company-board-grid" data-seen={seen} ref={gridRef} role="list">
        {members.map(({ name, role, index, portrait }) => {
          const words = name.split(" ");
          const initials = words[0][0] + (words.length > 1 ? words[words.length - 1][0] : "");
          return (
            <li key={index}>
              <div className="company-board-portrait" data-portrait={portrait} aria-hidden="true">
                {portrait ? (
                  <Image
                    src={`${src.slice(0, src.lastIndexOf("/"))}/portraits/${page}-${index + 1}.webp`}
                    fill
                    sizes="(max-width: 599px) 50vw, 1px"
                    alt=""
                    unoptimized
                  />
                ) : <span>{initials}</span>}
              </div>
              <h3>{name}</h3>
              <p>{role}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
