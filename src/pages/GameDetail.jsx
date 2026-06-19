import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import { Heart, ArrowLeft, Calendar, Building2, Monitor, ExternalLink } from 'lucide-react';

export default function GameDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const { data } = await api.get(`/games/${id}`);
        setGame(data.data);
        
        if (user) {
          const wlRes = await api.get('/wishlist');
          const isWl = wlRes.data.data.some(w => w.game_id === parseInt(id));
          setIsWishlisted(isWl);
        }
      } catch (error) {
        console.error("Error fetching game detail", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGameData();
  }, [id, user]);

  const handleWishlistToggle = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      if (isWishlisted) {
        await api.delete(`/wishlist/${id}`);
        setIsWishlisted(false);
      } else {
        await api.post('/wishlist', { game_id: parseInt(id) });
        setIsWishlisted(true);
      }
    } catch (error) {
      console.error("Error toggling wishlist", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Juego no encontrado</h2>
        <button onClick={() => navigate(-1)} className="text-[#a1a1aa] hover:text-white transition-colors">Volver a explorar</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="relative h-[50vh] min-h-[400px] w-full bg-[#0a0a0a] border-b border-[#27272a]">
        {game.cover_url && (
          <img 
            src={game.cover_url} 
            alt={game.title} 
            className="w-full h-full object-cover opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/60 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10 animate-fade-in">
        <Link to="/" className="inline-flex items-center gap-2 text-[#a1a1aa] hover:text-white mb-8 transition-colors bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-[#27272a]">
          <ArrowLeft className="h-4 w-4" />
          Volver al catálogo
        </Link>

        <div className="flex flex-col md:flex-row gap-12">
          <div className="w-full md:w-1/3 lg:w-1/4 shrink-0">
            <div className="bg-[#0a0a0a] border border-[#27272a] rounded-2xl overflow-hidden shadow-2xl">
              <div className="relative aspect-[3/4]">
                {game.cover_url ? (
                  <img 
                    src={game.cover_url} 
                    alt={game.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#a1a1aa] bg-[#18181b]">
                    Sin portada
                  </div>
                )}
              </div>
            </div>
            
            <button 
              onClick={handleWishlistToggle}
              className={`w-full mt-6 py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all text-lg shadow-xl ${
                isWishlisted 
                  ? 'bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20' 
                  : 'bg-white hover:bg-gray-200 text-black border border-white'
              }`}
            >
              <Heart className={`h-6 w-6 ${isWishlisted ? 'fill-current' : ''}`} />
              {isWishlisted ? 'En tu Wishlist' : 'Añadir a Wishlist'}
            </button>

            {game.steam_link && (
              <a 
                href={game.steam_link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mt-4 py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all text-lg shadow-xl bg-[#171a21] hover:bg-[#2a475e] text-white border border-[#66c0f4]/20 hover:border-[#66c0f4]/50"
              >
                Ver en Steam <ExternalLink className="h-5 w-5" />
              </a>
            )}
          </div>

          <div className="flex-grow pt-4 md:pt-0">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`px-3 py-1 text-white border rounded-full text-sm font-bold ${
                game.platform === 'PS5' ? 'bg-blue-600 border-blue-500' :
                game.platform === 'PS4' ? 'bg-blue-800 border-blue-700' :
                game.platform === 'Xbox' ? 'bg-green-600 border-green-500' :
                game.platform === 'PC' ? 'bg-gray-600 border-gray-500' :
                'bg-[#18181b] border-[#27272a]'
              }`}>
                {game.platform || 'Multiplataforma'}
              </span>
              <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-sm font-bold">
                {game.Genre?.name}
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black text-white mb-8 tracking-tighter drop-shadow-lg leading-tight">
              {game.title}
            </h1>
            
            <div className="mb-10 flex flex-wrap items-center gap-x-8 gap-y-4 text-slate-300 bg-[#0a0a0a] border border-[#27272a] rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#18181b] rounded-lg border border-[#27272a]">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Desarrollador</p>
                  <p className="font-medium text-white">{game.developer}</p>
                </div>
              </div>
              <div className="w-px h-10 bg-[#27272a] hidden sm:block"></div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#18181b] rounded-lg border border-[#27272a]">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Lanzamiento</p>
                  <p className="font-medium text-white">{game.release_year}</p>
                </div>
              </div>
            </div>

            <div className="mb-12">
              <h3 className="text-2xl font-bold text-white mb-4">Acerca del juego</h3>
              <p className="text-[#a1a1aa] leading-relaxed text-lg bg-[#0a0a0a] border border-[#27272a] rounded-2xl p-6">
                {game.description || 'No hay descripción disponible para este juego.'}
              </p>
            </div>

            {game.platform === 'PC' && (game.min_requirements || game.recommended_requirements) && (
              <div>
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <Monitor className="h-6 w-6" /> Requisitos del Sistema (PC)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {game.min_requirements && (
                    <div className="bg-[#0a0a0a] border border-[#27272a] rounded-2xl p-6">
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 pb-4 border-b border-[#27272a]">Mínimos</h4>
                      <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {game.min_requirements}
                      </div>
                    </div>
                  )}
                  {game.recommended_requirements && (
                    <div className="bg-[#0a0a0a] border border-[#27272a] rounded-2xl p-6">
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 pb-4 border-b border-[#27272a]">Recomendados</h4>
                      <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {game.recommended_requirements}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
