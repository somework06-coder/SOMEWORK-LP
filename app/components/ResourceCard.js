"use client";

import { supabase } from "@/lib/supabase";

export default function ResourceCard({ resource }) {
    const { id, title, type, description, link, buttonLabel } = resource;

    const handleClick = async () => {
        // console.log("Resource clicked:", title); // Keep console log if needed, or remove.
        try {
            // Track the click in background (Fire and Forget)
            const { error } = await supabase.from("resource_clicks").insert({
                resource_id: id,
                resource_title: title
            });
            if (error) console.error("Supabase Insert Error:", error);
            else console.log("Click tracked successfully!");
        } catch (error) {
            console.error("Error tracking click:", error);
        }
    };

    return (
        <div className="card">
            <span className={`card-badge ${type}`}>
                {type === 'free' ? 'Gratis' : 'Berbayar'}
            </span>
            <h3 className="card-title">{title}</h3>
            <p className="card-description">{description}</p>
            <a
                href={link}
                onClick={handleClick}
                className={`btn ${type === 'free' ? 'btn-primary' : 'btn-secondary'}`}
                target={link.startsWith('http') ? '_blank' : '_self'}
                rel={link.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
                {buttonLabel}
            </a>
        </div>
    );
}
