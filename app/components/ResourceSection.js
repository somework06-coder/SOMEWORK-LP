import ResourceCard from "./ResourceCard";

export default function ResourceSection({ id, title, subtitle, resources, altBackground }) {
    return (
        <section id={id} className={`section ${altBackground ? 'section-alt' : ''}`}>
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">{title}</h2>
                    <p className="section-subtitle">{subtitle}</p>
                </div>

                <div className="grid grid-3">
                    {resources.map((resource) => (
                        <ResourceCard key={resource.id} resource={resource} />
                    ))}
                </div>
            </div>
        </section>
    );
}
