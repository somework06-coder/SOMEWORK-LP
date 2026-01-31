const THREADS_API_BASE = 'https://graph.threads.net/v1.0';

/**
 * Fetch insights for the authenticated user
 * @param {string} metric - Comma separated metrics (e.g. "views,likes")
 * @param {number} days - Number of days to fetch insights for (default 30)
 */
export async function getThreadsInsights(metric, days = 30) {
    const userId = process.env.THREADS_USER_ID;
    const accessToken = process.env.THREADS_ACCESS_TOKEN;

    if (!userId || !accessToken) {
        console.warn('Threads credentials missing in environment variables');
        return null;
    }

    try {
        const url = new URL(`${THREADS_API_BASE}/${userId}/threads_insights`);
        url.searchParams.append('metric', metric);

        const now = Math.floor(Date.now() / 1000);
        const since = now - (days * 24 * 60 * 60);

        url.searchParams.append('since', since);
        url.searchParams.append('until', now);

        url.searchParams.append('access_token', accessToken);

        const res = await fetch(url.toString());
        const data = await res.json();

        if (data.error) {
            console.error('Threads API Error:', data.error);
            // Return the error object so the route can handle it
            return { error: data.error };
        }

        return data; // Expected { data: [...] }
    } catch (error) {
        console.error('Failed to fetch Threads insights:', error);
        return { error: { message: error.message } };
    }
}

/**
 * Fetch basic profile info (followers count, etc)
 */
export async function getThreadsProfile() {
    const userId = process.env.THREADS_USER_ID;
    const accessToken = process.env.THREADS_ACCESS_TOKEN;
    if (!userId || !accessToken) return null;

    try {
        const url = new URL(`${THREADS_API_BASE}/me`);
        url.searchParams.append('fields', 'id,username,threads_biography,threads_profile_picture_url');
        url.searchParams.append('access_token', accessToken);

        const res = await fetch(url.toString());
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch Threads profile:', error);
        return null;
    }
}

/**
 * Fetch user's recent threads
 */
export async function getUserThreads(limit = 5) {
    const userId = process.env.THREADS_USER_ID;
    const accessToken = process.env.THREADS_ACCESS_TOKEN;
    if (!userId || !accessToken) return [];

    try {
        const url = new URL(`${THREADS_API_BASE}/me/threads`);
        url.searchParams.append('fields', 'id,text,permalink,timestamp,media_type,media_url');
        url.searchParams.append('limit', limit);
        url.searchParams.append('access_token', accessToken);

        const res = await fetch(url.toString());
        const data = await res.json();
        return data.data || [];
    } catch (error) {
        console.error('Failed to fetch user threads:', error);
        return [];
    }
}

/**
 * Fetch insights for a specific media object
 */
export async function getMediaInsights(mediaId) {
    const accessToken = process.env.THREADS_ACCESS_TOKEN;
    if (!mediaId || !accessToken) return null;

    try {
        const url = new URL(`${THREADS_API_BASE}/${mediaId}/insights`);
        url.searchParams.append('metric', 'views,likes,replies');
        url.searchParams.append('access_token', accessToken);

        const res = await fetch(url.toString());
        const data = await res.json();
        return data.data || [];
    } catch (error) {
        console.error(`Failed to fetch insights for media ${mediaId}:`, error);
        return null;
    }
}
