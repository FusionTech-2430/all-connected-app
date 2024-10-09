'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Eye, Trash2, MoreVertical, Upload } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

interface Business {
  id_business: string
  name: string
  organizations: string[]
  owner_id: string
  logo_url: string
}

interface Member {
  id: {
    idUser: string
    idBusiness: string
  }
  idBusiness: {
    name: string
    owner_id: string
    organization: string
  }
  joinDate: string
}

interface User {
  id_user: string
  fullname: string
  username: string
  mail: string
  photo_url: string
  roles: string[]
  organizations: string[] | null
  active: boolean
}

interface Ally extends User {
  joinDate: string
  isOwner?: boolean
}

export default function BusinessDashboard() {
  const [business, setBusiness] = useState<Business | null>(null)
  const [allies, setAllies] = useState<Ally[]>([])
  const [filteredAllies, setFilteredAllies] = useState<Ally[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isOwnershipModalOpen, setIsOwnershipModalOpen] = useState(false)
  const [isAddAllyModalOpen, setIsAddAllyModalOpen] = useState(false)
  const [isViewAllyModalOpen, setIsViewAllyModalOpen] = useState(false)
  const [isDeleteAllyModalOpen, setIsDeleteAllyModalOpen] = useState(false)
  const [isChangeImageModalOpen, setIsChangeImageModalOpen] = useState(false)
  const [selectedAlly, setSelectedAlly] = useState<Ally | null>(null)
  const [newOwner, setNewOwner] = useState('')
  const [temporaryToken, setTemporaryToken] = useState('')
  const [tokenError, setTokenError] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        const response = await fetch(`${API_URL}/businesses-service/api/v1/businesses/2ebec1f5-5473-4c52-ad85-27c09fb0e83f`)
        if (!response.ok) {
          throw new Error('Failed to fetch business data')
        }
        const data = await response.json()
        setBusiness(data)
        return data
      } catch (err) {
        setError('Error al cargar la información del negocio')
        console.error(err)
      }
    }

    const fetchAlliesData = async (businessData: Business) => {
      try {
        const membersResponse = await fetch(`${API_URL}/businesses-service/api/v1/businesses/${businessData.id_business}/members`)
        if (!membersResponse.ok) {
          throw new Error('Failed to fetch members data')
        }
        const membersData: Member[] = await membersResponse.json()

        const alliesPromises = membersData.map(async (member) => {
          const userResponse = await fetch(`${API_URL}/users-service/api/v1/users/${member.id.idUser}`)
          if (!userResponse.ok) {
            throw new Error(`Failed to fetch user data for ${member.id.idUser}`)
          }
          const userData: User = await userResponse.json()
          return { 
            ...userData, 
            joinDate: member.joinDate,
            isOwner: member.id.idUser === businessData.owner_id
          }
        })

        const alliesData = await Promise.all(alliesPromises)
        
        // Ensure owner is in the list
        if (!alliesData.some(ally => ally.id_user === businessData.owner_id)) {
          const ownerResponse = await fetch(`${API_URL}/users-service/api/v1/users/${businessData.owner_id}`)
          if (ownerResponse.ok) {
            const ownerData: User = await ownerResponse.json()
            alliesData.push({
              ...ownerData,
              joinDate: new Date().toISOString(), // Use current date as join date for owner
              isOwner: true
            })
          }
        }

        setAllies(alliesData)
        setFilteredAllies(alliesData)
      } catch (err) {
        setError('Error al cargar la información de los aliados')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBusinessData().then(businessData => {
      if (businessData) {
        fetchAlliesData(businessData)
      }
    })
  }, [])

  const filterAllies = useCallback(() => {
    const filtered = allies.filter(
      (ally) =>
        ally.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ally.mail.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredAllies(filtered)
  }, [allies, searchTerm])

  useEffect(() => {
    filterAllies()
  }, [filterAllies, searchTerm])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const openViewAllyModal = (ally: Ally) => {
    setSelectedAlly(ally)
    setIsViewAllyModalOpen(true)
  }

  const openDeleteAllyModal = (ally: Ally) => {
    setSelectedAlly(ally)
    setIsDeleteAllyModalOpen(true)
  }

  const deleteAlly = async () => {
    if (selectedAlly && business) {
      try {
        const response = await fetch(`${API_URL}/businesses-service/api/v1/businesses/${business.id_business}/members/${selectedAlly.id_user}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            // Asegúrate de incluir aquí cualquier token de autenticación necesario
            // 'Authorization': `Bearer ${yourAuthToken}`
          },
        });
  
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(`Failed to delete ally: ${response.status} ${response.statusText}${errorData ? ` - ${JSON.stringify(errorData)}` : ''}`);
        }
  
        // Si la eliminación fue exitosa, actualizamos el estado local
        const updatedAllies = allies.filter((a) => a.id_user !== selectedAlly.id_user);
        setAllies(updatedAllies);
        setFilteredAllies(updatedAllies);
        setIsDeleteAllyModalOpen(false);
      } catch (error) {
        console.error('Error deleting ally:', error);
        // Aquí mostramos un mensaje de error más detallado
        setError(`Error al eliminar al aliado: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  const transferOwnership = async () => {
    if (business && newOwner) {
      try {
        const response = await fetch(`${API_URL}/businesses-service/api/v1/businesses/${business.id_business}/members/${newOwner}/owner-requests`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Asegúrate de incluir aquí cualquier token de autenticación necesario
            // 'Authorization': `Bearer ${yourAuthToken}`
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(`Failed to transfer ownership: ${response.status} ${response.statusText}${errorData ? ` - ${JSON.stringify(errorData)}` : ''}`);
        }

        // Actualizar el estado local
        const updatedAllies = allies.map(ally => ({
          ...ally,
          isOwner: ally.id_user === newOwner
        }));
        setAllies(updatedAllies);
        setFilteredAllies(updatedAllies);
        setBusiness({
          ...business,
          owner_id: newOwner
        });
        setIsOwnershipModalOpen(false);
        setNewOwner('');
      } catch (error) {
        console.error('Error transferring ownership:', error);
        setError(`Error al transferir la propiedad: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  const generateToken = async () => {
    if (!business) {
      setTokenError('No se pudo generar el token: información del negocio no disponible')
      return
    }

    try {
      const response = await fetch(`${API_URL}/businesses-service/api/v1/businesses/${business.id_business}/join-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any necessary authentication headers here
        },
      })

      const data = await response.json()

      if (data.code === 200) {
        setTemporaryToken(data.message)
        setTokenError(null)
      } else {
        setTokenError(`Error al generar el token: ${data.message}`)
        setTemporaryToken('')
      }
    } catch (error) {
      console.error('Error generating token:', error)
      setTokenError('Error al generar el token. Por favor, inténtelo de nuevo.')
      setTemporaryToken('')
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedImage(file)
        setPreviewUrl(URL.createObjectURL(file))
        setImageError(null)
      } else {
        setImageError('El archivo seleccionado no es una imagen. Por favor, seleccione una imagen.')
        setSelectedImage(null)
        setPreviewUrl(null)
      }
    }
  }

  const handleImageUpload = async () => {
    if (selectedImage && business) {
      const formData = new FormData()
      formData.append('logo_url', selectedImage)

      try {
        const response = await fetch(`${API_URL}/businesses-service/api/v1/businesses/${business.id_business}`, {
          method: 'PUT',
          body: formData,
          // Asegúrate de incluir aquí cualquier token de autenticación necesario
          // headers: {
          //   'Authorization': `Bearer ${yourAuthToken}`
          // },
        })

        if (!response.ok) {
          throw new Error('Failed to update business logo')
        }

        const updatedBusiness = await response.json()
        setBusiness(updatedBusiness)
        setIsChangeImageModalOpen(false)
        setSelectedImage(null)
        setPreviewUrl(null)
      } catch (error) {
        console.error('Error updating business logo:', error)
        setError('Error al actualizar el logo del negocio')
      }
    }
  }

  if (error) {
    return <div className="container mx-auto p-6">{error}</div>
  }

  if (isLoading || !business) {
    return <div className="container mx-auto p-6">Cargando...</div>
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Mi Emprendimiento</h1>

      <div className="bg-blue-50 p-4 rounded-lg flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Avatar className="w-12 h-12">
            <img
              src={business.logo_url}
              alt={`${business.name} logo`}
              className="w-full h-full object-cover"
            />
          </Avatar>
          <div>
            <h2 className="font-semibold">{business.name}</h2>
            <p className="text-sm text-gray-500">ID: {business.id_business}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setIsChangeImageModalOpen(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Cambiar imagen
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsOwnershipModalOpen(true)}
          >
            Ceder título propietario
          </Button>
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-4">Gestión de aliados</h3>

      <div className="flex space-x-4 mb-4">
        <Input
          className="flex-grow"
          placeholder="Buscar por nombre o correo..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Button onClick={() => setIsAddAllyModalOpen(true)}>
          Añadir Aliado
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Fecha de unión</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAllies.map((ally) => (
            <TableRow key={ally.id_user}>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <img src={ally.photo_url} alt={ally.fullname} className="w-full h-full object-cover" />
                  </Avatar>
                  <div>
                    <p>{ally.fullname} {ally.isOwner && <span className="text-sm font-normal text-gray-500">(Propietario)</span>}</p>
                    <p className="text-sm text-gray-500">{ally.mail}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{new Date(ally.joinDate).toLocaleDateString()}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => openViewAllyModal(ally)}>
                      <Eye className="mr-2 h-4 w-4 text-blue-500" />
                      Visualizar
                    </DropdownMenuItem>
                    {!ally.isOwner && (
                      <DropdownMenuItem onClick={() => openDeleteAllyModal(ally)}>
                        <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                        Eliminar
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4">
        <p className="text-sm text-gray-500">Total: {filteredAllies.length} aliados.</p>
      </div>

      {/* Ownership Transfer Modal */}
      <Dialog
        open={isOwnershipModalOpen}
        onOpenChange={setIsOwnershipModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ceder título de propietario</DialogTitle>
            <DialogDescription>
              Seleccione el nuevo propietario del emprendimiento.
            </DialogDescription>
          </DialogHeader>
          <Select value={newOwner} onValueChange={setNewOwner}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione un aliado" />
            </SelectTrigger>
            <SelectContent>
              {allies.filter(ally => !ally.isOwner).map((ally) => (
                <SelectItem key={ally.id_user} value={ally.id_user}>
                  {ally.fullname}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button onClick={transferOwnership} disabled={!newOwner}>
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Ally Modal */}
      {/* Add Ally Modal */}
      <Dialog open={isAddAllyModalOpen} onOpenChange={setIsAddAllyModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Añadir Aliado</DialogTitle>
            <DialogDescription>
              Genere un token temporal para invitar a un nuevo aliado.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={generateToken} disabled={!business}>
            Generar y enviar un token
          </Button>
          {temporaryToken && (
            <Alert>
              <AlertTitle>Token generado exitosamente</AlertTitle>
              <AlertDescription>
                <p className="mt-2 font-mono bg-gray-100 p-2 rounded">
                  {temporaryToken}
                </p>
                <Button
                  onClick={() => navigator.clipboard.writeText(temporaryToken)}
                  className="mt-2"
                  variant="outline"
                >
                  Copiar Token
                </Button>
              </AlertDescription>
            </Alert>
          )}
          {tokenError && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{tokenError}</AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cerrar</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Ally Modal */}
      <Dialog open={isViewAllyModalOpen} onOpenChange={setIsViewAllyModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Información del Aliado</DialogTitle>
          </DialogHeader>
          {selectedAlly && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  {selectedAlly.photo_url ? (
                    <img 
                      src={selectedAlly.photo_url} 
                      alt={`Foto de ${selectedAlly.fullname}`} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl">{selectedAlly.fullname.charAt(0)}</span>
                  )}
                </Avatar>
                <div>
                  <p className="font-semibold text-lg">
                    {selectedAlly.fullname}
                    {selectedAlly.isOwner && <span className="ml-2 text-sm font-normal text-gray-500">(Propietario)</span>}
                  </p>
                  <p className="text-sm text-gray-500">{selectedAlly.username}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="font-semibold">Email:</p>
                  <p className="break-all">{selectedAlly.mail}</p>
                </div>
                <div>
                  <p className="font-semibold">Fecha de unión:</p>
                  <p>{new Date(selectedAlly.joinDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="font-semibold">Roles:</p>
                  <p>{selectedAlly.roles.join(', ')}</p>
                </div>
                <div>
                  <p className="font-semibold">Estado:</p>
                  <p>{selectedAlly.active ? 'Activo' : 'Inactivo'}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cerrar</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Ally Modal */}
      <Dialog
        open={isDeleteAllyModalOpen}
        onOpenChange={setIsDeleteAllyModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Aliado</DialogTitle>
            <DialogDescription>
              ¿Está seguro de que desea eliminar a este aliado?
            </DialogDescription>
          </DialogHeader>
          {selectedAlly && <p>Aliado a eliminar: {selectedAlly.fullname}</p>}
          {error && <p className="text-red-500">{error}</p>}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteAllyModalOpen(false);
                setError(null);
              }}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={deleteAlly}>
              Confirmar Eliminación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Image Modal */}
      <Dialog open={isChangeImageModalOpen} onOpenChange={setIsChangeImageModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cambiar imagen del negocio</DialogTitle>
            <DialogDescription>
              Seleccione una nueva imagen para su negocio.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Button onClick={() => fileInputRef.current?.click()}>
              Seleccionar imagen desde los archivos
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              style={{ display: 'none' }}
            />
            {imageError && <p className="text-red-500">{imageError}</p>}
            {previewUrl && (
              <div className="mt-4">
                <img src={previewUrl} alt="Preview" className="max-w-full h-auto" />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsChangeImageModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleImageUpload} disabled={!selectedImage}>
              Confirmar cambio de imagen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}