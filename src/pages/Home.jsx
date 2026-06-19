import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import GameCard from '../components/GameCard';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Search, Filter, ChevronRight, ChevronLeft, Play } from 'lucide-react';

const GameCarousel = ({ title, games, wishlist, onWishlistToggle, onSeeAll }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (!games || games.length === 0) return null;

  return (
    <div className="mb-12 relative group">
      <button 
        onClick={onSeeAll}
        className="text-2xl font-bold text-white mb-6 flex items-center gap-2 hover:text-[#a1a1aa] transition-colors group/title"
      >
        {title} <ChevronRight className="h-6 w-6 text-[#a1a1aa] group-hover/title:translate-x-1 transition-transform" />
      </button>
      <div className="relative">
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-black/80 p-3 rounded-full border border-[#27272a] text-white opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 hidden md:block hover:bg-[#27272a]"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-4"
        >
          {games.map(game => (
            <div key={game.id} className="min-w-[280px] w-[280px] sm:min-w-[320px] sm:w-[320px] shrink-0 snap-start">
              <GameCard 
                game={game} 
                onWishlistToggle={onWishlistToggle}
                isWishlisted={wishlist.has(game.id)}
              />
            </div>
          ))}
        </div>

        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-black/80 p-3 rounded-full border border-[#27272a] text-white opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 hidden md:block hover:bg-[#27272a]"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default function Home() {
  const [games, setGames] = useState([]);
  const [genres, setGenres] = useState([]);
  const [wishlist, setWishlist] = useState(new Set());
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [sort, setSort] = useState('newest'); // 'newest', 'az', 'za'
  const [heroIndex, setHeroIndex] = useState(0);
  
  const { user } = useAuth();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [genresRes, wishlistRes] = await Promise.all([
          api.get('/genres'),
          user ? api.get('/wishlist') : Promise.resolve({ data: { data: [] } })
        ]);
        setGenres(genresRes.data.data);
        if (user) {
          const wlSet = new Set(wishlistRes.data.data.map(w => w.game_id));
          setWishlist(wlSet);
        }
      } catch (error) {
        console.error("Error fetching initial data", error);
      }
    };
    fetchInitialData();
  }, [user]);

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        let url = '/games';
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (selectedGenre) params.append('genre_id', selectedGenre);
        if (selectedPlatform) params.append('platform', selectedPlatform);
        if (sort === 'az' || sort === 'za') params.append('sort', sort);
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        
        const { data } = await api.get(url);
        setGames(data.data);
      } catch (error) {
        console.error("Error fetching games", error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => { fetchGames(); }, 300);
    return () => clearTimeout(timer);
  }, [search, selectedGenre, selectedPlatform, sort]);

  const handleWishlistToggle = async (gameId, isWishlisted) => {
    if (!user) return;
    try {
      if (isWishlisted) {
        await api.delete(`/wishlist/${gameId}`);
        setWishlist(prev => {
          const next = new Set(prev);
          next.delete(gameId);
          return next;
        });
      } else {
        await api.post('/wishlist', { game_id: gameId });
        setWishlist(prev => new Set(prev).add(gameId));
      }
    } catch (error) {
      console.error("Error toggling wishlist", error);
    }
  };

  const isFiltering = search || selectedGenre || selectedPlatform || sort !== 'newest';

  const ps5Games = games.filter(g => g.platform === 'PS5');
  const xboxGames = games.filter(g => g.platform === 'Xbox');
  const ps4Games = games.filter(g => g.platform === 'PS4');
  const ps2Games = games.filter(g => g.platform === 'PS2');
  const pcGames = games.filter(g => g.platform === 'PC');
  
  const heroGames = games.slice(0, 5);
  const heroGame = heroGames[heroIndex] || games[0];

  useEffect(() => {
    if (isFiltering || heroGames.length <= 1) return;
    const interval = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % heroGames.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroGames.length, isFiltering]);

  return (
    <div className="animate-fade-in pb-20">
      
      {!isFiltering && heroGame && (
        <div className="relative h-[60vh] min-h-[500px] w-full bg-black mb-12 transition-all duration-700 ease-in-out">
          <div className="absolute inset-0">
            <img 
              key={heroGame.id}
              src={heroGame.cover_url} 
              alt="Hero" 
              className="w-full h-full object-cover opacity-50 animate-fade-in"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent"></div>
          </div>
          <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-20 relative z-10">
            <span className="px-3 py-1 bg-white text-black text-xs font-bold rounded-full w-max mb-4">
              DESTACADO
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tighter drop-shadow-2xl max-w-4xl animate-slide-up">
              {heroGame.title}
            </h1>
            <p className="text-xl text-[#ededed] max-w-2xl mb-8 line-clamp-3 animate-slide-up" style={{ animationDelay: '100ms' }}>
              {heroGame.description}
            </p>
            <div className="flex gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <Link to={`/games/${heroGame.id}`} className="px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
                <Play className="h-5 w-5 fill-current" />
                Ver Detalles
              </Link>
            </div>
          </div>
          
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
            {heroGames.map((g, idx) => (
              <button 
                key={g.id}
                onClick={() => setHeroIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${heroIndex === idx ? 'w-8 bg-white' : 'w-4 bg-white/30 hover:bg-white/50'}`}
              />
            ))}
          </div>
        </div>
      )}

      <div className="container mx-auto px-4">
        <div className="sticky top-16 z-40 bg-black/90 backdrop-blur-md border-b border-[#27272a] py-4 mb-12">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-[#a1a1aa]" />
              </div>
              <input
                type="text"
                className="input-field !pl-10"
                placeholder="Buscar por título..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="flex gap-4 overflow-x-auto hide-scrollbar">
              <select
                className="input-field appearance-none bg-black min-w-[150px]"
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
              >
                <option value="">Todas las Consolas</option>
                <option value="PS5">PlayStation 5</option>
                <option value="PS4">PlayStation 4</option>
                <option value="Xbox">Xbox Series X|S</option>
                <option value="PS2">PlayStation 2</option>
                <option value="PC">PC</option>
              </select>

              <select
                className="input-field appearance-none bg-black min-w-[150px]"
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
              >
                <option value="">Todos los géneros</option>
                {genres.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>

              <select
                className="input-field appearance-none bg-black min-w-[150px]"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="newest">Más Recientes</option>
                <option value="az">Alfabético (A-Z)</option>
                <option value="za">Alfabético (Z-A)</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
          </div>
        ) : games.length > 0 ? (
          <>
            {!isFiltering ? (
              <div className="space-y-4">
                <GameCarousel title="🔥 Lanzamientos PS5" games={ps5Games} wishlist={wishlist} onWishlistToggle={handleWishlistToggle} onSeeAll={() => setSelectedPlatform('PS5')} />
                <GameCarousel title="🔵 Éxitos de PS4" games={ps4Games} wishlist={wishlist} onWishlistToggle={handleWishlistToggle} onSeeAll={() => setSelectedPlatform('PS4')} />
                <GameCarousel title="💚 Éxitos de Xbox" games={xboxGames} wishlist={wishlist} onWishlistToggle={handleWishlistToggle} onSeeAll={() => setSelectedPlatform('Xbox')} />
                <GameCarousel title="📺 Clásicos Inmortales (PS2)" games={ps2Games} wishlist={wishlist} onWishlistToggle={handleWishlistToggle} onSeeAll={() => setSelectedPlatform('PS2')} />
                <GameCarousel title="💻 PC Master Race" games={pcGames} wishlist={wishlist} onWishlistToggle={handleWishlistToggle} onSeeAll={() => setSelectedPlatform('PC')} />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {games.map(game => (
                  <GameCard 
                    key={game.id} 
                    game={game} 
                    onWishlistToggle={handleWishlistToggle}
                    isWishlisted={wishlist.has(game.id)}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-32 border border-[#27272a] rounded-2xl bg-[#0a0a0a]">
            <h3 className="text-2xl font-bold text-white mb-2">No se encontraron juegos</h3>
            <p className="text-[#a1a1aa]">Intenta cambiar los filtros o tu búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
