"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        hero_name: "",
        hero_tagline: "",
        hero_description: "",
        contact_whatsapp: "",
        contact_email: "",
        contact_threads: "",
        footer_quote: "",
        // New section titles
        section_free_title: "",
        section_free_subtitle: "",
        section_paid_title: "",
        section_paid_subtitle: "",
        contact_title: "",
        contact_subtitle: ""
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        const { data, error } = await supabase.from("site_config").select("*");
        if (data) {
            const newSettings = {};
            data.forEach(item => {
                newSettings[item.key] = item.value;
            });
            setSettings(prev => ({ ...prev, ...newSettings }));
        }
        setLoading(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        const updates = Object.entries(settings).map(([key, value]) => ({
            key,
            value,
            updated_at: new Date()
        }));

        const { error } = await supabase.from("site_config").upsert(updates);

        if (error) {
            setMessage({ type: "error", text: "Gagal menyimpan settings." });
        } else {
            setMessage({ type: "success", text: "Settings berhasil disimpan!" });
        }
        setSaving(false);
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="settings-page">
            <header className="page-header">
                <h1>Settings</h1>
                <p>Edit konten landing page</p>
            </header>

            {message && (
                <div className={`alert ${message.type}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSave}>
                <div className="settings-grid">
                    <div className="settings-section card">
                        <h2>Hero Section</h2>

                        <div className="form-group">
                            <label>Nama</label>
                            <input
                                type="text"
                                value={settings.hero_name}
                                onChange={(e) => setSettings({ ...settings, hero_name: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Tagline</label>
                            <input
                                type="text"
                                value={settings.hero_tagline}
                                onChange={(e) => setSettings({ ...settings, hero_tagline: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Deskripsi</label>
                            <textarea
                                value={settings.hero_description}
                                onChange={(e) => setSettings({ ...settings, hero_description: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="settings-section card">
                        <h2>Section Titles</h2>

                        <div className="form-group">
                            <label>Judul Resources Gratis</label>
                            <input
                                type="text"
                                value={settings.section_free_title}
                                placeholder="Resource Gratis"
                                onChange={(e) => setSettings({ ...settings, section_free_title: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Subtitle Resources Gratis</label>
                            <input
                                type="text"
                                value={settings.section_free_subtitle}
                                placeholder="Coba dulu. Nilai nanti."
                                onChange={(e) => setSettings({ ...settings, section_free_subtitle: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Judul Resources Berbayar</label>
                            <input
                                type="text"
                                value={settings.section_paid_title}
                                placeholder="Resource Berbayar"
                                onChange={(e) => setSettings({ ...settings, section_paid_title: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Subtitle Resources Berbayar</label>
                            <input
                                type="text"
                                value={settings.section_paid_subtitle}
                                placeholder="Buat eksekusi yang lebih cepat."
                                onChange={(e) => setSettings({ ...settings, section_paid_subtitle: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Judul Contact</label>
                            <input
                                type="text"
                                value={settings.contact_title}
                                placeholder="Kerja Bareng"
                                onChange={(e) => setSettings({ ...settings, contact_title: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Subtitle Contact</label>
                            <input
                                type="text"
                                value={settings.contact_subtitle}
                                placeholder="Ngobrol dulu aja."
                                onChange={(e) => setSettings({ ...settings, contact_subtitle: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="settings-section card">
                        <h2>Contact Links</h2>

                        <div className="form-group">
                            <label>WhatsApp (link lengkap)</label>
                            <input
                                type="text"
                                value={settings.contact_whatsapp}
                                onChange={(e) => setSettings({ ...settings, contact_whatsapp: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={settings.contact_email}
                                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Threads Profile</label>
                            <input
                                type="text"
                                value={settings.contact_threads}
                                onChange={(e) => setSettings({ ...settings, contact_threads: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="settings-section card">
                        <h2>Footer</h2>

                        <div className="form-group">
                            <label>Quote</label>
                            <textarea
                                value={settings.footer_quote}
                                onChange={(e) => setSettings({ ...settings, footer_quote: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                        {saving ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                </div>
            </form>

            <style jsx>{`
                .page-header {
                    margin-bottom: 32px;
                }

                .settings-grid {
                    display: grid;
                    gap: 24px;
                    margin-bottom: 32px;
                }

                .settings-section h2 {
                    margin-bottom: 20px;
                    font-size: 1.25rem;
                    border-bottom: 2px solid var(--border-color);
                    padding-bottom: 8px;
                }

                .form-group {
                    margin-bottom: 16px;
                }

                .form-group label {
                    display: block;
                    margin-bottom: 6px;
                    font-weight: 500;
                }

                .form-group input,
                .form-group textarea {
                    width: 100%;
                    padding: 12px;
                    font-size: 1rem;
                    border: var(--border-width) solid var(--border-color);
                    background: var(--background);
                    font-family: var(--font-body);
                }

                .form-group textarea {
                    min-height: 80px;
                    resize: vertical;
                }

                .form-actions {
                    position: sticky;
                    bottom: 24px;
                    background: var(--background);
                    padding: 16px;
                    border: var(--border-width) solid var(--border-color);
                    box-shadow: 4px 4px 0 var(--shadow-color);
                    z-index: 10;
                    display: flex;
                    justify-content: flex-end;
                }

                .alert {
                    padding: 12px;
                    margin-bottom: 24px;
                    border: 2px solid;
                    font-weight: 500;
                }

                .alert.success {
                    border-color: #0c0;
                    background: #efe;
                    color: #060;
                }

                .alert.error {
                    border-color: #c00;
                    background: #fee;
                    color: #900;
                }
            `}</style>
        </div>
    );
}
