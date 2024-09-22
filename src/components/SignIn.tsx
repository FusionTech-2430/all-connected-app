import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/FooterApp';

const SignIn = () => {
  return (
    <div>
      <NavBar />
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
        {/* Sección de formulario */}
        <div className="flex flex-col justify-center px-8 md:px-16">
          <h1 className="text-3xl font-bold text-[#0369A1] mb-4">¡Bienvenido de nuevo!</h1>
          <p className="text-gray-700 mb-8">Ingresa tu correo y contraseña para iniciar sesión</p>
          <form className="space-y-4">
            <div>
              <label className="block text-gray-700">Correo</label>
              <input
                type="email"
                placeholder="Tu dirección de correo electrónico"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700">Contraseña</label>
              <input
                type="password"
                placeholder="Tu contraseña"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
              />
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="w-full bg-[#0284C7] text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                Iniciar Sesión
              </button>
            </div>
          </form>
          <p className="text-center mt-4 text-sm">
            ¿No tienes una cuenta? <a href="/users" className="text-[#0369A1]">Regístrate</a>
          </p>
        </div>

        {/* Sección del banner */}
        <div className="relative bg-[#075985] flex justify-center items-center rounded-lg">
          <img
            src="/Banner2-removebg-preview 1.png"
            alt="AllConnected"
            className="z-10 w-2/3"
          />
          <div className="absolute inset-0" style={{
            backgroundImage: "linear-gradient(rgba(7, 89, 133, 0.2), rgba(7, 89, 133, 0.2)), url('/background2.png'), url('/background2.2.png')",
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            height: '100%',
            width: '100%',
          }} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignIn;
