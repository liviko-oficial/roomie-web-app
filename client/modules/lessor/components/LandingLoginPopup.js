import React, { useState } from 'react';

const LandingLoginPopup = ({ onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate user verification
    if (email === 'arrendador@example.com' && password === 'password') {
      onLoginSuccess();
      onClose();
    } else {
      setError('Usuario o contraseña incorrectos.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl relative max-w-sm w-full">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold"
        >
          X
        </button>
        <h2 className="text-3xl font-bold text-center text-black mb-6">Iniciar Sesión</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-lg font-medium mb-2">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-lg font-medium mb-2">Contraseña</label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg text-xl font-semibold hover:bg-gray-800 transition-colors shadow-md"
          >
            Entrar
          </button>
        </form>
        <div className="text-center mt-4">
          <a href="#" className="text-sm text-gray-600 hover:text-black">¿Olvidaste tu contraseña?</a>
        </div>
      </div>
    </div>
  );
};

export default LandingLoginPopup;