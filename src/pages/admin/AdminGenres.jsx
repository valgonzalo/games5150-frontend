import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Pencil, Trash2, Plus, X } from 'lucide-react';

export default function AdminGenres() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGenre, setEditingGenre] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [modalError, setModalError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const { data } = await api.get('/genres');
      setGenres(data.data);
    } catch (error) {
      console.error("Error fetching genres", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (genre = null) => {
    setModalError('');
    if (genre) {
      setEditingGenre(genre);
      setFormData({ name: genre.name, description: genre.description || '' });
    } else {
      setEditingGenre(null);
      setFormData({ name: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingGenre(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setModalError('');

    try {
      if (editingGenre) {
        await api.put(`/genres/${editingGenre.id}`, formData);
      } else {
        await api.post('/genres', formData);
      }
      await fetchGenres();
      handleCloseModal();
    } catch (error) {
      setModalError(error.response?.data?.message || 'Error al guardar el género');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este género?')) return;
    try {
      await api.delete(`/genres/${id}`);
      await fetchGenres();
    } catch (error) {
      alert(error.response?.data?.message || 'Error al eliminar');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Gestionar Géneros</h1>
        <button 
          onClick={() => handleOpenModal()} 
          className="btn-primary"
        >
          <Plus className="h-4 w-4" /> Nuevo Género
        </button>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase bg-slate-800/80 text-slate-400 border-b border-white/10">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Nombre</th>
                <th className="px-6 py-4">Descripción</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-8">Cargando...</td>
                </tr>
              ) : genres.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-8">No hay géneros registrados</td>
                </tr>
              ) : (
                genres.map((genre) => (
                  <tr key={genre.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium">{genre.id}</td>
                    <td className="px-6 py-4 font-medium text-white">{genre.name}</td>
                    <td className="px-6 py-4 truncate max-w-xs">{genre.description}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleOpenModal(genre)}
                        className="text-primary hover:text-primaryHover mr-3 transition-colors"
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(genre.id)}
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-panel w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-bold text-white mb-6">
              {editingGenre ? 'Editar Género' : 'Nuevo Género'}
            </h2>
            
            {modalError && (
              <div className="mb-4 rounded-lg bg-danger/20 p-3 text-sm text-red-200 border border-danger/50">
                {modalError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300">Nombre</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300">Descripción</label>
                <textarea
                  className="input-field min-h-[100px]"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
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
