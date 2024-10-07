import React, { useEffect, useState } from 'react'
import NavBar from '@/components/ui-own/NavBar'
import Footer from '@/components/layout/FooterApp'
import Image from 'next/image'
import { signIn } from '@/lib/firebase/auth'
import { getAuth } from 'firebase/auth'

const SignIn = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    const auth = getAuth()
    console.log('Usuario autenticado:', auth.currentUser)
    if (auth.currentUser) {
      console.log('Usuario autenticado:', auth.currentUser.uid)
      window.location.href = '/my-business'
    } else {
      setIsLoading(false)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const user = await signIn(email, password)
      console.log('Usuario autenticado:', user)
      window.location.href = '/my-business'
    } catch (error) {
      setError('Error al iniciar sesión. Verifica tu correo y contraseña.')
      console.error('Error al iniciar sesión:', error)
    }
  } 

  if (isLoading) {
    return <div>Cargando...</div>
  }

  return (
    <div>
      <NavBar />
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
        {/* Sección de formulario */}
        <div className="flex flex-col justify-center px-8 md:px-16">
          <h1 className="text-3xl font-bold text-[#0369A1] mb-4">
            ¡Bienvenido de nuevo!
          </h1>
          <p className="text-gray-700 mb-8">
            Ingresa tu correo y contraseña para iniciar sesión
          </p>
          {error && <p className="text-red-500">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700">Correo</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Tu dirección de correo electrónico"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            ¿No tienes una cuenta?{' '}
            <a href="/sign-up" className="text-[#0369A1]">
              Regístrate
            </a>
          </p>
        </div>

        {/* Sección del banner */}
        <div className="relative bg-[#075985] flex justify-center items-center rounded-lg">
          <Image
            src="/Banner1-removebg-preview.png"
            alt="AllConnected"
            className="z-10 w-2/3"
            width={800}
            height={800}
          />

          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(7, 89, 133, 0.2), rgba(7, 89, 133, 0.2)), url('/background2.png'), url('/background2.2.png')",
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              height: '100%',
              width: '100%'
            }}
          />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default SignIn
