import { Routes, Route } from "react-router-dom";

import PublicLayout from "../../layouts/PublicLayout";

import HomePage from "../../features/public/home/HomePage";
import AboutPage from "../../features/public/about/AboutPage";
import ProgramsPage from "../../features/public/programs/ProgramsPage";
import PublicNewsPage from "../../features/public/news/PublicNewsPage";
import PublicNewsDetailPage from "../../features/public/news/PublicNewsDetailPage";
import ContactPage from "../../features/public/contact/ContactPage";

export default function PublicRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/tentang" element={<AboutPage />} />
        <Route path="/program-kerja" element={<ProgramsPage />} />
        <Route path="/berita" element={<PublicNewsPage />} />
        <Route path="/berita/:slug" element={<PublicNewsDetailPage />} />
        <Route path="/kontak" element={<ContactPage />} />
      </Route>
    </Routes>
  );
}
