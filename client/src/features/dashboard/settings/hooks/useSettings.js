import { useEffect, useState } from "react";
import {
  getAdminSettings,
  updateAdminSettings,
} from "../services/settingsService";

export default function useSettings() {
  const [settings, setSettings] = useState({});
  const [dirtySettings, setDirtySettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchSettings() {
      try {
        const data = await getAdminSettings();

        if (!active) return;

        setSettings(data);
        setDirtySettings({});
        setError("");
      } catch (err) {
        if (active) {
          setError(err.message || "Pengaturan website gagal dimuat.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchSettings();

    return () => {
      active = false;
    };
  }, []);

  function updateField(group, field, value) {
    setSettings((current) => ({
      ...current,
      [group]: {
        ...current[group],
        [field]: value,
      },
    }));

    setDirtySettings((current) => ({
      ...current,
      [group]: {
        ...current[group],
        [field]: value,
      },
    }));

    setNotice("");
  }

  async function saveSettings() {
    if (Object.keys(dirtySettings).length === 0) return;

    setSaving(true);
    setError("");
    setNotice("");

    try {
      const result = await updateAdminSettings(dirtySettings);
      setSettings(result.settings);
      setDirtySettings({});
      setNotice(result.message || "Pengaturan berhasil disimpan.");
    } catch (err) {
      setError(err.message || "Pengaturan gagal disimpan.");
    } finally {
      setSaving(false);
    }
  }

  return {
    settings,
    dirtySettings,
    loading,
    saving,
    error,
    notice,
    updateField,
    saveSettings,
    setError,
    setNotice,
  };
}
