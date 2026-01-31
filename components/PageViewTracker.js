"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function PageViewTracker() {
    const pathname = usePathname();

    useEffect(() => {
        // Prevent tracking in development environment if desired
        // if (process.env.NODE_ENV === 'development') return;

        // Prevent duplicate tracking per session/page refresh if needed
        // For now, we track every hit (reload = new view) which is standard "Page View" definition.
        // If you want "Unique Visitors", we would filter by IP or session ID aggressively.

        // Check if it's admin page - exclude from analytics
        if (pathname.startsWith('/admin')) return;

        const trackView = async () => {
            try {
                await supabase.from("page_views").insert({
                    path: pathname,
                    user_agent: window.navigator.userAgent,
                });
            } catch (error) {
                // Silently fail to not disturb user experience
                console.error("Analytics Error:", error);
            }
        };

        trackView();
    }, [pathname]);

    return null; // This component renders nothing
}
