import { Navigate, Route, Routes } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import LoginPage from "../features/auth/LoginPage";
import DashboardPage from "../features/dashboard/DashboardPage";
import HomePage from "../features/public/home/HomePage";
import PublicNewsPage from "../features/public/news/PublicNewsPage";
import PublicNewsDetailPage from "../features/public/news/PublicNewsDetailPage";

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/berita" element={<PublicNewsPage />} />
        <Route path="/berita/:slug" element={<PublicNewsDetailPage />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin" element={<DashboardPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
