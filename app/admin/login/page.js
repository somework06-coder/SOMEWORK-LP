"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error } = await signIn(email, password);

    if (error) {
      setError(error.message || "Login gagal");
      setLoading(false);
      return;
    }

    if (data?.user) {
      router.push("/admin/dashboard");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card card">
        <h1>Admin Login</h1>
        <p className="login-subtitle">Masuk ke dashboard Somework</p>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@somework.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? "Loading..." : "Masuk"}
          </button>
        </form>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: var(--background-alt);
        }

        .login-card {
          width: 100%;
          max-width: 400px;
        }

        .login-card h1 {
          margin-bottom: 8px;
        }

        .login-subtitle {
          margin-bottom: 24px;
          color: var(--text-secondary);
        }

        .login-error {
          background: #fee;
          border: 2px solid #c00;
          padding: 12px;
          margin-bottom: 16px;
          font-size: 0.875rem;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          margin-bottom: 6px;
          font-weight: 500;
        }

        .form-group input {
          width: 100%;
          padding: 12px;
          font-size: 1rem;
          border: var(--border-width) solid var(--border-color);
          background: var(--background);
          font-family: var(--font-body);
        }

        .form-group input:focus {
          outline: none;
          box-shadow: 0 0 0 3px var(--brand-yellow);
        }

        .btn-full {
          width: 100%;
          margin-top: 8px;
        }

        .btn-full:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
