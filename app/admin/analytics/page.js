"use client";

import React, { useState, useEffect } from "react";
import styles from "./analytics.module.css";
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
    Legend,
} from "recharts";

// --- REAL DATA ONLY ---
// Removed dummy data constants as requested by user

export default function AnalyticsPage() {
    const [timeRange, setTimeRange] = useState("30d");
    const [stats, setStats] = useState({
        overview: [],
        views: [],
        engagement: [],
        topPosts: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            setError(null);
            try {
                // Parse days from timeRange string (e.g. "7d" -> 7)
                const days = parseInt(timeRange.replace('d', ''));
                const res = await fetch(`/api/analytics?days=${days}&t=${Date.now()}`, { cache: 'no-store' });
                const data = await res.json();

                if (data.useDummy || data.error) {
                    // If API explicitly fails or asks for dummy, treat as error/empty
                    console.warn("API returned error or dummy flag:", data.error);
                    setError(data.error || "Failed to fetch analytics data. Check server logs or token.");
                    setIsLoading(false);
                    return;
                }

                console.log("Real data received:", data);

                // Transform API Data
                const insights = data.insights?.data || [];
                const topPostsApi = data.topPosts || [];

                // 1. Extract Metrics
                const viewsMetric = insights.find(i => i.name === 'views');
                const likesMetric = insights.find(i => i.name === 'likes');
                const repliesMetric = insights.find(i => i.name === 'replies');
                const followersMetric = insights.find(i => i.name === 'followers_count');

                // Helper to safely get values array
                const getValues = (metric) => metric?.values || [];
                const getTotal = (metric) => {
                    if (metric?.total_value) return metric.total_value.value || 0;
                    return getValues(metric).reduce((acc, curr) => acc + (curr.value || 0), 0);
                };

                // 2. Prepare Overview
                const totalFollowers = getTotal(followersMetric);
                const totalViews = getTotal(viewsMetric);
                const totalLikes = getTotal(likesMetric);
                const totalReplies = getTotal(repliesMetric);

                // 3. Prepare Chart Data (Time Series)
                const viewsValues = getValues(viewsMetric);

                // Helper to aggregate data based on time range
                const aggregateData = (data, range) => {
                    if (!data || data.length === 0) return [];

                    // 1. Grouping Helper: Consolidates multiple data points into single time units
                    const groupData = (items, keyFormatFn) => {
                        const grouped = {};
                        items.forEach(item => {
                            const d = new Date(item.end_time || item.date);
                            const key = keyFormatFn(d);
                            if (!grouped[key]) grouped[key] = 0;
                            grouped[key] += (item.value || 0);
                        });
                        return Object.keys(grouped).map(key => ({
                            date: key,
                            views: grouped[key]
                        }));
                    };

                    if (range === '7d') {
                        // STRICTLY Group by Day (Mon, Tue...) to ensure max 7 points
                        return groupData(data, (date) => date.toLocaleDateString('en-US', { weekday: 'short' }));
                    }
                    else if (range === '30d' || range === '90d') {
                        return groupData(data, (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
                    }
                    else if (range === '365d') {
                        // Group by Month (Jan, Feb...)
                        return groupData(data, (date) => date.toLocaleDateString('en-US', { month: 'short' }));
                    }

                    return groupData(data, (date) => date.toLocaleDateString());
                };

                const chartData = aggregateData(viewsValues, timeRange);

                // 4. Update State with REAL API DATA ONLY
                setStats({
                    overview: [
                        { label: "Total Views", value: totalViews.toLocaleString(), change: "" },
                        { label: "Followers", value: totalFollowers.toLocaleString(), change: "" },
                        { label: "Likes", value: totalLikes.toLocaleString(), change: "" },
                        { label: "Replies", value: totalReplies.toLocaleString(), change: "" },
                    ],
                    views: chartData,
                    engagement: [
                        { name: "Likes", value: totalLikes, fill: "#FFC700" },
                        { name: "Replies", value: totalReplies, fill: "#111111" },
                    ],
                    topPosts: topPostsApi.map(post => ({
                        id: post.id,
                        content: post.text || "(No text)",
                        views: post.views || 0,
                        likes: post.likes || 0
                    }))
                });

            } catch (e) {
                console.error("Fetch error", e);
                setError(e.message);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();

    }, [timeRange]); // Re-run when timeRange changes

    if (isLoading && !stats.views.length) {
        return <div style={{ padding: 40, textAlign: 'center' }}>Loading analytics...</div>;
    }

    if (error) {
        return <div style={{ padding: 40, textAlign: 'center', color: 'red' }}>Error: {error}</div>;
    }

    return (
        <div className={styles.dashboardGrid} style={{ opacity: isLoading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
            <header className={styles.headerControls}>
                <div>
                    <h1 className="section-title">Threads Analytics</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <p className="section-subtitle">Insights from your Threads account</p>
                        {isLoading && <span style={{ fontSize: '0.8rem', color: '#666' }}>(Updating...)</span>}
                    </div>
                </div>
            </header>

            {/* Overview Cards */}
            <section className={styles.overviewSection}>
                {stats.overview.map((item, index) => (
                    <div key={index} className="card">
                        <h3 className="card-title" style={{ fontSize: "1rem", color: "var(--text-secondary)" }}>
                            {item.label}
                        </h3>
                        <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
                            <span style={{ fontSize: "2rem", fontWeight: "700", fontFamily: "var(--font-heading)" }}>
                                {item.value}
                            </span>
                            <span style={{ color: "green", fontSize: "0.875rem", fontWeight: "600" }}>
                                {item.change}
                            </span>
                        </div>
                    </div>
                ))}
            </section>

            {/* Charts Section */}
            <section className={styles.chartsSection}>
                {/* Profile Views Chart */}
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 className="card-title" style={{ marginBottom: 0 }}>Profile Views</h3>
                        {/* Filter moved here for context */}
                        <select
                            className={styles.timeRangeSelector}
                            style={{ width: 'auto', padding: '4px 8px', fontSize: '0.875rem' }}
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                        >
                            <option value="7d">7 Days</option>
                            <option value="30d">30 Days</option>
                            <option value="90d">3 Months</option>
                            <option value="365d">1 Year</option>
                        </select>
                    </div>
                    <div className={styles.chartContainer}>
                        {/* STANDARD APPROACH: Parent has fixed height & width: 100%. 
                            ResponsiveContainer should adapt. 
                            Using 99% width to prevent sub-pixel rounding explosion.
                         */}
                        <ResponsiveContainer width="99%" height="100%" debounce={50}>
                            <LineChart data={stats.views}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                    minTickGap={30} // Prevent overlapping labels
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
                                    stroke="#FFC700"
                                    strokeWidth={3}
                                    dot={false}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Engagement Breakdown */}
                <div className="card">
                    <h3 className="card-title">Engagement Breakdown</h3>
                    <div className={styles.chartContainer}>
                        <ResponsiveContainer width="99%" height="100%" debounce={50}>
                            <BarChart data={stats.engagement} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eee" />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    tick={{ fontSize: 14, fontWeight: 600 }}
                                    axisLine={false}
                                    tickLine={false}
                                    width={80}
                                />
                                <Tooltip
                                    cursor={{ fill: "transparent" }}
                                    contentStyle={{
                                        border: "3px solid #111",
                                        boxShadow: "4px 4px 0 #111",
                                        borderRadius: "0",
                                        fontSize: '12px'
                                    }}
                                />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={40} stroke="#111" strokeWidth={2} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </section>

            {/* Top Posts Section */}
            <section className="card">
                <h3 className="card-title" style={{ marginBottom: "24px" }}>
                    Top Performing Threads
                </h3>
                <div className={styles.postsList}>
                    {stats.topPosts.map((post) => (
                        <div key={post.id} className={styles.postItem}>
                            <div className={styles.postContent}>{post.content}</div>
                            <div className={styles.postMetrics}>
                                <div className={styles.postMetric}>👁️ {post.views.toLocaleString()}</div>
                                <div className={styles.postMetric}>❤️ {post.likes.toLocaleString()}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
