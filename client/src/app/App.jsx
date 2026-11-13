import { useState } from "react";
import { Route, Routes } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import Preloader from "../features/public/components/preloader/Preloader";

import HomePage from "../features/public/home/HomePage";
import AboutPage from "../features/public/about/AboutPage";
import ProgramsPage from "../features/public/programs/ProgramsPage";
import PublicNewsPage from "../features/public/news/PublicNewsPage";
import PublicNewsDetailPage from "../features/public/news/PublicNewsDetailPage";
import ContactPage from "../features/public/contact/ContactPage";

import LoginPage from "../features/auth/pages/LoginPage";
import DashboardPage from "../features/dashboard/pages/DashboardPage";

export default function App() {
  const [showPreloader, setShowPreloader] = useState(true);

  return (
    <>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/tentang" element={<AboutPage />} />
          <Route path="/program-kerja" element={<ProgramsPage />} />
          <Route path="/berita" element={<PublicNewsPage />} />
          <Route path="/berita/:slug" element={<PublicNewsDetailPage />} />
          <Route path="/kontak" element={<ContactPage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<DashboardPage />} />
      </Routes>

      {showPreloader && (
        <Preloader onComplete={() => setShowPreloader(false)} />
      )}
    </>
  );
}
