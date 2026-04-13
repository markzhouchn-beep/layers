import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'

interface Artwork {
  id: number
  title: string
  artist_name: string
  image_url: string
  price: number
  username?: string
}

interface Props {
  artwork: Artwork
}

export default function ArtworkCard({ artwork }: Props) {
  return (
    <Link to={`/artwork/${artwork.id}`} className="group block">
      <div className="img-zoom rounded-xl overflow-hidden bg-warm-gray shadow-sm">
        <img
          src={artwork.image_url}
          alt={artwork.title}
          className="w-full aspect-[4/5] object-cover"
          loading="lazy"
        />
      </div>
      <div className="mt-3 flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-ink group-hover:text-vermilion transition-colors line-clamp-1">
            {artwork.title}
          </h3>
          <p className="text-xs text-smoke mt-0.5">
            {artwork.artist_name || artwork.username || 'Anonymous'}
          </p>
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
