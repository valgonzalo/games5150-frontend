import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { HeartCrack, Heart } from 'lucide-react';

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const { data } = await api.get('/wishlist');
        setWishlist(data.data);
      } catch (error) {
        console.error("Error fetching wishlist", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchWishlist();
  }, []);

  const handleRemove = async (gameId) => {
    try {
      await api.delete(`/wishlist/${gameId}`);
      setWishlist(prev => prev.filter(w => w.game_id !== gameId));
    } catch (error) {
      console.error("Error removing from wishlist", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="h-8 w-8 text-danger fill-danger" />
        <h1 className="text-3xl md:text-4xl font-bold text-white">Mi Lista de Deseados</h1>
      </div>

      {wishlist.length === 0 ? (
        <div className="glass-panel p-12 text-center max-w-2xl mx-auto mt-12">
          <HeartCrack className="h-16 w-16 text-slate-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Tu lista está vacía</h2>
          <p className="text-slate-400 mb-8">
            Aún no has agregado ningún juego a tu lista de deseados. Explora el catálogo y guarda los que más te gusten.
          </p>
          <Link to="/" className="btn-primary inline-flex">
            Explorar Catálogo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map(item => (
            <div key={item.id} className="glass-panel flex p-4 gap-4 items-center group transition-all hover:bg-white/5 hover:border-white/20">
              <Link to={`/games/${item.Game.id}`} className="shrink-0 w-24 h-32 rounded-lg overflow-hidden bg-slate-800">
                {item.Game.cover_url ? (
                  <img src={item.Game.cover_url} alt={item.Game.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">Sin portada</div>
                )}
              </Link>
              
              <div className="flex flex-col flex-grow h-full justify-between py-1">
                <div>
                  <Link to={`/games/${item.Game.id}`}>
                    <h3 className="text-lg font-bold text-white hover:text-primary transition-colors line-clamp-2">
                      {item.Game.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-slate-400 mt-1">{item.Game.Genre?.name}</p>
                </div>
                
                <button 
                  onClick={() => handleRemove(item.game_id)}
                  className="self-start mt-4 text-sm font-medium text-danger hover:text-red-400 transition-colors flex items-center gap-1"
                >
                  <HeartCrack className="h-4 w-4" /> Quitar de la lista
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
