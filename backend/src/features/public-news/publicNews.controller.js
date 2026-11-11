const publicNewsService = require("./publicNews.service");

async function getNews(req, res, next) {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);

    const limit = Math.min(
      20,
      Math.max(1, Number.parseInt(req.query.limit, 10) || 9),
    );

    const { articles, total } = await publicNewsService.getPublishedNews({
      page,
      limit,
    });

    res.json({
      success: true,
      articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
}

async function getNewsBySlug(req, res, next) {
  try {
    const article = await publicNewsService.getPublishedNewsBySlug(
      req.params.slug,
    );

    if (!article) {
      return res.status(404).json({
        success: false,
        message: "Berita tidak ditemukan",
      });
    }

    res.json({
      success: true,
      article,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getNews,
  getNewsBySlug,
};
