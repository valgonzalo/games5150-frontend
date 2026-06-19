import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { UserPlus } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      const { data } = await api.post('/auth/register', formData);
      setSuccess(data.message);
      // Redirigir después de unos segundos
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error en el registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="glass-panel w-full max-w-md p-8">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500 shadow-lg shadow-indigo-500/30">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Crear Cuenta</h1>
          <p className="text-textMuted mt-2 text-center text-sm">
            Únete a GameCat y descubre miles de juegos
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-danger/20 border border-danger/50 p-4 text-sm text-red-200">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-lg bg-emerald-500/20 border border-emerald-500/50 p-4 text-sm text-emerald-200">
            {success}
            <p className="mt-2 text-xs">Redirigiendo al login...</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-300">Nombre</label>
            <input
              type="text"
              name="name"
              required
              className="input-field"
              placeholder="Tu nombre"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-300">Email</label>
            <input
              type="email"
              name="email"
              required
              className="input-field"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-300">Contraseña</label>
            <input
              type="password"
              name="password"
              required
              className="input-field"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button 
            type="submit" 
            className="btn-primary mt-6 w-full"
            disabled={loading || success}
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="text-primary hover:text-primaryHover font-medium transition-colors">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
