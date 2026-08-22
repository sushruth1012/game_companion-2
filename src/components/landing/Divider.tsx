/**
 * Horizontal divider with a centered label — used between sign-in options.
 */
export function Divider({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-border" />
      <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
        {children}
      </span>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-border" />
    </div>
  );
}
