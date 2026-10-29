import { useEffect, useState } from "react";
import { getPublicNews } from "../news/publicNewsService";
import HeroSection from "./components/HeroSection";
import StatisticsSection from "./components/StatisticsSection";
import AboutSection from "./components/AboutSection";
import ProgramsSection from "./components/ProgramsSection";
import NewsSection from "./components/NewsSection";
import ContactSection from "./components/ContactSection";

export default function HomePage() {
  const [articles, setArticles] = useState([]);
  const [articleCount, setArticleCount] = useState(0);
  const [loadingNews, setLoadingNews] = useState(true);
  const [newsError, setNewsError] = useState("");

  useEffect(() => {
    let active = true;

    getPublicNews(1, 3)
      .then((result) => {
        if (!active) return;
        setArticles(result.articles || []);
        setArticleCount(result.pagination?.total || 0);
      })
      .catch(() => {
        if (active) setNewsError("Berita terbaru belum dapat dimuat.");
      })
      .finally(() => {
        if (active) setLoadingNews(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <HeroSection articleCount={articleCount} />
      <StatisticsSection articleCount={articleCount} />
      <AboutSection />
      <ProgramsSection />
      <NewsSection
        articles={articles}
        loading={loadingNews}
        error={newsError}
      />
      <ContactSection />
    </>
  );
}
