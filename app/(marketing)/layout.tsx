import type { Metadata } from "next";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { StickyCta } from "@/components/marketing/StickyCta";

export const metadata: Metadata = {
  title: {
    default: "ScratchCrest — Smarter visibility for scratch ticket retailers",
    template: "%s · ScratchCrest",
  },
  description:
    "Organize, present, and monitor scratch ticket inventory. A live board on any TV and a touch-screen smart POS — no hardware kit.",
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mkt paper-grain flex min-h-screen flex-col bg-paper text-ink">
      <MarketingNav />
      <main className="flex-1">{children}</main>
      <MarketingFooter />
      <StickyCta />
    </div>
  );
}
