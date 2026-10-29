import { Link } from "react-router-dom";
export default function ContactSection() {
  return (
    <section
      id="kontak"
      className="scroll-mt-10 bg-hmif-surface px-5 pb-16 sm:px-8 sm:pb-24"
    >
      <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-br from-hmif-teal-dark to-hmif-teal px-6 py-10 text-white sm:px-10 sm:py-14 lg:px-14">
        <div className="grid gap-7 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-hmif-cyan">
              Mari Terhubung
            </p>
            <h2 className="mt-4 max-w-2xl font-heading text-3xl font-extrabold leading-tight sm:text-4xl">
              Punya ide? Mari bertumbuh bersama.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-sky-100/75">
              Ikuti informasi dan publikasi terbaru dari HMIF UNIBA Surakarta.
            </p>
          </div>
          <Link
            to="/berita"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-extrabold text-hmif-teal-dark transition hover:bg-hmif-cyan"
          >
            Jelajahi berita <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
