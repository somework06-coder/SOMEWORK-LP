"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from "recharts";

export default function WebAnalyticsPage() {
    const [stats, setStats] = useState({
        totalViews: 0,
        todayViews: 0,
        chartData: [],
        activeHours: [],
        topResources: []
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchAnalytics() {
            setIsLoading(true);
            try {
                // Fetch Total Views
                const { count: total, error: errTotal } = await supabase
                    .from("page_views")
                    .select("*", { count: "exact", head: true });

                if (errTotal) throw errTotal;

                // Fetch Today's Views
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const { count: todayCount, error: errToday } = await supabase
                    .from("page_views")
                    .select("*", { count: "exact", head: true })
                    .gte("created_at", today.toISOString());

                if (errToday) throw errToday;

                // Fetch Recent History (Last 7 days) for Chart (simplified data grouping)
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

                const { data: historyData, error: errHist } = await supabase
                    .from("page_views")
                    .select("created_at")
                    .gte("created_at", sevenDaysAgo.toISOString())
                    .order("created_at", { ascending: true });

                if (errHist) throw errHist;

                // Process Chart Data (Client-side grouping for simplicity)
                const grouped = {};
                historyData.forEach(item => {
                    const date = new Date(item.created_at).toLocaleDateString();
                    grouped[date] = (grouped[date] || 0) + 1;
                });

                // Fill missing days
                const chartData = [];
                for (let i = 6; i >= 0; i--) {
                    const d = new Date();
                    d.setDate(d.getDate() - i);
                    const dateKey = d.toLocaleDateString();
                    chartData.push({
                        date: d.toLocaleDateString('en-US', { start: 'day', month: 'short', day: 'numeric' }),
                        views: grouped[dateKey] || 0
                    });
                }

                // Process Active Hours (0-23)
                const hours = new Array(24).fill(0);
                historyData.forEach(item => {
                    const d = new Date(item.created_at);
                    const hour = d.getHours();
                    hours[hour]++;
                });

                const activeHoursData = hours.map((count, i) => ({
                    hour: `${i.toString().padStart(2, '0')}:00`,
                    visitors: count
                }));

                // Fetch Resource Clicks
                const { data: clicksData, error: errClicks } = await supabase
                    .from("resource_clicks")
                    .select("resource_title");

                let topResourcesData = [];
                if (!errClicks && clicksData) {
                    const clickCounts = {};
                    clicksData.forEach(c => {
                        const title = c.resource_title || "Unknown";
                        clickCounts[title] = (clickCounts[title] || 0) + 1;
                    });

                    topResourcesData = Object.entries(clickCounts)
                        .map(([name, count]) => ({ name, count }))
                        .sort((a, b) => b.count - a.count)
                        .slice(0, 5); // Take top 5
                }

                setStats({
                    totalViews: total || 0,
                    todayViews: todayCount || 0,
                    chartData,
                    activeHours: activeHoursData,
                    topResources: topResourcesData
                });

            } catch (error) {
                console.error("Error fetching web analytics:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchAnalytics();
    }, []);

    // Simple Line Chart Component placeholder (reusing Recharts if possible, otherwise simple UI)
    // We'll reuse the same style as Thread Analytics for consistency.

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h1 className="section-title">Web Analytic</h1>
            <p className="section-subtitle">Traffic data from your landing page</p>

            <div className="dashboard-grid" style={{ marginTop: '32px' }}>
                {/* Overview Cards */}
                <div className="card">
                    <h3 className="card-title">Total Visitors (All Time)</h3>
                    <div className="big-number">
                        {isLoading ? "..." : stats.totalViews.toLocaleString()}
                    </div>
                </div>

                <div className="card">
                    <h3 className="card-title">Visitors Today</h3>
                    <div className="big-number">
                        {isLoading ? "..." : stats.todayViews.toLocaleString()}
                    </div>
                    {/* Badge */}
                    <div style={{ marginTop: 8 }}>
                        <span style={{
                            background: '#e6fffa',
                            color: '#047857',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            fontWeight: 600
                        }}>
                            Live Tracking
                        </span>
                    </div>
                </div>
            </div>

            {/* Visitors Trends Chart */}
            <div style={{ marginTop: '32px' }} className="card">
                <h3 className="card-title">Visitors Trend (Last 7 Days)</h3>
                <div style={{ height: '300px', width: '100%' }}>
                    {/*
                         Using 99% width to prevent sub-pixel rounding explosion.
                         Reusing the exact same styling as Threads Line Chart.
                     */}
                    <ResponsiveContainer width="99%" height="100%" debounce={50}>
                        <LineChart data={stats.chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                            <XAxis
                                dataKey="date"
                                tick={{ fontSize: 11 }}
                                axisLine={false}
                                tickLine={false}
                                minTickGap={30}
                            />
                            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{
                                    border: "3px solid #111",
                                    boxShadow: "4px 4px 0 #111",
                                    borderRadius: "0",
                                    fontSize: '12px'
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="views"
                                stroke="#111" // Dark stroke to differentiate from Threads (Yellow)
                                strokeWidth={3}
                                dot={false}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                    {/* Close Visitors Trend Chart containers */}
                </div>
            </div>

            {/* Active Hours Chart */}
            <div style={{ marginTop: '32px' }} className="card">
                <h3 className="card-title">Active Hours (When people visit)</h3>
                <div style={{ height: '300px', width: '100%' }}>
                    <ResponsiveContainer width="99%" height="100%" debounce={50}>
                        <BarChart data={stats.activeHours}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                            <XAxis
                                dataKey="hour"
                                tick={{ fontSize: 11 }}
                                axisLine={false}
                                tickLine={false}
                                interval={2} // Show every 3rd label to avoid crowding
                            />
                            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{
                                    border: "3px solid #111",
                                    boxShadow: "4px 4px 0 #111",
                                    borderRadius: "0",
                                    fontSize: '12px'
                                }}
                            />
                            <Bar dataKey="visitors" radius={[4, 4, 0, 0]}>
                                {stats.activeHours.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.visitors > 0 ? "#111" : "#eee"} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Top Resources Section */}
            <div style={{ marginTop: '32px' }} className="card">
                <h3 className="card-title">Top Performing Resources (Most Clicked)</h3>
                {stats.topResources.length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #eee', textAlign: 'left' }}>
                                <th style={{ padding: '12px 0', fontSize: '0.9rem', color: '#666' }}>Resource Name</th>
                                <th style={{ padding: '12px 0', fontSize: '0.9rem', color: '#666', textAlign: 'right' }}>Total Clicks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.topResources.map((res, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #f9f9f9' }}>
                                    <td style={{ padding: '12px 0', fontSize: '1rem', fontWeight: 500 }}>
                                        {i + 1}. {res.name}
                                    </td>
                                    <td style={{ padding: '12px 0', fontSize: '1rem', fontWeight: 700, textAlign: 'right' }}>
                                        {res.count}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p style={{ color: '#999', padding: '20px 0', textAlign: 'center' }}>
                        Belum ada data klik resource.
                    </p>
                )}
            </div>

            {/* Simple User Agent/Path Table could go here later */}

            <style jsx>{`
                .section-title {
                    font-size: 1.8rem;
                    font-weight: 700;
                    margin-bottom: 8px;
                    font-family: var(--font-heading);
                }
                .section-subtitle {
                    color: #666;
                    font-size: 1rem;
                }
                .dashboard-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 24px;
                }
                .card {
                    background: white;
                    border: 1px solid #eaeaea;
                    border-radius: 12px;
                    padding: 24px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                }
                .card-title {
                    font-size: 0.9rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    color: #666;
                    margin-bottom: 24px;
                    font-weight: 600;
                }
                .big-number {
                    font-size: 2.5rem;
                    font-weight: 700;
                    font-family: var(--font-heading);
                    color: #111;
                }
            `}</style>
        </div >
    );
}
