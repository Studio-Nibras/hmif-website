const variants = {
  primary:
    "bg-hmif-teal text-white hover:bg-hmif-teal-dark",
  secondary:
    "border border-slate-200 bg-white text-hmif-navy hover:bg-slate-50",
  outline:
    "border border-hmif-teal text-hmif-teal hover:bg-hmif-teal/5",
  ghost:
    "bg-transparent text-hmif-navy hover:bg-slate-100",
  danger:
    "bg-red-600 text-white hover:bg-red-700",
};

const sizes = {
  sm: "min-h-9 px-3 text-sm",
  md: "min-h-11 px-4 py-2 text-sm",
  lg: "min-h-12 px-6 py-3 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  loading = false,
  disabled = false,
  fullWidth = false,
  className = "",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold",
        "transition-colors duration-200",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hmif-cyan",
        "disabled:pointer-events-none disabled:opacity-50",
        variants[variant] ?? variants.primary,
        sizes[size] ?? sizes.md,
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent"
        />
      )}
      {children}
    </button>
  );
}
