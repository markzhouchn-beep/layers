import { Link } from 'react-router-dom'

const footerLinks = {
  Shop: [
    { label: 'All Artworks', to: '/' },
    { label: 'T-Shirts', to: '/?category=tshirt' },
    { label: 'Posters', to: '/?category=poster' },
    { label: 'Canvas Prints', to: '/?category=canvas' },
  ],
  Artists: [
    { label: 'Join as Creator', to: '/join' },
    { label: 'Creator Dashboard', to: '/creator' },
    { label: 'Royalties', to: '/' },
    { label: 'FAQ', to: '/' },
  ],
  Company: [
    { label: 'About', to: '/' },
    { label: 'Contact', to: '/' },
    { label: 'Privacy', to: '/' },
    { label: 'Terms', to: '/' },
  ],
}

export default function Footer() {
  return (
    <footer
      style={{
        background: '#f6f5f4',
        borderTop: '1px solid rgba(0,0,0,0.08)',
      }}
    >
      <div className="container mx-auto px-6 py-14">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr repeat(3, 1fr)',
            gap: 32,
          }}
        >
          {/* Brand column */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                <rect x="1" y="1" width="10" height="10" fill="rgba(0,0,0,0.9)" />
                <rect x="15" y="1" width="10" height="10" fill="#0075de" />
                <rect x="1" y="15" width="10" height="10" fill="rgba(0,0,0,0.08)" />
                <rect x="15" y="15" width="10" height="10" fill="rgba(0,0,0,0.9)" />
              </svg>
              <span
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  letterSpacing: '-0.3px',
                  color: 'rgba(0,0,0,0.95)',
                }}
              >
                Layers
              </span>
            </Link>
            <p
              style={{
                fontSize: 14,
                color: '#615d59',
                lineHeight: 1.6,
                maxWidth: 220,
              }}
            >
              Chinese artists, global prints.
              <br />
              Your art, delivered worldwide.
            </p>
            <p
              className="mt-4"
              style={{ fontSize: 13, color: '#a39e98' }}
            >
              © 2026 Layers
              <br />
              layershop.store
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'rgba(0,0,0,0.9)',
                  marginBottom: 12,
                  letterSpacing: '-0.05px',
                }}
              >
                {heading}
              </p>
              <ul className="flex flex-col gap-2.5">
                {links.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      style={{
                        fontSize: 14,
                        color: '#615d59',
                        textDecoration: 'none',
                        transition: 'color 0.15s',
                      }}
                      className="hover:text-[rgba(0,0,0,0.9)]"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <hr className="divider mt-10" />
        <div className="flex items-center justify-between mt-6">
          <p style={{ fontSize: 13, color: '#a39e98' }}>
            Built for artists. Powered by Printify.
          </p>
          <div className="flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="6.5" stroke="#a39e98" />
              <path d="M7 4v3.5l2 1.5" stroke="#a39e98" strokeWidth="1" strokeLinecap="round" />
            </svg>
            <span style={{ fontSize: 13, color: '#a39e98' }}>Worldwide shipping</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
