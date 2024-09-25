'use client'

import React from 'react'
import NavBar from '@/components/NavBar'
import Footer from '@/components/FooterApp'
import { Upload } from 'lucide-react'

const BusinessCreation = () => {
  return (
    <div>
      <NavBar />
      <div
        className="background-section relative py-10"
        style={{ backgroundColor: '#075985', borderRadius: '15px' }}
      >
        <div className="text-center pt-12 pb-24">
          <h1 className="text-4xl font-bold text-white">
            Crea tu emprendimiento
          </h1>
          <p className="text-white mt-2">
            All Connected Marketplace: Conecta, emprende y descubre en una
            comunidad universitaria llena de oportunidades.
          </p>
        </div>
      </div>

      <div className="form-section mx-auto shadow-lg relative z-10 bg-white p-8 rounded-lg -mt-10 w-full max-w-4xl">
        <h2
          className="text-2xl font-semibold text-center mb-6"
          style={{ color: '#0369A1' }}
        >
          Registra tu empredimiento
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Ingresa todos tus datos
        </p>
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Nombre</label>
              <input
                type="text"
                placeholder="Nombre del empredimiento"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700">Dueño</label>
              <input
                type="email"
                placeholder="Nombre del dueño del emprendimiento"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Foto</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Subir foto o logo de la empresa</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="w-full bg-[#0284C7] text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700"
            onClick={() => (window.location.href = '/my-business')}
          >
            Crear empredimiento
          </button>
        </form>
      </div>
      <Footer />
    </div>
  )
}

export default BusinessCreation
