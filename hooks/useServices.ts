import { useEffect, useState } from "react";
import { apiRequest } from "../lib/api";
import { allServices as fallbackServices } from "../data/services";
import type { ServiceItem } from "../data/services";

export function useServices() {
  const [services, setServices] = useState<ServiceItem[]>(fallbackServices);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    apiRequest<{ services: ServiceItem[] }>("/api/services")
      .then(result => {
        if (active && Array.isArray(result.services) && result.services.length) setServices(result.services);
      })
      .catch(() => {
        // Keep the bundled catalog available if the API is not configured yet.
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return {
    services,
    mainServices: services.filter(item => item.group === "main"),
    featuredServices: services.filter(item => item.group === "featured"),
    loading
  };
}
