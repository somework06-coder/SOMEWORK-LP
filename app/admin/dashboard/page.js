"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
    const [stats, setStats] = useState({
        freeResources: 0,
        paidResources: 0,
        totalResources: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            const { data: resources } = await supabase.from("resources").select("*");

            if (resources) {
                setStats({
                    freeResources: resources.filter((r) => r.type === "free").length,
                    paidResources: resources.filter((r) => r.type === "paid").length,
                    totalResources: resources.length,
                });
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="dashboard">
            <header className="page-header">
                <h1>Dashboard</h1>
                <p>Selamat datang di admin panel Somework!</p>
            </header>

            <div className="stats-grid">
                <div className="stat-card card">
                    <span className="stat-icon">📦</span>
                    <div className="stat-content">
                        <span className="stat-value">{stats.totalResources}</span>
                        <span className="stat-label">Total Resource</span>
                    </div>
                </div>

                <div className="stat-card card">
                    <span className="stat-icon">🆓</span>
                    <div className="stat-content">
                        <span className="stat-value">{stats.freeResources}</span>
                        <span className="stat-label">Resource Gratis</span>
                    </div>
                </div>

                <div className="stat-card card">
                    <span className="stat-icon">💰</span>
                    <div className="stat-content">
                        <span className="stat-value">{stats.paidResources}</span>
                        <span className="stat-label">Resource Berbayar</span>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .page-header {
          margin-bottom: 32px;
        }

        .page-header h1 {
          margin-bottom: 8px;
        }

        .page-header p {
          color: var(--text-secondary);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .stat-icon {
          font-size: 2.5rem;
        }

        .stat-content {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          font-family: var(--font-heading);
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }
      `}</style>
        </div>
    );
}
