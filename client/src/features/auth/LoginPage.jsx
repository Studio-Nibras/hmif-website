import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Input } from "../../components/ui";
import { loginAdmin } from "./authService";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginAdmin(email, password);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err.message || "Login gagal. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-hmif-surface px-5 py-10">
      <div className="pointer-events-none absolute -right-32 -top-32 size-80 rounded-full bg-hmif-sky/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-32 size-96 rounded-full bg-hmif-cyan/15 blur-3xl" />

      <section className="relative w-full max-w-md">
        <Card className="rounded-3xl border-hmif-navy/[0.08] p-7 shadow-[0_20px_60px_-20px_rgba(23,54,79,0.15)] sm:p-9">
          <div className="mb-7">
            <h2 className="font-heading text-2xl font-extrabold tracking-tight text-hmif-navy">
              Selamat datang
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Masuk untuk mengelola website HMIF UNIBA Surakarta.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@hmif.com"
              autoComplete="username"
              required
              className="border-hmif-navy/10 bg-hmif-surface py-3.5 focus:bg-white focus:ring-4 focus:ring-hmif-teal/10"
            />

            <Input
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Masukkan password"
              autoComplete="current-password"
              required
              className="border-hmif-navy/10 bg-hmif-surface py-3.5 focus:bg-white focus:ring-4 focus:ring-hmif-teal/10"
            />

            <Button
              type="submit"
              loading={loading}
              fullWidth
              className="py-3.5 font-heading"
            >
              {loading ? "Memverifikasi..." : "Masuk"}
              {!loading && <span aria-hidden="true">→</span>}
            </Button>
            <p className="mt-6 text-center text-xs leading-5 text-slate-500">
              Akses khusus administrator
            </p>
            <div className="mt-5 text-center">
              <Link
                to="/"
                className="text-sm font-semibold text-hmif-teal transition hover:text-hmif-teal-dark"
              >
                Kembali ke halaman utama
              </Link>
            </div>
          </form>
        </Card>
      </section>
    </main>
  );
}
