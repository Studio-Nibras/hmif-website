const pool = require("../../config/database");

async function getOverviewStats() {
  const [rows] = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM news_articles) AS totalNews,
      (SELECT COUNT(*) FROM programs) AS totalPrograms,
      (
        (SELECT COUNT(*) FROM news_articles WHERE status = 'published') +
        (SELECT COUNT(*) FROM programs WHERE publication_status = 'published')
      ) AS totalPublished,
      (
        (SELECT COUNT(*) FROM news_articles WHERE status = 'draft') +
        (SELECT COUNT(*) FROM programs WHERE publication_status = 'draft')
      ) AS totalDraft
  `);

  const stats = rows[0];

  return {
    totalNews: Number(stats.totalNews),
    totalPrograms: Number(stats.totalPrograms),
    totalPublished: Number(stats.totalPublished),
    totalDraft: Number(stats.totalDraft),
  };
}

async function getPublicationActivity() {
  const [rows] = await pool.query(`
    SELECT
      DATE_FORMAT(published_at, '%Y-%m') AS monthKey,
      COUNT(*) AS total
    FROM news_articles
    WHERE
      status = 'published'
      AND published_at >= DATE_FORMAT(
        DATE_SUB(CURRENT_DATE(), INTERVAL 5 MONTH),
        '%Y-%m-01'
      )
      AND published_at < DATE_ADD(
        LAST_DAY(CURRENT_DATE()),
        INTERVAL 1 DAY
      )
    GROUP BY DATE_FORMAT(published_at, '%Y-%m')
  `);

  const totals = new Map(rows.map((row) => [row.monthKey, Number(row.total)]));

  const activity = [];

  for (let offset = 5; offset >= 0; offset -= 1) {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - offset);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const monthKey = `${year}-${month}`;

    activity.push({
      month: new Intl.DateTimeFormat("id-ID", {
        month: "short",
      }).format(date),
      total: totals.get(monthKey) || 0,
    });
  }

  return activity;
}

module.exports = {
  getOverviewStats,
  getPublicationActivity,
};
