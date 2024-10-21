'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

interface Business {
  id_business: string
  name: string
  organizations: string[]
  owner_id: string
  logo_url: string | null
}

export default function BusinessList() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBusinesses()
  }, [])

  const fetchBusinesses = async () => {
    try {
      const response = await fetch(`${API_URL}/businesses-service/api/v1/businesses`)
      if (!response.ok) {
        throw new Error('Failed to fetch businesses')
      }
      const data = await response.json()
      setBusinesses(data)
      setIsLoading(false)
    } catch (err) {
      console.error('Error fetching businesses:', err)
      setError('Error al cargar los emprendimientos')
      setIsLoading(false)
      toast({
        title: "Error",
        description: "No se pudieron cargar los emprendimientos",
        variant: "destructive",
      })
    }
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Mis Emprendimientos</h1>
        <Link href="/business-creation">
          <Button>Crear Emprendimiento</Button>
        </Link>
      </div>
      {businesses.length === 0 ? (
        <p className="text-center text-gray-500">No tienes emprendimientos registrados.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((business) => (
            <Link href={`/my-business`} key={business.id_business} className="block">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={business.logo_url || undefined} alt={business.name} />
                      <AvatarFallback>{business.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{business.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">ID: {business.id_business}</p>
                  <p className="text-sm text-gray-500">Organizaciones: {business.organizations.length}</p>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-blue-600">Ver dashboard →</p>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}