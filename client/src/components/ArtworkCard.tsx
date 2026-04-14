import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'

interface Artwork {
  id: number
  title: string
  artist_name?: string
  username?: string
  image_url?: string    // mock API
  mockup_url?: string  // real API
  original_image_url?: string
  price?: number
  view_count?: number
}

export default function ArtworkCard({ artwork }: { artwork: Artwork }) {
  const image = artwork.mockup_url || artwork.original_image_url || artwork.image_url || ''
  const artistName = artwork.artist_name || artwork.username || 'Anonymous'

  return (
    <Link to={`/artwork/${artwork.id}`} className="group block">
      <div className="img-zoom rounded-xl overflow-hidden bg-warm-gray shadow-sm">
        {image ? (
          <img src={image} alt={artwork.title} className="w-full aspect-[4/5] object-cover" loading="lazy" />
        ) : (
          <div className="w-full aspect-[4/5] flex items-center justify-center text-smoke/30 text-xs">No image</div>
        )}
      </div>
      <div className="mt-3 flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-ink group-hover:text-vermilion transition-colors line-clamp-1">
            {artwork.title}
          </h3>
          <p className="text-xs text-smoke mt-0.5">{artistName}</p>
        </div>
        <div className="flex items-center gap-1 text-smoke">
          <Heart size={14} className="group-hover:fill-vermilion group-hover:text-vermilion transition-colors" />
        </div>
      </div>
      <p className="text-sm font-medium text-ink mt-1">
        ${artwork.price || 35}
      </p>
    </Link>
  )
}
