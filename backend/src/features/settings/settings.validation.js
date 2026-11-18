const SETTINGS_SCHEMA = {
  homepage: {
    hero_title: { type: "string", max: 200 },
    hero_subtitle: { type: "string", max: 500 },
    primary_cta_label: { type: "string", max: 100 },
    primary_cta_href: { type: "link", max: 500 },
    secondary_cta_label: { type: "string", max: 100 },
    secondary_cta_href: { type: "link", max: 500 },
    short_profile: { type: "string", max: 1000 },
  },
  about: {
    profile_title: { type: "string", max: 200 },
    profile_description: { type: "string", max: 2000 },
    vision: { type: "string", max: 2000 },
    mission: { type: "string", max: 3000 },
  },
  contact: {
    email: { type: "email", max: 254 },
    phone: { type: "string", max: 50 },
    address: { type: "string", max: 500 },
  },
  social: {
    instagram: { type: "link", max: 500 },
    facebook: { type: "link", max: 500 },
    youtube: { type: "link", max: 500 },
    tiktok: { type: "link", max: 500 },
    linkedin: { type: "link", max: 500 },
  },
  footer: {
    description: { type: "string", max: 1000 },
    copyright_text: { type: "string", max: 200 },
  },
};

function createValidationError(message) {
  const error = new Error(message);
  error.status = 400;
  return error;
}

function validateField(value, field, fieldName) {
  if (typeof value !== "string") {
    throw createValidationError(`${fieldName} harus berupa teks.`);
  }

  const normalized = value.trim();

  if (normalized.length > field.max) {
    throw createValidationError(`${fieldName} maksimal ${field.max} karakter.`);
  }

  if (field.type === "email" && normalized) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(normalized)) {
      throw createValidationError(`${fieldName} tidak valid.`);
    }
  }

  if (field.type === "link" && normalized) {
    const isRelative =
      normalized.startsWith("/") && !normalized.startsWith("//");

    let isHttpUrl = false;

    try {
      const url = new URL(normalized);
      isHttpUrl = ["http:", "https:"].includes(url.protocol);
    } catch {
      isHttpUrl = false;
    }

    if (!isRelative && !isHttpUrl) {
      throw createValidationError(
        `${fieldName} harus berupa URL HTTP/HTTPS atau path relatif.`,
      );
    }
  }

  return normalized;
}

function validateSettings(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw createValidationError("Format pengaturan tidak valid.");
  }

  const result = {};

  for (const [group, submittedFields] of Object.entries(data)) {
    const allowedFields = SETTINGS_SCHEMA[group];

    if (!allowedFields) {
      throw createValidationError(`Grup pengaturan "${group}" tidak dikenal.`);
    }

    if (
      !submittedFields ||
      typeof submittedFields !== "object" ||
      Array.isArray(submittedFields)
    ) {
      throw createValidationError(
        `Format grup pengaturan "${group}" tidak valid.`,
      );
    }

    const validatedGroup = {};

    for (const [key, value] of Object.entries(submittedFields)) {
      const field = allowedFields[key];

      if (!field) {
        throw createValidationError(
          `Pengaturan "${group}.${key}" tidak dikenal.`,
        );
      }

      validatedGroup[key] = validateField(value, field, `${group}.${key}`);
    }

    if (Object.keys(validatedGroup).length > 0) {
      result[group] = validatedGroup;
    }
  }

  if (Object.keys(result).length === 0) {
    throw createValidationError("Tidak ada pengaturan yang dikirim.");
  }

  return result;
}

module.exports = { validateSettings };
