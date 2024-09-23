"use client";

import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/FooterApp';

const SignUp = () => {
  return (
    <div>
      <NavBar />
      <div className="background-section relative py-10" style={{ backgroundColor: '#075985', borderRadius: '15px' }}>
        <div className="text-center pt-12 pb-24">
          <h1 className="text-4xl font-bold text-white">Bienvenido a All Connected</h1>
          <p className="text-white mt-2">
            All Connected Marketplace: Conecta, emprende y descubre en una comunidad universitaria llena de oportunidades.
          </p>
        </div>
      </div>

      <div className="form-section mx-auto shadow-lg relative z-10 bg-white p-8 rounded-lg -mt-10 w-full max-w-4xl">
        <h2 className="text-2xl font-semibold text-center mb-6" style={{ color: '#0369A1' }}>Regístrate</h2>
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Nombre</label>
              <input
                type="text"
                placeholder="Tu nombre completo"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700">Correo Electrónico</label>
              <input
                type="email"
                placeholder="Tu dirección de correo electrónico"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Contraseña</label>
              <input
                type="password"
                placeholder="Tu contraseña"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700">Confirmar Contraseña</label>
              <input
                type="password"
                placeholder="Confirma tu contraseña"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700">Organización</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none">
              <option value="">Selecciona tu organización</option>
            </select>
          </div>
          <div className="text-center mt-6">
          <button
  type="button"
  className="w-full bg-[#0284C7] text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700"
  onClick={() => (window.location.href = '/sign-up/OnBoarding')}
>
  Crear Cuenta
</button>
          </div>
        </form>
        <p className="text-center mt-4 text-sm">
          ¿Ya tienes una cuenta? <a href="/sign-in" style={{ color: '#0369A1' }}>Inicia Sesión</a>
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default SignUp;
