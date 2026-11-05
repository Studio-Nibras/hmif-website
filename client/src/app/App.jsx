import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import LoginPage from "../features/auth/LoginPage";
import DashboardPage from "../features/dashboard/DashboardPage";
import HomePage from "../features/public/home/HomePage";
import PublicNewsPage from "../features/public/news/PublicNewsPage";
import PublicNewsDetailPage from "../features/public/news/PublicNewsDetailPage";
import Preloader from "../features/public/components/preloader/Preloader";

function PublicRoutes() {
  const [showPreloader, setShowPreloader] = useState(true);

  return (
    <>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/berita" element={<PublicNewsPage />} />
          <Route path="/berita/:slug" element={<PublicNewsDetailPage />} />
        </Route>
      </Routes>

      {showPreloader && (
        <Preloader onComplete={() => setShowPreloader(false)} />
      )}
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/*" element={<PublicRoutes />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin" element={<DashboardPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
