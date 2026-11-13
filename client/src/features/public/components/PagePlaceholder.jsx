export default function PagePlaceholder({ eyebrow, title, description }) {
  return (
    <main className="min-h-screen bg-hmif-surface px-5 pb-20 pt-36 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="mb-4 text-sm font-extrabold uppercase tracking-[0.2em] text-hmif-teal">
          {eyebrow}
        </p>

        <h1 className="max-w-3xl font-heading text-4xl font-extrabold leading-tight text-hmif-navy sm:text-5xl">
          {title}
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600">
          {description}
        </p>
      </div>
    </main>
  );
}
