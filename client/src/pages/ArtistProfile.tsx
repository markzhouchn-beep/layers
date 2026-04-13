import { useParams } from 'react-router-dom'
import { MapPin, Link as LinkIcon, Globe2 } from 'lucide-react'
import ArtworkCard from '../components/ArtworkCard'

// Mock artist data
const artistData = {
  username: 'limobai',
  artist_name: '李墨白',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
  cover: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1600&q=80',
  bio: '当代水墨艺术家，作品融合传统国画技法与现代设计语言。现居北京，作品曾在上海、东京、纽约等地展出。',
  location: '北京',
  website: 'limobai.art',
  instagram: '@limobai_art',
  followers: 12800,
  artworks_count: 42,
}

const artistArtworks = [
  { id: 1, title: '山水之间', artist_name: '李墨白', image_url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80', price: 45 },
  { id: 9, title: '云海翻涌', artist_name: '李墨白', image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', price: 52 },
  { id: 10, title: '林间小径', artist_name: '李墨白', image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80', price: 38 },
  { id: 11, title: '暮色山峦', artist_name: '李墨白', image_url: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=600&q=80', price: 48 },
]

export default function ArtistProfile() {
  const { username } = useParams()

  return (
    <div className="pt-16">
      {/* Cover */}
      <div className="h-48 md:h-72 bg-warm-gray overflow-hidden">
        <img
          src={artistData.cover}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* Profile header */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative -mt-16 mb-6 flex flex-col md:flex-row md:items-end gap-6">
          <img
            src={artistData.avatar}
            alt={artistData.artist_name}
            className="w-28 h-28 md:w-32 md:h-32 rounded-2xl object-cover border-4 border-paper shadow-md"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-ink mb-1">
              {artistData.artist_name}
            </h1>
            <p className="text-smoke text-sm">@{username}</p>
          </div>
          <div className="flex gap-3">
            <a
              href="#"
              className="flex items-center gap-1.5 text-sm text-smoke hover:text-ink transition-colors"
            >
              <Globe2 size={16} /> {artistData.instagram}
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-8 mb-6">
          <div>
            <p className="text-xl font-semibold text-ink">{artistData.followers.toLocaleString()}</p>
            <p className="text-xs text-smoke">关注者</p>
          </div>
          <div>
            <p className="text-xl font-semibold text-ink">{artistData.artworks_count}</p>
            <p className="text-xs text-smoke">作品</p>
          </div>
        </div>

        {/* Bio */}
        <p className="text-smoke text-sm leading-relaxed max-w-2xl mb-4">
          {artistData.bio}
        </p>

        <div className="flex items-center gap-4 text-sm text-smoke mb-8">
          <span className="flex items-center gap-1"><MapPin size={14} /> {artistData.location}</span>
          <span className="flex items-center gap-1"><LinkIcon size={14} /> {artistData.website}</span>
        </div>

        <div className="border-t border-light-ink" />
      </div>

      {/* Artworks grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-lg font-semibold text-ink mb-6">作品</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {artistArtworks.map((art) => (
            <ArtworkCard key={art.id} artwork={art} />
          ))}
        </div>
      </div>
    </div>
  )
}
