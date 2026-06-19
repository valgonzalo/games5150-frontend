import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { CheckCircle, XCircle } from 'lucide-react';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('verification_token');
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Token no proporcionado');
      return;
    }

    const verify = async () => {
      try {
        const { data } = await api.get(`/auth/verify-email?verification_token=${token}`);
        setStatus('success');
        setMessage(data.message);
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Error al verificar email');
      }
    };

    verify();
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="glass-panel w-full max-w-md p-8 text-center">
        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4"></div>
            <h2 className="text-xl font-semibold text-white">Verificando...</h2>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <CheckCircle className="h-16 w-16 text-emerald-500 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">¡Cuenta Verificada!</h2>
            <p className="text-slate-300 mb-6">{message}</p>
            <Link to="/login" className="btn-primary w-full">
              Ir al Login
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <XCircle className="h-16 w-16 text-danger mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Error de Verificación</h2>
            <p className="text-slate-300 mb-6">{message}</p>
            <Link to="/" className="btn-primary w-full bg-slate-700 hover:bg-slate-600">
              Volver al Inicio
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
