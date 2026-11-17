import { useEffect, useState } from "react";
import { apiRequest } from "../lib/api";
import { readPublicCache, writePublicCache } from "../lib/public-cache";
import { allServices as fallbackServices } from "../data/services";
import type { ServiceItem } from "../data/services";

const SERVICES_CACHE_KEY = "services.v1";

export function useServices() {
  // Render bundled services immediately; cached/API data replaces them without a blank screen.
  const [services, setServices] = useState<ServiceItem[]>(fallbackServices);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    let networkFinished = false;

    void readPublicCache<ServiceItem[]>(SERVICES_CACHE_KEY).then(cached => {
      if (active && !networkFinished && Array.isArray(cached) && cached.length) {
        setServices(cached);
      }
    });

    // Revalidate in the background while the previous list stays visible.
    apiRequest<{ services: ServiceItem[] }>("/api/services")
      .then(result => {
        if (!Array.isArray(result.services)) return;
        networkFinished = true;
        if (active) setServices(result.services);
        void writePublicCache(SERVICES_CACHE_KEY, result.services);
      })
      .catch(() => {
        // Keep bundled or cached services visible when the API is unavailable.
      })
      .finally(() => {
        networkFinished = true;
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  return {
    services,
    mainServices: services.filter(item => item.group === "main"),
    featuredServices: services.filter(item => item.group === "featured"),
    loading
  };
}
