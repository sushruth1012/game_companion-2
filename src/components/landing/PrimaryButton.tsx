/**
 * Reusable primary call-to-action button.
 * Earth-brown surface, gold hover accent, soft shadow.
 */
export function PrimaryButton({
  children,
  className = "",
  type = "button",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={`flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3.5 text-base font-semibold text-primary-foreground shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
