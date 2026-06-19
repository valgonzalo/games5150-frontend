import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function GameCard({ game, onWishlistToggle, isWishlisted }) {
  const { user } = useAuth();

  return (
    <div className="glass-panel overflow-hidden group hover:border-[#444] transition-all duration-300 flex flex-col h-full animate-fade-in">
      <div className="relative aspect-video overflow-hidden bg-black border-b border-[#27272a]">
        {game.cover_url ? (
          <img 
            src={game.cover_url} 
            alt={game.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="flex w-full h-full items-center justify-center text-slate-500">
            Sin portada
          </div>
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-60"></div>
        
        {/* Wishlist Button Overlay */}
        {user && (
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onWishlistToggle(game.id, isWishlisted);
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-surface/80 backdrop-blur-sm border border-white/10 text-white hover:bg-white/10 transition-colors z-10"
            title={isWishlisted ? "Quitar de deseados" : "Agregar a deseados"}
          >
            <Heart className={`h-5 w-5 transition-colors ${isWishlisted ? 'fill-danger text-danger' : ''}`} />
          </button>
        )}

        <div className="absolute top-3 left-3 flex gap-2">
          {game.platform && (
            <span className={`px-2 py-1 text-xs font-bold text-white backdrop-blur-md rounded-md shadow-lg ${
              game.platform === 'PS5' ? 'bg-blue-600/80' :
              game.platform === 'PS2' ? 'bg-blue-800/80' :
              game.platform === 'Xbox' ? 'bg-green-600/80' :
              'bg-gray-600/80'
            }`}>
              {game.platform}
            </span>
          )}
        </div>

        <div className="absolute bottom-3 left-3 right-3">
          <span className="px-2 py-1 text-xs font-medium text-black bg-white rounded-md shadow-lg">
            {game.Genre?.name || 'Género'}
          </span>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-white mb-1 line-clamp-1" title={game.title}>{game.title}</h3>
        <p className="text-sm text-slate-400 mb-4 line-clamp-1">{game.developer} • {game.release_year}</p>
        
        <div className="mt-auto pt-4 border-t border-[#27272a]">
          <Link to={`/games/${game.id}`} className="w-full py-2 flex items-center justify-center text-sm font-medium text-white border border-[#27272a] rounded-md hover:bg-white hover:text-black transition-colors">
            Ver Detalles
          </Link>
        </div>
      </div>
    </div>
  );
}
