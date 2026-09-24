import type { Metadata } from "next";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { StickyCta } from "@/components/marketing/StickyCta";

export const metadata: Metadata = {
  title: {
    default: "ScratchCrest — Sell more scratch tickets",
    template: "%s · ScratchCrest",
  },
  description:
    "Turn any TV into a live scratch-game display, scan to sell in one second, and see your commission the moment it's earned. No hardware kit.",
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // `paper-grain` puts the tooth of uncoated stock under the whole site. It is
    // a background-image, so it composes with bg-paper rather than overlaying.
    <div className="paper-grain flex min-h-screen flex-col bg-paper text-ink">
      <MarketingNav />
      <main className="flex-1">{children}</main>
      <MarketingFooter />
      <StickyCta />
    </div>
  );
}
