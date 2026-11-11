const allowedStatuses = ["draft", "published"];

function validateArticle(body) {
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const content = typeof body.content === "string" ? body.content.trim() : "";
  const categoryId = Number(body.category_id);
  const status = body.status || "draft";
  const excerpt = typeof body.excerpt === "string" ? body.excerpt.trim() : null;
  const coverImage =
    typeof body.cover_image === "string" ? body.cover_image.trim() : "";

  if (!title || title.length > 255) {
    return {
      error: "Judul wajib diisi dan maksimal 255 karakter",
    };
  }

  if (!content) {
    return {
      error: "Isi berita wajib diisi",
    };
  }

  if (!Number.isSafeInteger(categoryId) || categoryId < 1) {
    return {
      error: "Kategori berita tidak valid",
    };
  }

  if (!allowedStatuses.includes(status)) {
    return {
      error: "Status berita tidak valid",
    };
  }

  if (coverImage.length > 500) {
    return {
      error: "URL gambar maksimal 500 karakter",
    };
  }

  return {
    data: {
      title,
      content,
      categoryId,
      status,
      excerpt: excerpt || null,
      coverImage: coverImage || null,
    },
  };
}

function validateId(value) {
  const id = Number(value);

  if (!Number.isSafeInteger(id) || id < 1) {
    return null;
  }

  return id;
}

function validateNewsFilters(query) {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);

  const limit = Math.min(
    100,
    Math.max(1, Number.parseInt(query.limit, 10) || 10),
  );

  const search = typeof query.search === "string" ? query.search.trim() : "";

  const status = typeof query.status === "string" ? query.status : "";

  const categoryId = query.category_id ? Number(query.category_id) : null;

  if (status && !allowedStatuses.includes(status)) {
    return {
      error: "Filter status tidak valid",
    };
  }

  if (
    categoryId !== null &&
    (!Number.isSafeInteger(categoryId) || categoryId < 1)
  ) {
    return {
      error: "Filter kategori tidak valid",
    };
  }

  return {
    data: {
      page,
      limit,
      offset: (page - 1) * limit,
      search,
      status,
      categoryId,
    },
  };
}

module.exports = {
  allowedStatuses,
  validateArticle,
  validateId,
  validateNewsFilters,
};
