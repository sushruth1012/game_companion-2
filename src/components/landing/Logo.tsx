import logoImg from "@/assets/chowkabara-logo.png";

/**
 * Centered logo emblem for Chowkabara Companion.
 * Wrapped in a soft circular gold-tinted halo on the ivory background.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative">
        {/* gold halo */}
        <div
          className="absolute inset-0 -m-3 rounded-full blur-xl opacity-40"
          style={{ backgroundColor: "var(--gold)" }}
          aria-hidden="true"
        />
        <img
          src={logoImg}
          alt="Chowkabara Companion emblem"
          className="relative h-24 w-24 rounded-full object-cover shadow-card ring-1 ring-gold/30 sm:h-28 sm:w-28"
        />
      </div>
    </div>
  );
}
