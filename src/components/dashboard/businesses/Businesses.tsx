'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Loader2, Plus } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { useUserId } from '@/hooks/use-user-id'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

interface Business {
  id_business: string
  name: string
  organizations: string[]
  owner_id: string
  logo_url: string | null
}

export default function BusinessList() {
  const router = useRouter()
  const [ownedBusinesses, setOwnedBusinesses] = useState<Business[]>([])
  const [memberBusinesses, setMemberBusinesses] = useState<Business[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const userId = useUserId()

  if (!userId) {
    router.push('/')
  }

  useEffect(() => {
    if (userId) {
      fetchBusinesses()
    }
  }, [userId])

  const fetchBusinesses = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const [ownedResponse, memberResponse] = await Promise.all([
        fetch(
          `${API_URL}/businesses-service/api/v1/businesses/owner/${userId}`
        ),
        fetch(
          `${API_URL}/businesses-service/api/v1/businesses/member/${userId}`
        )
      ])

      if (!ownedResponse.ok || !memberResponse.ok) {
        throw new Error('Failed to fetch businesses')
      }

      const ownedData = await ownedResponse.json()
      const memberData = await memberResponse.json()

      setOwnedBusinesses(ownedData)
      setMemberBusinesses(memberData)
    } catch (err) {
      console.error('Error fetching businesses:', err)
      setError('Error al cargar los emprendimientos')
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los emprendimientos',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewDashboard = (businessId: string) => {
    sessionStorage.setItem('currentBusinessId', businessId)
    router.push('/my-business')
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Error</h1>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Mis Emprendimientos</h1>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Emprendimientos propios</h2>
        <Link href="/business-creation">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Crear Emprendimiento
          </Button>
        </Link>
      </div>

      {(ownedBusinesses.length === 0 && memberBusinesses.length === 0) && (
        <div className="text-center">
          <Image
            src="/noMiembros.png"
            alt="No tienes emprendimientos"
            width={200}
            height={200}
            className="mx-auto mb-4"
          />
          <p className="text-xl text-gray-600">
            Aún no eres miembro de ningún emprendimiento.
          </p>
        </div>
      )}

      {ownedBusinesses.length === 0 ? (
        <p className="text-center text-gray-500 mb-8">
          No tienes emprendimientos propios registrados.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {ownedBusinesses.map((business) => (
            <Card
              key={business.id_business}
              className="hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader>
                <CardTitle className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage
                      src={business.logo_url || undefined}
                      alt={business.name}
                    />
                    <AvatarFallback>{business.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{business.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  ID: {business.id_business}
                </p>
                <p className="text-sm text-gray-500">
                  Organizaciones: {business.organizations.length}
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => handleViewDashboard(business.id_business)}
                >
                  Ver dashboard
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-4">
        Emprendimientos como miembro
      </h2>
      {memberBusinesses.length === 0 ? (
        <div className="text-center">
          <Image
            src="/noMiembros.png"
            alt="No eres miembro de ningún emprendimiento"
            width={500}
            height={500}
            className="mx-auto mb-4"
          />
          <p className="text-xl text-gray-600">
            Aún no eres miembro de ningún emprendimiento.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memberBusinesses.map((business) => (
            <Card
              key={business.id_business}
              className="hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader>
                <CardTitle className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage
                      src={business.logo_url || undefined}
                      alt={business.name}
                    />
                    <AvatarFallback>{business.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{business.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  ID: {business.id_business}
                </p>
                <p className="text-sm text-gray-500">
                  Organizaciones: {business.organizations.length}
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => handleViewDashboard(business.id_business)}
                >
                  Ver dashboard
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}