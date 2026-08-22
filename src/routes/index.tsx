import { createFileRoute } from "@tanstack/react-router";
import { LandingScreen } from "@/components/landing/LandingScreen";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Chowkabara Companion — Play • Learn • Preserve Heritage" },
      {
        name: "description",
        content:
          "The digital companion for Chowkabara, India's traditional board game. Play, learn and preserve heritage.",
      },
      {
        property: "og:title",
        content: "Chowkabara Companion — Play • Learn • Preserve Heritage",
      },
      {
        property: "og:description",
        content:
          "The digital companion for Chowkabara, India's traditional board game. Play, learn and preserve heritage.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingScreen,
});
