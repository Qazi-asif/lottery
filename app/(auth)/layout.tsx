import { Logo } from "@/components/marketing/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-marketing items-center px-6 py-5">
          <Logo />
        </div>
      </header>
      <main className="mx-auto max-w-lg px-6 py-16">{children}</main>
    </div>
  );
}
