import { useEffect, useState } from "react";
import { getPublicationActivity } from "../services/overviewService";

export default function usePublicationActivity() {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getPublicationActivity()
      .then((result) => {
        if (!active) return;

        setActivity(result.activity);
        setError("");
      })
      .catch((err) => {
        if (!active) return;

        setError(err.message || "Gagal memuat aktivitas publikasi.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return {
    activity,
    loading,
    error,
  };
}
