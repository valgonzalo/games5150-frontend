import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Pencil, Trash2, Plus, X } from 'lucide-react';

export default function AdminGames() {
  const [games, setGames] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [formData, setFormData] = useState({ 
    title: '', developer: '', release_year: '', genre_id: '', description: '', cover_url: '' 
  });
  const [modalError, setModalError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [gamesRes, genresRes] = await Promise.all([
        api.get('/games'),
        api.get('/genres')
      ]);
      setGames(gamesRes.data.data);
      setGenres(genresRes.data.data);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (game = null) => {
    setModalError('');
    if (game) {
      setEditingGame(game);
      setFormData({ 
        title: game.title, 
        developer: game.developer, 
        release_year: game.release_year, 
        genre_id: game.genre_id, 
        description: game.description || '', 
        cover_url: game.cover_url || '' 
      });
    } else {
      setEditingGame(null);
      setFormData({ title: '', developer: '', release_year: '', genre_id: '', description: '', cover_url: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingGame(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setModalError('');

    try {
      const payload = {
        ...formData,
        release_year: parseInt(formData.release_year),
        genre_id: parseInt(formData.genre_id)
      };

      if (editingGame) {
        await api.put(`/games/${editingGame.id}`, payload);
      } else {
        await api.post('/games', payload);
      }
      
      const { data } = await api.get('/games');
      setGames(data.data);
      handleCloseModal();
    } catch (error) {
      setModalError(error.response?.data?.message || 'Error al guardar el juego');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este juego?')) return;
    try {
      await api.delete(`/games/${id}`);
      const { data } = await api.get('/games');
      setGames(data.data);
    } catch (error) {
      alert(error.response?.data?.message || 'Error al eliminar');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Gestionar Juegos</h1>
        <button 
          onClick={() => handleOpenModal()} 
          className="btn-primary"
        >
          <Plus className="h-4 w-4" /> Nuevo Juego
        </button>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase bg-slate-800/80 text-slate-400 border-b border-white/10">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Título</th>
                <th className="px-6 py-4">Developer</th>
                <th className="px-6 py-4">Año</th>
                <th className="px-6 py-4">Género</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-8">Cargando...</td>
                </tr>
              ) : games.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8">No hay juegos registrados</td>
                </tr>
              ) : (
                games.map((game) => (
                  <tr key={game.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium">{game.id}</td>
                    <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                      {game.cover_url && (
                        <img src={game.cover_url} alt="" className="w-8 h-10 object-cover rounded shadow" />
                      )}
                      <span className="line-clamp-1">{game.title}</span>
                    </td>
                    <td className="px-6 py-4">{game.developer}</td>
                    <td className="px-6 py-4">{game.release_year}</td>
                    <td className="px-6 py-4">
                      <span className="bg-primary/20 text-primary px-2 py-1 rounded text-xs">
                        {game.Genre?.name || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button 
                        onClick={() => handleOpenModal(game)}
                        className="text-primary hover:text-primaryHover mr-3 transition-colors"
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(game.id)}
                        className="text-danger hover:text-red-400 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="glass-panel w-full max-w-2xl p-6 relative animate-in fade-in zoom-in duration-200 my-8">
            <button 
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-bold text-white mb-6">
              {editingGame ? 'Editar Juego' : 'Nuevo Juego'}
            </h2>
            
            {modalError && (
              <div className="mb-4 rounded-lg bg-danger/20 p-3 text-sm text-red-200 border border-danger/50">
                {modalError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-300">Título</label>
                <input
                  type="text"
                  name="title"
                  required
                  className="input-field"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300">Desarrolladora</label>
                <input
                  type="text"
                  name="developer"
                  required
                  className="input-field"
                  value={formData.developer}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300">Año de Lanzamiento</label>
                <input
                  type="number"
                  name="release_year"
                  required
                  className="input-field"
                  value={formData.release_year}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300">Género</label>
                <select
                  name="genre_id"
                  required
                  className="input-field appearance-none"
                  value={formData.genre_id}
                  onChange={handleChange}
                >
                  <option value="" disabled>Selecciona un género</option>
                  {genres.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300">URL de Portada (Opcional)</label>
                <input
                  type="url"
                  name="cover_url"
                  className="input-field"
                  value={formData.cover_url}
                  onChange={handleChange}
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-300">Descripción</label>
                <textarea
                  name="description"
                  className="input-field min-h-[100px]"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="md:col-span-2 flex justify-end gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={saving}
                >
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
