import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'

interface Artwork {
  id: number
  title: string
  artist_name?: string
  username?: string
  mockup_url?: string
  original_image_url?: string
  image_url?: string
  price?: number
  view_count?: number
  tags?: string[]
}

export default function ArtworkCard({ artwork }: { artwork: Artwork }) {
  const image = artwork.mockup_url || artwork.original_image_url || artwork.image_url || ''
  const artistName = artwork.artist_name || artwork.username || 'Anonymous'

  return (
    <Link to={`/artwork/${artwork.id}`} className="group block">
      <div
        className="card overflow-hidden img-zoom"
        style={{ borderRadius: 12 }}
      >
        {image ? (
          <img
            src={image}
            alt={artwork.title}
            className="w-full aspect-[4/5] object-cover"
            loading="lazy"
          />
        ) : (
          <div
            className="w-full aspect-[4/5]"
            style={{ background: '#f6f5f4' }}
          >
            <div className="w-full h-full flex items-center justify-center text-[rgba(0,0,0,0.25)] text-sm">
              No preview
            </div>
          </div>
        )}
      </div>

      <div className="mt-3">
        {/* Title */}
        <h3
          className="text-[15px] font-semibold"
          style={{ color: 'rgba(0,0,0,0.9)', letterSpacing: '-0.1px', lineHeight: 1.3 }}
        >
          {artwork.title}
        </h3>

        {/* Artist */}
        <p
          className="text-[13px] mt-0.5"
          style={{ color: '#615d59', lineHeight: 1.4 }}
        >
          {artistName}
        </p>

        {/* Price + likes row */}
        <div className="flex items-center justify-between mt-2">
          <span
            className="text-[15px] font-semibold"
            style={{ color: 'rgba(0,0,0,0.9)' }}
          >
            ${artwork.price || 35}
          </span>
          <div className="flex items-center gap-1.5" style={{ color: '#a39e98' }}>
            <Heart size={13} className="group-hover:fill-[#eb5757] group-hover:text-[#eb5757] transition-colors" />
            <span className="text-[12px]">{artwork.view_count || Math.floor(Math.random() * 200 + 20)}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
