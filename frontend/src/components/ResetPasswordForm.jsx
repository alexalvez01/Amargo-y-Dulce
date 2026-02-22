import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPasswordRequest } from '../api/auth';

const ResetpasswordForm = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      return setError("Las contraseñas no coinciden");
    }

    if (newPassword.length < 6) {
      return setError("La contraseña debe tener al menos 6 caracteres");
    }

    try {
      setLoading(true);
      const res = await resetPasswordRequest(token, newPassword);
      
      setMessage(res.data.message);
      
      setTimeout(() => {
        navigate('/login');
      }, 2500);

    } catch (error) {
      setError(error.response?.data?.error || "Hubo un error al actualizar la contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-3xl shadow-2xl border lg:mr-12 border-gray-100 font-brand">
      <h2 className="text-xl sm:text-2xl font-bold text-[#6B4C3A] mb-1">
        Casi listo
      </h2>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-black mb-6">
        Nueva Clave
      </h1>
      <p className="text-gray-400 text-sm mb-6 leading-relaxed">
        Ingresá tu nueva contraseña para la cuenta de Amargo y Dulce.
      </p>

      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-sm text-center font-medium">
          {message}
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm text-center font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nueva Contraseña
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full bg-[#F8F5F0] border border-transparent rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B4C3A]"
            required
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Confirmar Contraseña
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-[#F8F5F0] border border-transparent rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B4C3A]"
            required
            disabled={loading}
          />
        </div>

        <div className="flex justify-center pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`px-10 py-2.5 rounded-full font-semibold transition-colors text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#6B4C3A] hover:bg-[#543b2d]'}`}
          >
            {loading ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetpasswordForm;