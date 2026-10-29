const variants = {
  default: "bg-slate-100 text-slate-700",
  primary: "bg-sky-100 text-sky-800",
  success: "bg-emerald-100 text-emerald-800",
  warning: "bg-amber-100 text-amber-800",
  danger: "bg-red-100 text-red-700",
};

export default function Badge({
  children,
  variant = "default",
  size = "md",
  className = "",
}) {
  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  };

  return (
    <span
      className={[
        "inline-flex items-center rounded-full font-semibold",
        variants[variant] ?? variants.default,
        sizes[size] ?? sizes.md,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}
