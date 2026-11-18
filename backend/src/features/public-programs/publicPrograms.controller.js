const publicProgramsService = require("./publicPrograms.service");

async function getPrograms(req, res, next) {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);

    const limit = Math.min(
      20,
      Math.max(1, Number.parseInt(req.query.limit, 10) || 9),
    );

    const result = await publicProgramsService.getPublishedPrograms({
      page,
      limit,
    });

    return res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

async function getProgramBySlug(req, res, next) {
  try {
    const program = await publicProgramsService.getPublishedProgramBySlug(
      req.params.slug,
    );

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Program kerja tidak ditemukan.",
      });
    }

    return res.json({
      success: true,
      program,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getPrograms,
  getProgramBySlug,
};
