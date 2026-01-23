export default function ResourceCard({ resource }) {
    const { title, type, description, link, buttonLabel } = resource;

    return (
        <div className="card">
            <span className={`card-badge ${type}`}>
                {type === 'free' ? 'Gratis' : 'Berbayar'}
            </span>
            <h3 className="card-title">{title}</h3>
            <p className="card-description">{description}</p>
            <a
                href={link}
                className={`btn ${type === 'free' ? 'btn-primary' : 'btn-secondary'}`}
                target={link.startsWith('http') ? '_blank' : '_self'}
                rel={link.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
                {buttonLabel}
            </a>
        </div>
    );
}
