import { useState } from 'react';
import { forgotPasswordRequest } from '../api/auth';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await forgotPasswordRequest(email);
      setMessage(res.data.message || "Se ha enviado un correo con instrucciones para recuperar tu contraseña.");
      setEmail('');
    } catch (error) {
      setError(error.response?.data?.error || "Error al enviar el correo de recuperación.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-3xl shadow-2xl border lg:mr-12 border-gray-100 font-brand">
      <h2 className="text-xl sm:text-2xl font-bold text-[#6B4C3A] mb-1">
        Olvidaste tu contraseña?
      </h2>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-black mb-6">
        Recuperala!
      </h1>
      <p className="text-gray-400 text-sm mb-8 leading-relaxed">
        Porfavor introduce tu cuenta de correo electronico para poder recuperar tu contraseña
      </p>

      {/* Alertas de Éxito o Error */}
      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 text-sm text-center font-medium">
          {message}
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm text-center font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="test1@gmail.com"
            className="w-full bg-[#F8F5F0] border border-transparent rounded-md px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#6B4C3A] transition-all"
            required
            disabled={loading}
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className={`px-10 py-2.5 rounded-full font-semibold tracking-wide transition-colors shadow-md text-white 
              ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#6B4C3A] hover:bg-[#543b2d]'}`}
          >
            {loading ? 'ENVIANDO...' : 'RECUPERAR'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;