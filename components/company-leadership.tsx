"use client";

import { useEffect, useRef, type ReactNode } from "react";

export default function CompanyLeadership({ children }: { children: ReactNode }) {
  const leadershipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const leadership = leadershipRef.current;
    if (!leadership) return;

    const observer = new IntersectionObserver((entries) => {
      for (const { target, isIntersecting } of entries) {
        if (!isIntersecting) continue;
        target.setAttribute("data-seen", "");
        observer.unobserve(target);
      }
    }, { threshold: 0.45 });

    leadership.querySelectorAll('[data-portrait="true"]').forEach((portrait) => observer.observe(portrait));
    return () => observer.disconnect();
  }, []);

  return <div className="company-profile-leadership" ref={leadershipRef}>{children}</div>;
}
