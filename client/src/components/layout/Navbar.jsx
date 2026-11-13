import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "../ui";
import logo from "../../assets/hmif-logo.png";

const links = [
  { label: "Beranda", href: "/", end: true },
  { label: "Tentang HMIF", href: "/tentang" },
  { label: "Program Kerja", href: "/program-kerja" },
  { label: "Berita", href: "/berita" },
];

const getLinkClass = ({ isActive }) =>
  `text-sm font-semibold transition ${
    isActive ? "text-white" : "text-sky-100/80 hover:text-white"
  }`;

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:py-7">
        <NavLink
          to="/"
          end
          className="flex items-center gap-3"
          aria-label="HMIF UNIBA beranda"
        >
          <img src={logo} alt="" className="size-14 object-contain" />
          <span>
            <span className="block font-heading text-sm font-extrabold tracking-wide text-white">
              HMIF UNIBA
            </span>
            <span className="mt-0.5 block text-[10px] font-semibold tracking-[0.12em] text-sky-100/70">
              SURAKARTA
            </span>
          </span>
        </NavLink>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              end={link.end}
              className={getLinkClass}
            >
              {link.label}
            </NavLink>
          ))}

          <NavLink
            to="/kontak"
            className="rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-hmif-teal-dark transition hover:bg-hmif-cyan"
          >
            Hubungi Kami <span aria-hidden="true">↗</span>
          </NavLink>
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
            <NavLink
              key={link.href}
              to={link.href}
              end={link.end}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block rounded-xl px-4 py-3 text-sm font-bold transition ${
                  isActive
                    ? "bg-white/15 text-white"
                    : "text-sky-100 hover:bg-white/10"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          <NavLink
            to="/kontak"
            onClick={() => setMenuOpen(false)}
            className="mt-2 block rounded-xl bg-white px-4 py-3 text-center text-sm font-extrabold text-hmif-teal-dark"
          >
            Hubungi Kami ↗
          </NavLink>
        </div>
      )}
    </header>
  );
}
