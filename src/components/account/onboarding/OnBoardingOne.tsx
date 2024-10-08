'use client'
import React from 'react'
import Footer from '@/components/layout/FooterApp'
import Image from 'next/image'

const OnboardingOne = () => {
  const handleNextClick = () => {
    window.location.href = '/sign-up/OnBoarding2'
  }

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
                Paso 1 de 2
              </h3>
              <div className="w-full h-4 bg-gray-200 rounded-full mt-4">
                <div className="h-full bg-[#7DD3FC] rounded-full w-1/2"></div>
              </div>
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-[#2597BE] mb-0">
                Bienvenido
              </h1>
              <p className="text-lg text-gray-700 mb-12">
                En All Connected es muy importante conocer tus aspiraciones y
                metas, por favor continúa para saber más sobre ti.
              </p>
            </div>

            <div className="flex justify-center">
              <Image
                src="/OnBoarding.png"
                alt="Onboarding"
                className="w-full md:w-2/4"
                width={500}
                height={500}
              />
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <button
              className="bg-[#0284C7] text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              onClick={handleNextClick}
            >
              Siguiente
            </button>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  )
}

export default OnboardingOne
