/**
 * Faint Indian geometric corner motifs rendered as inline SVG.
 * Uses kolam / rangoli-inspired symmetry kept minimal and low-contrast.
 */
export function CornerMotif({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g opacity="0.9">
        <path d="M10 10 L10 46 M10 10 L46 10" />
        <path d="M10 22 C20 22 22 20 22 10" />
        <path d="M10 34 C30 34 34 30 34 10" />
        <circle cx="22" cy="22" r="6" />
        <path d="M22 16 L22 10 M16 22 L10 22" />
        <circle cx="10" cy="10" r="2.5" fill="currentColor" stroke="none" />
        <path d="M40 10 C40 24 24 40 10 40" opacity="0.6" />
        <path d="M14 14 L26 14 L26 26" opacity="0.5" />
      </g>
    </svg>
  );
}
