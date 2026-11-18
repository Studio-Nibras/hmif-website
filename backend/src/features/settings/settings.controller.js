const settingsService = require("./settings.service");
const { validateSettings } = require("./settings.validation");

async function getPublicSettings(req, res, next) {
  try {
    const settings = await settingsService.getAllSettings();

    res.json({
      success: true,
      settings: {
        homepage: settings.homepage,
        about: settings.about,
        contact: settings.contact,
        social: settings.social,
        footer: settings.footer,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function getAdminSettings(req, res, next) {
  try {
    const settings = await settingsService.getAllSettings();

    res.json({
      success: true,
      settings,
    });
  } catch (error) {
    next(error);
  }
}

async function updateSettings(req, res, next) {
  try {
    const data = validateSettings(req.body?.settings);

    const settings = await settingsService.updateSettings(
      data,
      req.session.admin.id,
    );

    res.json({
      success: true,
      message: "Pengaturan website berhasil diperbarui.",
      settings,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getPublicSettings,
  getAdminSettings,
  updateSettings,
};
