// components/SignUp.tsx
'use client'

import React, { useState, useEffect } from 'react'
import NavBar from '@/components/ui-own/NavBar'
import Footer from '@/components/layout/FooterApp'
import { createUser } from '@/services/userService'
import { useRouter } from 'next/navigation'
import { User } from '@/types/users/user'

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    password: '',
    confirmPassword: '',
    mail: '',
    photo: undefined as File | undefined,
    roles: ['customer']
  })

  
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false) // Estado de carga
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = sessionStorage.getItem('user')
      if (storedUser) {
        router.push('/my-business')
      }
    }
  }, [router])
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({
        ...formData,
        photo: e.target.files[0]
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validación de campos obligatorios
    if (
      !formData.fullname ||
      !formData.username ||
      !formData.mail ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError('Por favor completa todos los campos.')
      return
    }

    // Validación de coincidencia de contraseñas
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    const formPayload = new FormData()
    formPayload.append('fullname', formData.fullname)
    formPayload.append('username', formData.username)
    formPayload.append('password', formData.password)
    formPayload.append('mail', formData.mail)

    if (formData.photo) {
      formPayload.append('photo', formData.photo)
    }

    formPayload.append('roles', 'customer')

    setIsLoading(true) // Activar el estado de carga
    setError(null) // Limpiar errores antes de la solicitud

    try {
      setUser(await createUser(formPayload))
      sessionStorage.setItem('id-user', user?.id_user || '')
      sessionStorage.setItem('user', JSON.stringify(user))
      router.push('/sign-up/OnBoarding')
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Error al crear la cuenta. Inténtalo de nuevo.'
      )
    } finally {
      setIsLoading(false) // Desactivar el estado de carga después de la respuesta
    }
  }

  return (
    <div>
      <NavBar />
      <div
        className="background-section relative py-10"
        style={{ backgroundColor: '#075985', borderRadius: '15px' }}
      >
        <div className="text-center pt-12 pb-24">
          <h1 className="text-4xl font-bold text-white">
            Bienvenido a All Connected
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
          Regístrate
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Nombre</label>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleInputChange}
                placeholder="Tu nombre completo"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700">Nombre de usuario</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Tu nombre de usuario"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700">Correo Electrónico</label>
              <input
                type="email"
                name="mail"
                value={formData.mail}
                onChange={handleInputChange}
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
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Tu contraseña"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirma tu contraseña"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700">
              Foto de Perfil (Opcional)
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
            />
          </div>
          <div className="text-center mt-6">
            <button
              type="submit"
              className={`w-full bg-[#0284C7] text-white font-semibold py-2 px-4 rounded-lg ${isLoading ? 'cursor-not-allowed opacity-50' : 'hover:bg-blue-700'}`}
              disabled={isLoading} // Desactivar el botón cuando está en modo de carga
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                  Creando cuenta...
                </div>
              ) : (
                'Crear Cuenta'
              )}
            </button>
          </div>
        </form>
        <p className="text-center mt-4 text-sm">
          ¿Ya tienes una cuenta?{' '}
          <a href="/sign-in" style={{ color: '#0369A1' }}>
            Inicia Sesión
          </a>
        </p>
      </div>
      <Footer />
    </div>
  )
}

export default SignUp
