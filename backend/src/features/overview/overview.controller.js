const overviewService = require("./overview.service");

async function getStats(req, res, next) {
  try {
    const stats = await overviewService.getOverviewStats();

    return res.json({
      success: true,
      stats,
    });
  } catch (error) {
    next(error);
  }
}

async function getPublicationActivity(req, res, next) {
  try {
    const activity = await overviewService.getPublicationActivity();

    return res.json({
      success: true,
      activity,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getStats,
  getPublicationActivity,
};
