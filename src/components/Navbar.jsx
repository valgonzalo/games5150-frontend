import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import { Gamepad2, LogOut, Settings, Heart, LogIn, Search, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (search.trim().length > 1) {
        try {
          const { data } = await api.get(`/games?search=${encodeURIComponent(search)}&limit=5`);
          setSuggestions(data.data || []);
          setShowSuggestions(true);
        } catch (error) {
          console.error("Error fetching search suggestions", error);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [search]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/?search=${encodeURIComponent(search)}`);
      setSearch('');
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (gameId) => {
    navigate(`/games/${gameId}`);
    setSearch('');
    setShowSuggestions(false);
  };

  return (
    <nav className="border-b border-[#27272a] bg-black/95 backdrop-blur-xl sticky top-0 z-50 transition-all">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 text-2xl font-black text-white tracking-tighter">
              <Gamepad2 className="h-7 w-7 text-white" />
              Games5150
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Inicio
              </Link>
              
              <div className="relative group">
                <button className="flex items-center gap-1 text-sm font-medium text-slate-300 hover:text-white transition-colors py-2">
                  Plataformas <ChevronDown className="h-4 w-4 opacity-50 group-hover:rotate-180 transition-transform duration-300" />
                </button>
                <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="w-48 bg-[#0a0a0a] border border-[#27272a] rounded-xl shadow-2xl overflow-hidden">
                    <div className="flex flex-col">
                      <Link to="/?platform=PS5" className="px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-[#27272a] transition-colors flex items-center justify-between">
                        PlayStation 5 <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      </Link>
                      <Link to="/?platform=PS4" className="px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-[#27272a] transition-colors flex items-center justify-between">
                        PlayStation 4 <span className="w-2 h-2 rounded-full bg-blue-700"></span>
                      </Link>
                      <Link to="/?platform=Xbox" className="px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-[#27272a] transition-colors flex items-center justify-between">
                        Xbox Series X <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      </Link>
                      <Link to="/?platform=PC" className="px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-[#27272a] transition-colors flex items-center justify-between">
                        PC Master Race <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                      </Link>
                      <Link to="/?platform=PS2" className="px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-[#27272a] transition-colors flex items-center justify-between">
                        Clásicos PS2 <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex flex-grow max-w-md mx-8 relative" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-[#a1a1aa]" />
              </div>
              <input
                type="text"
                className="w-full bg-[#18181b] border border-[#27272a] text-sm text-white rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all placeholder:text-[#a1a1aa]"
                placeholder="Buscar juegos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => { if(search.trim().length > 1) setShowSuggestions(true); }}
              />
            </form>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#0a0a0a] border border-[#27272a] rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in">
                <div className="flex flex-col">
                  {suggestions.map((game) => (
                    <button 
                      key={game.id}
                      onClick={() => handleSuggestionClick(game.id)}
                      className="w-full text-left px-4 py-3 hover:bg-[#18181b] transition-colors flex items-center gap-3 border-b border-[#27272a]/50 last:border-0"
                    >
                      <div className="w-10 h-10 rounded overflow-hidden shrink-0 bg-[#27272a]">
                        {game.cover_url ? (
                          <img src={game.cover_url} alt={game.title} className="w-full h-full object-cover" />
                        ) : (
                          <Gamepad2 className="w-full h-full p-2 text-slate-500" />
                        )}
                      </div>
                      <div className="flex-grow overflow-hidden">
                        <p className="text-sm font-bold text-white truncate">{game.title}</p>
                        <p className="text-xs text-slate-400">{game.platform}</p>
                      </div>
                    </button>
                  ))}
                  <button 
                    onClick={handleSearch}
                    className="w-full text-center px-4 py-2 text-xs font-bold text-slate-400 hover:text-white hover:bg-[#18181b] transition-colors bg-[#0f0f11]"
                  >
                    Ver todos los resultados para "{search}"
                  </button>
                </div>
              </div>
            )}
            
            {showSuggestions && suggestions.length === 0 && search.trim().length > 1 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#0a0a0a] border border-[#27272a] rounded-xl shadow-2xl overflow-hidden z-50 p-4 text-center">
                <p className="text-sm text-slate-400">No se encontraron resultados</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link to="/wishlist" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10" title="Mi Wishlist">
                  <Heart className="h-5 w-5" />
                </Link>

                <div className="relative group">
                  <button className="flex items-center gap-2 pl-2 pr-3 py-1 bg-[#18181b] border border-[#27272a] rounded-full hover:bg-[#27272a] transition-colors">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-white hidden sm:block">
                      {user.name}
                    </span>
                    <ChevronDown className="h-4 w-4 text-slate-400 group-hover:rotate-180 transition-transform duration-300" />
                  </button>
                  
                  <div className="absolute right-0 top-full pt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="bg-[#0a0a0a] border border-[#27272a] rounded-xl shadow-2xl overflow-hidden flex flex-col py-2">
                      <div className="px-4 py-3 border-b border-[#27272a] mb-2">
                        <p className="text-sm text-white font-bold">{user.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      </div>

                      {user.role === 'admin' && (
                        <>
                          <span className="px-4 py-1 text-xs font-bold text-slate-500 uppercase tracking-wider">Admin</span>
                          <Link to="/admin/games" className="px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-[#27272a] flex items-center gap-2">
                            <Settings className="h-4 w-4" /> Gestionar Juegos
                          </Link>
                          <Link to="/admin/genres" className="px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-[#27272a] flex items-center gap-2">
                            <Settings className="h-4 w-4" /> Gestionar Géneros
                          </Link>
                          <div className="h-px bg-[#27272a] my-2"></div>
                        </>
                      )}
                      
                      <button 
                        onClick={handleLogout}
                        className="px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 flex items-center gap-2 text-left transition-colors"
                      >
                        <LogOut className="h-4 w-4" /> Cerrar Sesión
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <Link to="/login" className="flex items-center gap-2 bg-white text-black hover:bg-gray-200 px-5 py-2 rounded-full text-sm font-bold transition-colors">
                <LogIn className="h-4 w-4" />
                <span>Ingresar</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
