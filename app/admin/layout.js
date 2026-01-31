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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

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

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

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
    { href: "/admin/analytics", label: "Analytics", icon: "📈" },
    { href: "/admin/settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <div className={`admin-layout ${isCollapsed ? 'collapsed-mode' : ''}`}>
      {/* Mobile Header */}
      <div className="mobile-header">
        <button
          className="menu-btn"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label="Toggle menu"
        >
          {isSidebarOpen ? '✕' : '☰'}
        </button>
        <span className="mobile-title">Somework Admin</span>
      </div>

      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          {!isCollapsed && (
            <>
              <h2>Somework</h2>
              <span className="admin-badge">Admin</span>
            </>
          )}
          <button
            className="collapse-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? '➡' : '⬅'}
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${pathname === item.href ? "active" : ""}`}
              title={isCollapsed ? item.label : ""}
            >
              <span className="nav-icon">{item.icon}</span>
              {!isCollapsed && <span className="nav-label">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          {!isCollapsed && (
            <div className="user-info">
              <span className="user-email">{user?.email}</span>
            </div>
          )}
          <button onClick={handleLogout} className="btn-logout" title="Logout">
            {isCollapsed ? '🚪' : 'Logout'}
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />
      )}

      <main className="admin-main">
        {children}
      </main>

      <style jsx global>{`
        .admin-layout {
          display: block; 
          min-height: 100vh;
        }

        .mobile-header {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: #111;
          color: white;
          align-items: center;
          padding: 0 20px;
          z-index: 90;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .menu-btn {
          background: none;
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          margin-right: 16px;
        }

        .mobile-title {
          font-weight: 700;
          font-size: 1.1rem;
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
          z-index: 100;
          transition: width 0.3s ease, transform 0.3s ease;
          overflow-x: hidden;
        }

        .admin-sidebar.collapsed {
          width: 80px;
        }

        /* Collapse Button */
        .collapse-btn {
            background: rgba(255,255,255,0.1);
            border: none;
            color: rgba(255,255,255,0.6);
            cursor: pointer;
            padding: 4px 8px;
            border-radius: 4px;
            margin-left: auto; /* Push to right */
            font-size: 0.8rem;
            transition: all 0.2s;
        }
        .collapse-btn:hover {
            color: #fff;
            background: rgba(255,255,255,0.2);
        }

        .sidebar-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          z-index: 95;
        }

        .sidebar-header {
          padding: 24px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          gap: 12px;
          height: 80px; /* Fixed height for stability */
          box-sizing: border-box;
          justify-content: space-between; /* Space out title and button */
        }
        
        .admin-sidebar.collapsed .sidebar-header {
            justify-content: center;
            padding: 24px 0;
        }
        
        .admin-sidebar.collapsed .collapse-btn {
            margin: 0;
        }

        .sidebar-header h2 {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0;
          font-family: var(--font-heading);
          white-space: nowrap;
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
          white-space: nowrap;
          overflow: hidden;
        }
        
        .admin-sidebar.collapsed .nav-item {
            justify-content: center;
            padding: 14px 0;
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
          margin-left: 260px;
          padding: 32px 40px;
          background: #f5f5f5;
          min-height: 100vh;
          /* STRICT WIDTH CONTROL */
          width: calc(100% - 260px); 
          max-width: calc(100% - 260px);
          overflow-x: hidden;
          transition: margin-left 0.3s ease, width 0.3s ease, max-width 0.3s ease;
        }
        
        .collapsed-mode .admin-main {
            margin-left: 80px;
            width: calc(100% - 80px);
            max-width: calc(100% - 80px);
        }

        @media (max-width: 768px) {
          .admin-layout.collapsed-mode .admin-main {
              margin-left: 0; /* Reset on mobile */
              width: 100%;
              max-width: 100%;
          }
        
          .admin-layout {
            flex-direction: column;
          }

          .mobile-header {
            display: flex;
          }

          .admin-sidebar {
            transform: translateX(-100%);
            width: 260px !important; /* Force width on mobile */
          }

          .admin-sidebar.open {
            transform: translateX(0);
          }
          
          .collapse-btn {
            display: none; /* Hide collapse on mobile */
          }

          .sidebar-overlay {
            display: block;
          }

          .admin-main {
            margin-left: 0;
            padding: 80px 20px 40px;
            width: 100%;
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
