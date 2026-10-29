export default function Card({
  children,
  className = "",
  padding = "md",
  as: Component = "div",
  ...props
}) {
  const paddings = {
    none: "",
    sm: "p-4",
    md: "p-5 sm:p-6",
    lg: "p-6 sm:p-8",
  };

  return (
    <Component
      className={[
        "rounded-2xl border border-slate-100 bg-white shadow-sm",
        paddings[padding] ?? paddings.md,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </Component>
  );
}
