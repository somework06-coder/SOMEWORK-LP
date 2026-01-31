import { NextResponse } from 'next/server';
import { getThreadsInsights, getThreadsProfile, getUserThreads, getMediaInsights } from '@/lib/threads';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30', 10);

    if (!process.env.THREADS_USER_ID || !process.env.THREADS_ACCESS_TOKEN) {
        return NextResponse.json({ useDummy: true, message: "Credentials missing" });
    }

    try {
        // 1. Fetch Profile (Followers)
        const profile = await getThreadsProfile();
        console.log("DEBUG: Profile Response:", profile); // Log to server console

        // 2. Fetch Account Insights (Views, Interactions, Followers)
        const insightsResponse = await getThreadsInsights('views,likes,replies,reposts,quotes,followers_count', days);

        // Check for specific API error in insights
        if (insightsResponse?.error) {
            console.error("Insights API Failed:", insightsResponse.error);
            return NextResponse.json({
                useDummy: false,
                error: `Insights Error: ${insightsResponse.error.message || JSON.stringify(insightsResponse.error)}`
            });
        }

        const insights = insightsResponse;

        // 3. Fetch Top Threads (Recent posts + their insights)
        const recentThreads = await getUserThreads(5);
        const threadsWithMetrics = await Promise.all(
            recentThreads.map(async (thread) => {
                const metrics = await getMediaInsights(thread.id);
                // Default values
                let views = 0;
                let likes = 0;

                if (metrics) {
                    const viewsObj = metrics.find(m => m.name === 'views');
                    const likesObj = metrics.find(m => m.name === 'likes');
                    // Media insights usually return 'values' array with 1 item for total count
                    if (viewsObj?.values?.[0]) views = viewsObj.values[0].value;
                    if (likesObj?.values?.[0]) likes = likesObj.values[0].value;
                }

                return {
                    ...thread,
                    views,
                    likes
                };
            })
        );

        // Sort by views (descending)
        const topPosts = threadsWithMetrics.sort((a, b) => b.views - a.views);

        if (!profile && !insights && topPosts.length === 0) {
            return NextResponse.json({ useDummy: false, error: "No data returned from Threads API (Empty Response)" });
        }

        return NextResponse.json({
            useDummy: false,
            profile,
            insights,
            topPosts
        });

    } catch (error) {
        console.error('API Route Error:', error);
        return NextResponse.json({ useDummy: false, error: `Server Error: ${error.message}` });
    }
}
