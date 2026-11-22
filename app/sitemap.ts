import { MetadataRoute } from "next";
import { SEED_EVENTS } from "@/data/seed/seed-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://arsa-psi.vercel.app";

  const staticRoutes = [
    "",
    "/events",
    "/past-events",
    "/projects",
    "/gallery",
    "/team",
    "/join",
    "/contact",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const eventRoutes = SEED_EVENTS.map((evt) => ({
    url: `${baseUrl}/events/${evt.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...eventRoutes];
}
