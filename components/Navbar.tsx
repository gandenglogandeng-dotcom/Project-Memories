"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Images, MessagesSquare, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/#galeri", label: "Galeri", icon: Images },
  { href: "/#cerita", label: "Cerita", icon: MessagesSquare },
  { href: "/admin", label: "Unggah", icon: UploadCloud },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* ── Top bar: tampil di layar md ke atas ─────────────────────────── */}
      <header
        className={cn(
          "sticky top-0 z-40 hidden w-full transition-all duration-300 ease-soft md:block",
          scrolled ? "border-b border-ink/10 bg-paper/85 backdrop-blur-md" : "border-b border-transparent bg-transparent"
        )}
      >
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Logo" className="h-8 w-8 rounded-full object-cover" />
            <span className="font-display text-lg font-semibold tracking-tight text-ink">
              Project Memories Gandeng Logandeng
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-pill px-4 py-2 text-sm font-medium transition-colors duration-200",
                    active ? "bg-pine text-paper" : "text-ink-soft hover:bg-ink/[0.05]"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* ── Bottom tab bar: tampil khusus mobile ────────────────────────── */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-paper/95 backdrop-blur-md md:hidden">
        <div className="mx-auto flex max-w-md items-stretch justify-around px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-1 flex-col items-center gap-1 py-1.5 text-[0.68rem] font-medium"
              >
                {active && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute -top-2 h-1 w-8 rounded-full bg-clay"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon
                  className={cn("h-5 w-5 transition-colors", active ? "text-pine" : "text-ink-soft/70")}
                  strokeWidth={active ? 2.4 : 2}
                />
                <span className={active ? "text-pine" : "text-ink-soft/70"}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
