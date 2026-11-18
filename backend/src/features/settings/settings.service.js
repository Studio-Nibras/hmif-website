const pool = require("../../config/database");

const DEFAULT_SETTINGS = {
  homepage: {
    hero_title: "Bertumbuh, Berkolaborasi, Berinovasi.",
    hero_subtitle:
      "Rumah bagi mahasiswa Informatika untuk belajar, mengembangkan potensi, dan menciptakan dampak melalui teknologi.",
    primary_cta_label: "Kenali HMIF",
    primary_cta_href: "#tentang",
    secondary_cta_label: "Jelajahi Berita",
    secondary_cta_href: "#berita",
    short_profile:
      "HMIF UNIBA Surakarta merupakan ruang bagi mahasiswa Informatika untuk saling belajar, bertukar gagasan, dan mengembangkan potensi.",
  },
  about: {
    profile_title: "Lebih dari sekadar belajar teknologi.",
    profile_description:
      "HMIF UNIBA Surakarta merupakan ruang bagi mahasiswa Informatika untuk saling belajar, bertukar gagasan, dan mengembangkan potensi. Kami percaya bahwa kemajuan teknologi dimulai dari rasa ingin tahu, kolaborasi, dan kemauan untuk terus bertumbuh.",
    vision: "",
    mission: "",
  },
  contact: {
    email: "",
    phone: "",
    address: "",
  },
  social: {
    instagram: "",
    facebook: "",
    youtube: "",
    tiktok: "",
    linkedin: "",
  },
  footer: {
    description:
      "Wadah bagi mahasiswa Informatika untuk belajar, berkolaborasi, dan berkarya bersama.",
    copyright_text: "HMIF UNIBA Surakarta. All rights reserved.",
  },
};

function parseSettingValue(value) {
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return {};
    }
  }

  return value && typeof value === "object" ? value : {};
}

async function getAllSettings() {
  const [rows] = await pool.execute(
    "SELECT setting_key, setting_value FROM website_settings",
  );

  const settings = structuredClone(DEFAULT_SETTINGS);

  for (const row of rows) {
    if (!Object.hasOwn(settings, row.setting_key)) continue;

    const savedValue = parseSettingValue(row.setting_value);

    settings[row.setting_key] = {
      ...settings[row.setting_key],
      ...savedValue,
    };
  }

  return settings;
}

async function updateSettings(data, adminId) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    for (const [group, values] of Object.entries(data)) {
      const currentSettings = await getGroupSettings(connection, group);

      const updatedSettings = {
        ...currentSettings,
        ...values,
      };

      await connection.execute(
        `INSERT INTO website_settings (setting_key, setting_value)
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
        [group, JSON.stringify(updatedSettings)],
      );
    }

    await connection.execute(
      `INSERT INTO activity_logs
       (admin_id, action, entity_type, entity_id, metadata)
       VALUES (?, ?, ?, NULL, ?)`,
      [
        adminId,
        "settings.update",
        "website_settings",
        JSON.stringify({ groups: Object.keys(data) }),
      ],
    );

    await connection.commit();
    return getAllSettings();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function getGroupSettings(connection, group) {
  const [rows] = await connection.execute(
    "SELECT setting_value FROM website_settings WHERE setting_key = ?",
    [group],
  );

  if (!rows.length) {
    return { ...DEFAULT_SETTINGS[group] };
  }

  return {
    ...DEFAULT_SETTINGS[group],
    ...parseSettingValue(rows[0].setting_value),
  };
}

module.exports = {
  getAllSettings,
  updateSettings,
};
