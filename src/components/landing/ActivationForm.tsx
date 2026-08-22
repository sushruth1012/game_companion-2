import { useState } from "react";
import { PrimaryButton } from "./PrimaryButton";

/**
 * Activation code entry. Uppercases input, shows focus ring in gold,
 * and surfaces a gentle inline message when submitted empty.
 */
export function ActivationForm({ className = "" }: { className?: string }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError("Please enter your activation code to join.");
      return;
    }
    setError(null);
    // Join-game flow will be wired to a route once auth is added.
  };

  return (
    <form onSubmit={handleSubmit} className={`w-full space-y-3 ${className}`} noValidate>
      <label htmlFor="activation-code" className="sr-only">
        Activation code
      </label>
      <input
        id="activation-code"
        type="text"
        inputMode="text"
        autoComplete="off"
        placeholder="Enter Activation Code"
        value={code}
        onChange={(e) => {
          setCode(e.target.value.toUpperCase());
          if (error) setError(null);
        }}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "activation-error" : undefined}
        className="w-full rounded-2xl border border-border bg-card px-5 py-3.5 text-center text-[15px] font-medium tracking-[0.18em] text-foreground placeholder:font-normal placeholder:tracking-normal placeholder:text-muted-foreground transition-all duration-300 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40"
      />
      {error ? (
        <p
          id="activation-error"
          className="px-1 text-center text-xs font-medium text-terracotta"
        >
          {error}
        </p>
      ) : null}
      <PrimaryButton type="submit">Join Game</PrimaryButton>
    </form>
  );
}
