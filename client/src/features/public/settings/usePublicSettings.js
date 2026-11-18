import { useEffect, useState } from "react";
import { getPublicSettings } from "./publicSettingsService";

export default function usePublicSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    getPublicSettings()
      .then((data) => {
        if (active) setSettings(data);
      })
      .catch((error) => {
        console.error("Gagal memuat pengaturan publik:", error);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { settings, loading };
}
