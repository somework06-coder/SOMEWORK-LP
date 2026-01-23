"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ResourcesPage() {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingResource, setEditingResource] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        type: "free",
        link: "",
        button_label: "",
    });

    const fetchResources = async () => {
        const { data, error } = await supabase
            .from("resources")
            .select("*")
            .order("created_at", { ascending: false });

        if (data) setResources(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchResources();
    }, []);

    const openModal = (resource = null) => {
        if (resource) {
            setEditingResource(resource);
            setFormData({
                title: resource.title,
                description: resource.description,
                type: resource.type,
                link: resource.link,
                button_label: resource.button_label,
            });
        } else {
            setEditingResource(null);
            setFormData({
                title: "",
                description: "",
                type: "free",
                link: "",
                button_label: "Ambil Gratis",
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingResource(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (editingResource) {
            // Update
            await supabase
                .from("resources")
                .update(formData)
                .eq("id", editingResource.id);
        } else {
            // Insert
            await supabase.from("resources").insert([formData]);
        }

        closeModal();
        fetchResources();
    };

    const handleDelete = async (id) => {
        if (confirm("Yakin mau hapus resource ini?")) {
            await supabase.from("resources").delete().eq("id", id);
            fetchResources();
        }
    };

    return (
        <div className="resources-page">
            <header className="page-header">
                <div>
                    <h1>Resources</h1>
                    <p>Kelola resource gratis dan berbayar</p>
                </div>
                <button className="btn btn-primary" onClick={() => openModal()}>
                    + Tambah Resource
                </button>
            </header>

            {loading ? (
                <p>Loading...</p>
            ) : resources.length === 0 ? (
                <div className="empty-state card">
                    <p>Belum ada resource. Tambahkan resource pertama!</p>
                </div>
            ) : (
                <div className="resources-table card">
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Type</th>
                                <th>Link</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resources.map((resource) => (
                                <tr key={resource.id}>
                                    <td>
                                        <strong>{resource.title}</strong>
                                        <br />
                                        <small>{resource.description}</small>
                                    </td>
                                    <td>
                                        <span className={`type-badge ${resource.type}`}>
                                            {resource.type === "free" ? "Gratis" : "Berbayar"}
                                        </span>
                                    </td>
                                    <td>
                                        <a href={resource.link} target="_blank" rel="noopener">
                                            {resource.link.substring(0, 30)}...
                                        </a>
                                    </td>
                                    <td>
                                        <button
                                            className="btn-action edit"
                                            onClick={() => openModal(resource)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn-action delete"
                                            onClick={() => handleDelete(resource.id)}
                                        >
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal card" onClick={(e) => e.stopPropagation()}>
                        <h2>{editingResource ? "Edit Resource" : "Tambah Resource"}</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Deskripsi</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Type</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        type: e.target.value,
                                        button_label: e.target.value === "free" ? "Ambil Gratis" : "Lihat"
                                    })}
                                >
                                    <option value="free">Gratis</option>
                                    <option value="paid">Berbayar</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Link</label>
                                <input
                                    type="url"
                                    value={formData.link}
                                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Button Label</label>
                                <input
                                    type="text"
                                    value={formData.button_label}
                                    onChange={(e) => setFormData({ ...formData, button_label: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                    Batal
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editingResource ? "Update" : "Tambah"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style jsx>{`
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
        }

        .page-header h1 {
          margin-bottom: 8px;
        }

        .page-header p {
          color: var(--text-secondary);
        }

        .empty-state {
          text-align: center;
          padding: 48px;
          color: var(--text-secondary);
        }

        .resources-table {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          padding: 16px;
          text-align: left;
          border-bottom: 1px solid var(--background-alt);
        }

        th {
          font-weight: 600;
          background: var(--background-alt);
        }

        .type-badge {
          padding: 4px 12px;
          font-size: 0.75rem;
          font-weight: 600;
          border: 2px solid var(--border-color);
        }

        .type-badge.free {
          background: var(--brand-yellow);
        }

        .type-badge.paid {
          background: var(--text-primary);
          color: var(--background);
        }

        .btn-action {
          padding: 6px 12px;
          font-size: 0.875rem;
          border: 2px solid var(--border-color);
          cursor: pointer;
          margin-right: 8px;
          background: var(--background);
        }

        .btn-action.delete {
          background: #fee;
          border-color: #c00;
          color: #c00;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal {
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal h2 {
          margin-bottom: 24px;
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
        .form-group textarea,
        .form-group select {
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

        .modal-actions {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }

        .modal-actions .btn {
          flex: 1;
        }
      `}</style>
        </div>
    );
}
