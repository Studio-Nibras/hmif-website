import { useId } from "react";

export default function Select({
  label,
  id,
  options = [],
  placeholder = "Pilih opsi",
  error,
  helperText,
  className = "",
  required = false,
  ...props
}) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const messageId = `${selectId}-message`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
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

      <select
        id={selectId}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error || helperText ? messageId : undefined}
        className={[
          "min-h-11 w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-hmif-navy",
          "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-hmif-cyan",
          error ? "border-red-500" : "border-slate-200",
          "disabled:cursor-not-allowed disabled:bg-slate-100",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => {
          const item =
            typeof option === "string"
              ? { label: option, value: option }
              : option;

          return (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          );
        })}
      </select>

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
