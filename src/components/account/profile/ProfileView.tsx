'use client'

import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { type UserUpdate } from '@/types/users/user'
import { useRouter } from 'next/navigation'
import { updateUser } from '@/services/userService'
import { useUserId } from '@/hooks/use-user-id'
import { deleteUser, getUser } from '@/lib/actions/users'

function getInitials(name: string): string {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((word) => word.toUpperCase()[0])
    .join('')
  return initials.toUpperCase()
}

export default function ProfileView() {
  const router = useRouter()
  const userId = useUserId()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [profile, setProfile] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    photo_url: ''
  })
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)

  // Fetch user data from the API
  useEffect(() => {
    const getUserData = async () => {
      const user = await getUser(userId || '')
      setProfile({
        fullName: user.fullname,
        username: user.username,
        email: user.mail,
        password: '',
        photo_url: user.photo_url
      })
    }
    getUserData()
  }, [userId])

  if (!userId) {
    router.push('/')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfile({
      ...profile,
      [name]: value
    })
  }

  const handleDelete = async () => {
    await deleteUser(userId || '')
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Form submitted:', profile)

    const updatedUser: UserUpdate = {
      fullname: profile.fullName,
      username: profile.username,
      mail: profile.email,
      password: profile.password,
      photo: file ? file : undefined
    }

    console.log('Updated user object:', updatedUser)

    const formPayload = new FormData()
    formPayload.append('fullname', updatedUser.fullname)
    formPayload.append('username', updatedUser.username)
    formPayload.append('mail', updatedUser.mail)
    if (updatedUser.password !== '') {
      formPayload.append('password', updatedUser.password)
    }
    if (updatedUser.photo != undefined) {
      console.log('Se va a actualizar la foto')
      formPayload.append('photo', updatedUser.photo)
    }

    const newUser = await updateUser(userId || '', formPayload)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('user', JSON.stringify(newUser))
    }
    router.push('/profile')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Contenedor general */}
      <div className="w-full flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-4">
        {/* Sección Izquierda */}
        <div className="w-full md:w-1/2">
          <h1
            className="text-3xl font-bold"
            style={{ color: '#0C4A6E', marginBottom: '12px' }}
          >
            Mis Ajustes
          </h1>
          <h2 className="text-2xl font-bold" style={{ color: '#0C4A6E' }}>
            Mi Perfil
          </h2>
          <p className="text-sm text-gray-500">
            Tu información personal y tus ajustes de seguridad de la cuenta.
          </p>
        </div>

        {/* Sección Derecha */}
        <div className="w-full md:w-3/5 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col items-start space-y-2 mt-12">
              <label
                className="block text-gray-700 font-bold"
                style={{ color: '#0C4A6E' }}
              >
                Avatar
              </label>
              <Button
                variant="ghost"
                size="default"
                className="p-0 h-auto"
                onClick={() => fileInputRef.current?.click()}
              >
                <Avatar className="w-28 h-28">
                  {previewUrl || profile.photo_url ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={previewUrl || profile.photo_url}
                        alt="User Avatar"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-full"
                      />
                    </div>
                  ) : (
                    <AvatarFallback className="text-4xl">
                      {getInitials(profile.fullName)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <span className="sr-only">Change avatar</span>
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
            <div>
              <label
                className="block text-gray-700 font-bold"
                style={{ color: '#0C4A6E' }}
              >
                Nombre Completo
              </label>
              <input
                type="text"
                name="fullName"
                className="w-full md:w-3/5 border border-gray-300 rounded-lg p-2"
                value={profile.fullName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                className="block text-gray-700 font-bold"
                style={{ color: '#0C4A6E' }}
              >
                Usuario
              </label>
              <input
                type="text"
                name="username"
                className="w-full md:w-3/5 border border-gray-300 rounded-lg p-2"
                value={profile.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                className="block text-gray-700 font-bold"
                style={{ color: '#0C4A6E' }}
              >
                Correo Electrónico
              </label>
              <input
                type="email"
                name="email"
                className="w-full md:w-3/5 border border-gray-300 rounded-lg p-2"
                value={profile.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                className="block text-gray-700 font-bold"
                style={{ color: '#0C4A6E' }}
              >
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                className="w-full md:w-3/5 border border-gray-300 rounded-lg p-2"
                value={profile.password}
                onChange={handleChange}
                placeholder="Introduce una nueva contraseña"
              />
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-[#0284C7] text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                Guardar Cambios
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Zona Peligrosa */}
      <div className="w-full mt-16 flex justify-between items-center">
        <div>
          <h3 className="text-red-600 font-semibold">Zona Peligrosa</h3>
          <p className="text-sm text-gray-500">
            Cierra todas las sesiones activas.
          </p>
        </div>
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
        >
          Eliminar Cuenta
        </button>
      </div>
    </div>
  )
}
