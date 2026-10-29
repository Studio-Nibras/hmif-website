import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui";
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: "Beranda", href: "#beranda" },
    { label: "Tentang", href: "#tentang" },
    { label: "Program Kerja", href: "#program" },
    { label: "Berita", href: "#berita" },
  ];

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:py-7">
        <Link
          to="/"
          className="flex items-center gap-3"
          aria-label="HMIF UNIBA beranda"
        >
          <span className="grid size-10 place-items-center rounded-xl border border-white/20 bg-white/10 font-heading text-lg font-extrabold text-white backdrop-blur">
            H
          </span>
          <span>
            <span className="block font-heading text-sm font-extrabold tracking-wide text-white">
              HMIF UNIBA
            </span>
            <span className="mt-0.5 block text-[10px] font-semibold tracking-[0.12em] text-sky-100/70">
              INFORMATIKA
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-sky-100/80 transition hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#kontak"
            className="rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-hmif-teal-dark transition hover:bg-hmif-cyan"
          >
            Hubungi Kami <span aria-hidden="true">↗</span>
          </a>
        </div>

        <Button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
          variant="ghost"
          className="grid size-11 place-items-center border border-white/20 px-0 text-xl text-white md:hidden"
        >
          {menuOpen ? "×" : "☰"}
        </Button>
      </nav>

      {menuOpen && (
        <div className="mx-5 rounded-2xl border border-white/10 bg-hmif-teal-dark/95 p-3 shadow-xl backdrop-blur-xl md:hidden">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block rounded-xl px-4 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#kontak"
            onClick={() => setMenuOpen(false)}
            className="mt-2 block rounded-xl bg-white px-4 py-3 text-center text-sm font-extrabold text-hmif-teal-dark"
          >
            Hubungi Kami ↗
          </a>
        </div>
      )}
    </header>
  );
}
