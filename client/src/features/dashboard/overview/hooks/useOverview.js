import { useEffect, useState } from "react";
import { getOverviewStats } from "../services/overviewService";

export default function useOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;

    getOverviewStats()
      .then((result) => {
        if (!active) return;

        setStats(result.stats);
        setError("");
      })
      .catch((err) => {
        if (!active) return;

        setError(err.message || "Gagal memuat statistik dashboard.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [refreshKey]);

  function reload() {
    setLoading(true);
    setError("");
    setRefreshKey((current) => current + 1);
  }

  return {
    stats,
    loading,
    error,
    reload,
  };
}
