import { useEffect, useId } from "react";
import Button from "./Button";

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  closeOnBackdrop = true,
  closeOnEscape = true,
}) {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event) {
      if (event.key === "Escape" && closeOnEscape) {
        onClose?.();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, closeOnEscape, onClose]);

  if (!open) return null;

  const widths = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (closeOnBackdrop && event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        className={[
          "my-auto w-full rounded-2xl bg-white shadow-2xl",
          widths[size] ?? widths.md,
        ].join(" ")}
      >
        {(title || onClose) && (
          <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
            <div>
              {title && (
                <h2
                  id={titleId}
                  className="text-lg font-bold text-hmif-navy"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p
                  id={descriptionId}
                  className="mt-1 text-sm leading-6 text-slate-500"
                >
                  {description}
                </p>
              )}
            </div>

            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                aria-label="Tutup dialog"
                className="shrink-0 px-2 text-xl"
              >
                ×
              </Button>
            )}
          </header>
        )}

        <div className="px-6 py-5">{children}</div>

        {footer && (
          <footer className="flex flex-wrap justify-end gap-3 border-t border-slate-100 px-6 py-4">
            {footer}
          </footer>
        )}
      </section>
    </div>
  );
}
