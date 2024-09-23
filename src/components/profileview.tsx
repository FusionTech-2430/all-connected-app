"use-client";
import React from 'react';

export default function Component() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Contenedor general */}
      <div className="w-full flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-4">
        
        {/* Sección Izquierda */}
        <div className="w-full md:w-1/2">
  <h1 className="text-3xl font-bold" style={{ color: '#0C4A6E', marginBottom: '12px' }}>Mis Ajustes</h1>
  <h2 className="text-2xl font-bold" style={{ color: '#0C4A6E' }}>Mi Perfil</h2>
  <p className="text-sm text-gray-500">Tu información personal y tus ajustes de seguridad de la cuenta.</p>
</div>


        {/* Sección Derecha */}
        <div className="w-full md:w-3/5 space-y-4">
          <div className="flex flex-col items-start space-y-2 mt-12">
            <label className="block text-gray-700 font-bold" style={{ color: '#0C4A6E' }}>Avatar</label>
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">SS</div>
          </div>
          <div>
            <label className="block text-gray-700 font-bold" style={{ color: '#0C4A6E' }}>Nombre Completo</label>
            <input
              type="text"
              className="w-3/5 border border-gray-300 rounded-lg p-2"
              value="Sara Valentina Sierra Escobar"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold" style={{ color: '#0C4A6E' }}>Usuario</label>
            <input
              type="text"
              className="w-3/5 border border-gray-300 rounded-lg p-2"
              value="valesco_1001"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold" style={{ color: '#0C4A6E' }}>Correo Electrónico</label>
            <input
              type="email"
              className="w-3/5 border border-gray-300 rounded-lg p-2"
              value="svalentinasierra@javeriana.edu.co"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold" style={{ color: '#0C4A6E' }}>Contraseña</label>
            <input
              type="password"
              className="w-3/5 border border-gray-300 rounded-lg p-2"
              placeholder="Introduce una nueva contraseña"
            />
          </div>
          <div className="flex justify-end">
            <button className="bg-[#0284C7] text-white py-2 px-4 rounded-lg hover:bg-blue-700">
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>

      {/* Zona Peligrosa */}
      <div className="w-full mt-16 flex justify-between items-center">
        <div>
          <h3 className="text-red-600 font-semibold">Zona Peligrosa</h3>
          <p className="text-sm text-gray-500">Cierra todas las sesiones activas.</p>
        </div>
        <button className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700">
          Eliminar Cuenta
        </button>
      </div>
    </div>
  );
}
