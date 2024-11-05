'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import NavBar from '@/components/ui-own/NavBar'
import Footer from '@/components/layout/FooterApp'
import { Upload } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { toast } from '@/components/ui/use-toast'
import { useUserId } from '@/hooks/use-user-id'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

interface Organization {
  id_organization: string
  name: string
}


const ServiceCreation = () => {
  const router = useRouter()
  const [name, setName] = useState('')
  const [selectedOrganization, setSelectedOrganization] = useState('')
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const userId = useUserId()

  useEffect(() => {
    fetchOrganizations()
  }, [])

  const fetchOrganizations = async () => {
    try {
      const response = await fetch(
        `${API_URL}/organizations-service/api/v1/organizations`
      )
      if (!response.ok) {
        throw new Error('Failed to fetch organizations')
      }
      const data = await response.json()
      setOrganizations(data)
    } catch (error) {
      console.error('Error fetching organizations:', error)
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las organizaciones',
        variant: 'destructive'
      })
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0]
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    if (!userId) {
      toast({
        title: 'Error',
        description: 'Usuario no autenticado',
        variant: 'destructive'
      })
      setIsLoading(false)
      return
    }

    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('owner_id', userId)
      formData.append('organization', selectedOrganization)
      if (file) {
        formData.append('logo_url', file)
      }

      const response = await fetch(
        `${API_URL}/businesses-service/api/v1/businesses`,
        {
          method: 'POST',
          body: formData
        }
      )

      if (!response.ok) {
        throw new Error('Failed to create business')
      }

      toast({
        title: 'Éxito',
        description: 'Emprendimiento creado correctamente'
      })
      router.push('/businesses')
    } catch (error) {
      console.error('Error creating business:', error)
      toast({
        title: 'Error',
        description: 'Error al crear el emprendimiento',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
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
          Registra tu emprendimiento
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Ingresa todos tus datos
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Nombre</label>
              <input
                type="text"
                placeholder="Nombre del emprendimiento"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Organización</label>
              <Select onValueChange={setSelectedOrganization} required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona una organización" />
                </SelectTrigger>
                <SelectContent>
                  {organizations.map((org) => (
                    <SelectItem
                      key={org.id_organization}
                      value={org.id_organization}
                    >
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="block text-gray-700">Logo</label>
            <div className="mt-1 flex flex-col items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              {previewUrl ? (
                <div className="mb-4">
                  <Image
                    src={previewUrl}
                    alt="Logo preview"
                    width={200}
                    height={200}
                    className="rounded-lg object-cover"
                  />
                </div>
              ) : (
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
              )}
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  <span>
                    {previewUrl
                      ? 'Cambiar logo'
                      : 'Subir foto o logo de la empresa'}
                  </span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </label>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-[#0284C7] text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Creando...' : 'Crear emprendimiento'}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  )
}

export default ServiceCreation
