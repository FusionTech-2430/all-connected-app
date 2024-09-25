'use client'
import React, { useState } from 'react'
import Footer from '@/components/FooterApp'
import Image from 'next/image'

const OnboardingTwo = () => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null)

  const handleCardClick = (card: string) => {
    setSelectedCard(card);
    if (card === 'bienes'){
      window.location.href = '/business-creation';
    }
  };

  return (
    <div>
      <div className="min-h-screen flex flex-col justify-between">
        <div className="w-full text-left p-4">
          <button className="text-[#0369A1] font-bold">← Back</button>
        </div>

        <div className="flex-grow flex flex-col justify-center px-8 md:px-16">
          <div className="w-full max-w-7xl mx-auto">
            <div className="mb-7">
              <h3 className="text-xl font-semibold text-[#7DD3FC]">
                Paso 2 de 2
              </h3>
              <div className="w-full h-4 bg-gray-200 rounded-full mt-4">
                <div className="h-full bg-[#7DD3FC] rounded-full w-full"></div>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-[#0C4A6E] mb-4">
              ¿Qué rol quieres tener primero?
            </h1>
            <p className="text-lg text-gray-700 mb-10">
              En All Connected puedes acceder a distintos roles, según tus
              necesidades y deseos. ¡No te preocupes, más adelante podrás
              agregar más roles!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-8">
              {/* Tarjeta 1 */}
              <div
                className={`bg-white shadow-md rounded-lg flex flex-col items-center p-6 text-center cursor-pointer transition-all hover:shadow-lg ${
                  selectedCard === 'bienes'
                    ? 'bg-blue-100 transform scale-105'
                    : 'opacity-90'
                }`}
                onClick={() => handleCardClick('bienes')}
              >
                <Image
                  src="/bienes.png"
                  alt="Emprendedor de Bienes"
                  width={128}
                  height={112}
                />
                <h3 className="text-lg font-semibold">Emprendedor de Bienes</h3>
                <p className="text-gray-600">
                  Crea tu emprendimiento, administra tu inventario, flujo de
                  caja y vende a tu segmento personalizado.
                </p>
              </div>

              {/* Tarjeta 2 */}
              <div
                className={`bg-white shadow-md rounded-lg flex flex-col items-center p-6 text-center cursor-pointer transition-all hover:shadow-lg ${
                  selectedCard === 'servicios'
                    ? 'bg-blue-100 transform scale-105'
                    : 'opacity-90'
                }`}
                onClick={() => handleCardClick('servicios')}
              >
                <Image
                  src="/servicios.png"
                  alt="Emprendedor de Servicios"
                  width={128}
                  height={128}
                />
                <h3 className="text-lg font-semibold">
                  Emprendedor de Servicios
                </h3>
                <p className="text-gray-600">
                  Crea tu emprendimiento, administra tu cronograma, flujo de
                  caja y ofrece tus servicios a segmentos personalizados.
                </p>
              </div>

              {/* Tarjeta 3 */}
              <div
                className={`bg-white shadow-md rounded-lg flex flex-col items-center p-6 text-center cursor-pointer transition-all hover:shadow-lg ${
                  selectedCard === 'eventos'
                    ? 'bg-blue-100 transform scale-105'
                    : 'opacity-90'
                }`}
                onClick={() => handleCardClick('eventos')}
              >
                <Image
                  src="/eventos.png"
                  alt="Organizador de Eventos"
                  width={128}
                  height={128}
                />
                <h3 className="text-lg font-semibold">
                  Organizador de Eventos
                </h3>
                <p className="text-gray-600">
                  Administra tus eventos, flujo de caja y comparte publicidad a
                  segmentos personalizados.
                </p>
              </div>

              {/* Tarjeta 4 */}
              <div
                className={`bg-white shadow-md rounded-lg flex flex-col items-center p-6 text-center cursor-pointer transition-all hover:shadow-lg ${
                  selectedCard === 'comprador'
                    ? 'bg-blue-100 transform scale-105'
                    : 'opacity-90'
                }`}
                onClick={() => handleCardClick('comprador')}
              >
                <Image
                  src="/comprador.png"
                  alt="Comprador"
                  width={128}
                  height={128}
                />
                <h3 className="text-lg font-semibold">Comprador</h3>
                <p className="text-gray-600">
                  Compra productos o servicios ofrecidos por otros usuarios de
                  AllConnected.
                </p>
              </div>

              {/* Tarjeta 5 */}
              <div
                className={`bg-white shadow-md rounded-lg flex flex-col items-center p-6 text-center cursor-pointer transition-all hover:shadow-lg ${
                  selectedCard === 'organizacion'
                    ? 'bg-blue-100 transform scale-105'
                    : 'opacity-90'
                }`}
                onClick={() => handleCardClick('organizacion')}
              >
                <Image
                  src="/organizaciones.png"
                  alt="Organización"
                  width={128}
                  height={128}
                />
                <h3 className="text-lg font-semibold">Organización</h3>
                <p className="text-gray-600">
                  Asocia tu organización y publica los anuncios más relevantes
                  para ti.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <button className="bg-[#0284C7] text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Siguiente
            </button>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  )
}

export default OnboardingTwo
