import { useId } from "react";

export default function Input({
  label,
  id,
  error,
  helperText,
  className = "",
  required = false,
  ...props
}) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-2 block text-sm font-semibold text-hmif-navy"
        >
          {label}
          {required && (
            <span className="ml-1 text-red-600" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <input
        id={inputId}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error || helperText ? messageId : undefined}
        className={[
          "min-h-11 w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-hmif-navy",
          "placeholder:text-slate-400",
          "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-hmif-cyan",
          error
            ? "border-red-500"
            : "border-slate-200 hover:border-slate-300",
          "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />

      {(error || helperText) && (
        <p
          id={messageId}
          className={`mt-1.5 text-xs ${error ? "text-red-600" : "text-slate-500"}`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
}
