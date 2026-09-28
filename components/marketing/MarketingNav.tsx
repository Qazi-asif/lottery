"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/marketing/Logo";
import { AnnouncementBar } from "@/components/marketing/AnnouncementBar";
import { MarketingNavLinks } from "@/components/marketing/MarketingNavLinks";

export function MarketingNav() {
  /**
   * The bar carries no rule or shadow while it is sitting in the hero — the
   * separation is only needed once content starts passing underneath it.
   */
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      <AnnouncementBar />
      <div
        className={`relative bg-black/90 backdrop-blur-md transition-shadow duration-200 ${
          scrolled
            ? "border-b border-[#f11112]/30 shadow-[0_6px_20px_-16px_rgb(0_0_0/0.8)]"
            : "border-b border-transparent"
        }`}
      >
        <div
          className={`mx-auto flex max-w-marketing items-center justify-between px-6 transition-all duration-200 ${
            scrolled ? "h-14" : "h-[4.5rem]"
          }`}
        >
          <Logo />
          <MarketingNavLinks />
        </div>
      </div>
    </header>
  );
}
