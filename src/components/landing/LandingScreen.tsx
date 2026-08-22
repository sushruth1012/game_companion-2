import { Logo } from "@/components/landing/Logo";
import { GoogleButton } from "@/components/landing/GoogleButton";
import { Divider } from "@/components/landing/Divider";
import { ActivationForm } from "@/components/landing/ActivationForm";
import { CornerMotif } from "@/components/landing/CornerMotif";

/**
 * Mobile-first premium landing screen for Chowkabara Companion.
 * Entrance animations cascade: logo → title → actions, staggered via delays.
 */
export function LandingScreen() {
  return (
    <div className="paper-texture paper-grain relative flex min-h-[100dvh] flex-col overflow-hidden">
      {/* Faint geometric corner motifs */}
      <CornerMotif className="pointer-events-none absolute left-2 top-2 h-24 w-24 text-gold/25 sm:h-28 sm:w-28" />
      <CornerMotif className="pointer-events-none absolute right-2 top-2 h-24 w-24 -scale-x-100 text-terracotta/25 sm:h-28 sm:w-28" />
      <CornerMotif className="pointer-events-none absolute bottom-2 left-2 h-24 w-24 -scale-y-100 text-secondary/25 sm:h-28 sm:w-28" />
      <CornerMotif className="pointer-events-none absolute bottom-2 right-2 h-24 w-24 -scale-100 text-primary/20 sm:h-28 sm:w-28" />

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm space-y-9">
          {/* Emblem */}
          <div className="flex justify-center">
            <Logo className="animate-scale-in" />
          </div>

          {/* Title block */}
          <div
            className="space-y-2 text-center animate-fade-slide-up"
            style={{ animationDelay: "0.15s" }}
          >
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Chowkabara Companion
            </h1>
            <p className="text-sm font-light tracking-[0.18em] text-muted-foreground sm:text-base">
              Play <span className="text-gold">•</span> Learn{" "}
              <span className="text-gold">•</span> Preserve Heritage
            </p>
          </div>

          {/* Actions */}
          <div
            className="space-y-5 animate-fade-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            <GoogleButton />
            <Divider>OR</Divider>
            <ActivationForm />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="relative z-10 pb-8 text-center text-xs font-light tracking-wide text-muted-foreground animate-fade-in"
        style={{ animationDelay: "0.5s" }}
      >
        Inspired by India's Traditional Games
      </footer>
    </div>
  );
}
