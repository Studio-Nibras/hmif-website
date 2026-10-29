export default function Loading({
  label = "Memuat...",
  size = "md",
  fullScreen = false,
  className = "",
}) {
  const sizes = {
    sm: "size-4 border-2",
    md: "size-7 border-[3px]",
    lg: "size-10 border-4",
  };

  return (
    <div
      role="status"
      className={[
        "flex items-center justify-center gap-3 text-sm text-slate-500",
        fullScreen ? "min-h-[50vh]" : "py-6",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span
        aria-hidden="true"
        className={[
          "animate-spin rounded-full border-hmif-teal border-r-transparent",
          sizes[size] ?? sizes.md,
        ].join(" ")}
      />
      <span>{label}</span>
    </div>
  );
}
