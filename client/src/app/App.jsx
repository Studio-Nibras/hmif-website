import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../features/auth/LoginPage";
import DashboardPage from "../features/dashboard/DashboardPage";
import HomePage from "../features/public/HomePage";
import PublicNewsPage from "../features/public/PublicNewsPage";
import PublicNewsDetailPage from "../features/public/PublicNewsDetailPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/berita" element={<PublicNewsPage />} />
      <Route path="/berita/:slug" element={<PublicNewsDetailPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin" element={<DashboardPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
