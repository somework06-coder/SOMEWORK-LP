"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { supabase, signOut, getUser } from "@/lib/supabase";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { user } = await getUser();

      if (!user && pathname !== "/admin/login") {
        router.push("/admin/login");
        return;
      }

      setUser(user);
      setLoading(false);
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        router.push("/admin/login");
      } else if (session?.user) {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [pathname, router]);

  const handleLogout = async () => {
    await signOut();
    router.push("/admin/login");
  };

  // Don't show layout for login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="admin-loading">
        <p>Loading...</p>
        <style jsx>{`
          .admin-loading {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: var(--font-body);
          }
        `}</style>
      </div>
    );
  }

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/admin/resources", label: "Resources", icon: "📦" },
    { href: "/admin/settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Somework</h2>
          <span className="admin-badge">Admin</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${pathname === item.href ? "active" : ""}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <span className="user-email">{user?.email}</span>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </aside>

      <main className="admin-main">
        {children}
      </main>

      <style jsx global>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
        }

        .admin-sidebar {
          width: 260px;
          background: #111111;
          color: #ffffff;
          display: flex;
          flex-direction: column;
          position: fixed;
          height: 100vh;
          left: 0;
          top: 0;
        }

        .sidebar-header {
          padding: 24px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sidebar-header h2 {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0;
          font-family: var(--font-heading);
        }

        .admin-badge {
          background: #FFC700;
          color: #111111;
          padding: 4px 10px;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .sidebar-nav {
          flex: 1;
          padding: 20px 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          border-radius: 6px;
          transition: all 0.15s ease;
          font-size: 0.95rem;
          font-weight: 500;
        }

        .nav-item:hover {
          background: rgba(255,255,255,0.08);
          color: #ffffff;
        }

        .nav-item.active {
          background: #FFC700;
          color: #111111;
        }

        .nav-icon {
          font-size: 1.2rem;
          width: 24px;
          text-align: center;
          flex-shrink: 0;
        }

        .nav-label {
          flex: 1;
        }

        .sidebar-footer {
          padding: 20px;
          border-top: 1px solid rgba(255,255,255,0.1);
        }

        .user-info {
          margin-bottom: 14px;
        }

        .user-email {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.6);
          word-break: break-all;
        }

        .btn-logout {
          width: 100%;
          padding: 12px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.2);
          color: #ffffff;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.15s ease;
          border-radius: 6px;
        }

        .btn-logout:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.3);
        }

        .admin-main {
          flex: 1;
          margin-left: 260px;
          padding: 32px 40px;
          background: #f5f5f5;
          min-height: 100vh;
        }
      `}</style>
    </div>
  );
}
