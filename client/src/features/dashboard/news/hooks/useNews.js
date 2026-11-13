import { useCallback, useEffect, useRef, useState } from "react";
import {
  deleteNews,
  getNews,
  getNewsCategories,
  getNewsById,
} from "../../newsService";

export default function useNews() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [formData, setFormData] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const requestIdRef = useRef(0);

  const loadArticles = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setLoading(true);

    try {
      const result = await getNews({
        page: pagination.page,
        limit: pagination.limit,
        search,
        status,
        category_id: categoryId,
      });

      if (requestId !== requestIdRef.current) return;

      setArticles(result.articles || []);
      setPagination((current) => ({
        ...current,
        ...(result.pagination || {}),
      }));
      setError("");
    } catch (err) {
      if (requestId === requestIdRef.current) {
        setError(err.message || "Gagal memuat berita.");
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [
    pagination.page,
    pagination.limit,
    search,
    status,
    categoryId,
  ]);

  useEffect(() => {
    let active = true;

    getNewsCategories()
      .then((result) => {
        if (active) setCategories(result.categories || []);
      })
      .catch((err) => {
        if (active) setError(err.message || "Gagal memuat kategori.");
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    getNews({
      page: pagination.page,
      limit: pagination.limit,
      search,
      status,
      category_id: categoryId,
    })
      .then((result) => {
        if (!active) return;

        setArticles(result.articles || []);
        setPagination((current) => ({
          ...current,
          ...(result.pagination || {}),
        }));
        setError("");
      })
      .catch((err) => {
        if (active) {
          setError(err.message || "Gagal memuat berita.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [
    pagination.page,
    pagination.limit,
    search,
    status,
    categoryId,
    refreshKey,
  ]);

  function applySearch(event) {
    event.preventDefault();
    setLoading(true);
    setPagination((current) => ({ ...current, page: 1 }));
    setSearch(searchInput.trim());
  }

  function changeFilter(setter, value) {
    setLoading(true);
    setter(value);
    setPagination((current) => ({ ...current, page: 1 }));
  }

  function changePage(page) {
    setLoading(true);
    setPagination((current) => ({ ...current, page }));
  }

  async function openEdit(articleId) {
    setError("");
    setNotice("");

    try {
      const result = await getNewsById(articleId);
      const article = result.article;

      setFormData({
        id: article.id,
        title: article.title || "",
        category_id: String(article.category_id),
        excerpt: article.excerpt || "",
        content: article.content || "",
        cover_image: article.cover_image || "",
        status: article.status || "draft",
      });

      setFormOpen(true);
    } catch (err) {
      setError(err.message || "Gagal memuat detail berita.");
    }
  }

  async function handleDelete(article) {
    const confirmed = window.confirm(
      `Hapus berita "${article.title}"? Tindakan ini tidak dapat dibatalkan.`,
    );

    if (!confirmed) return;

    setDeletingId(article.id);
    setError("");
    setNotice("");

    try {
      await deleteNews(article.id);
      setNotice("Berita berhasil dihapus.");

      if (articles.length === 1 && pagination.page > 1) {
        changePage(pagination.page - 1);
      } else {
        await loadArticles();
      }
    } catch (err) {
      setError(err.message || "Berita gagal dihapus.");
    } finally {
      setDeletingId(null);
    }
  }

  function handleSaved() {
    setFormOpen(false);
    setFormData(null);
    setNotice("Berita berhasil disimpan.");

    setLoading(true);
    setPagination((current) => ({
      ...current,
      page: 1,
    }));

    setSearchInput("");
    setSearch("");
    setStatus("");
    setCategoryId("");
    setRefreshKey((current) => current + 1);
  }

  function openCreate() {
    setFormData(null);
    setFormOpen(true);
    setNotice("");
    setError("");
  }

  function closeForm() {
    setFormOpen(false);
    setFormData(null);
  }

  return {
    articles,
    categories,
    pagination,
    searchInput,
    setSearchInput,
    search,
    status,
    setStatus,
    categoryId,
    setCategoryId,
    loading,
    error,
    setError,
    notice,
    setNotice,
    formData,
    setFormData,
    formOpen,
    setFormOpen,
    deletingId,
    applySearch,
    changeFilter,
    changePage,
    openEdit,
    handleDelete,
    handleSaved,
    openCreate,
    closeForm,
  };
}
