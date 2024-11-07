'use client'

import { useState, useEffect } from 'react'
import AdminOrganizationsDashboard from '@/components/dashboard/organizations/AdminOrganizationsDashboard'
import { CreateOrganizationButton } from '@/components/organization/CreateOrganizationButton'
import SearchInput from '@/components/shared/search-input'
import { getOrganizations } from '@/lib/api/organizations'
import { Organizations } from '@/types/organizations'
import { toast } from 'sonner'

export default function AdminOrganizations() {
  const [organizations, setOrganizations] = useState<Organizations[]>([])
  const [filteredOrganizations, setFilteredOrganizations] = useState<
    Organizations[]
  >([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const data = await getOrganizations()
        setOrganizations(data)
        setFilteredOrganizations(data)
        setError(null)
      } catch (error) {
        console.error('Error fetching organizations:', error)
        setError('Failed to load organizations. Please try again later.')
        toast.error('Failed to load organizations')
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrganizations()
  }, [])

  useEffect(() => {
    const filtered = organizations.filter((organization) =>
      organization.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredOrganizations(filtered)
  }, [searchTerm, organizations])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
  }

  const handleOrganizationCreated = (newOrganization: Organizations) => {
    setOrganizations((prevOrganizations) => [
      ...prevOrganizations,
      newOrganization
    ])
    setFilteredOrganizations((prevFiltered) => [
      ...prevFiltered,
      newOrganization
    ])
    toast.success('Organization created successfully')
  }

  const handleOrganizationUpdated = (updatedOrganization: Organizations) => {
    setOrganizations((prevOrganizations) =>
      prevOrganizations.map((org) =>
        org.id_organization === updatedOrganization.id_organization
          ? updatedOrganization
          : org
      )
    )
    setFilteredOrganizations((prevFiltered) =>
      prevFiltered.map((org) =>
        org.id_organization === updatedOrganization.id_organization
          ? updatedOrganization
          : org
      )
    )
    toast.success('Organization updated successfully')
  }

  const handleOrganizationDeleted = (organizationId: string) => {
    setOrganizations((prevOrganizations) =>
      prevOrganizations.filter((org) => org.id_organization !== organizationId)
    )
    setFilteredOrganizations((prevFiltered) =>
      prevFiltered.filter((org) => org.id_organization !== organizationId)
    )
    toast.success('Organization deleted successfully')
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Organizaciones</h1>
      <div className="flex justify-between items-center mb-4">
        <SearchInput
          className="w-1/3"
          paramName="name"
          placeholder="Buscar por nombre..."
          onChange={handleSearch}
          value={searchTerm}
        />
        <CreateOrganizationButton
          onOrganizationCreated={handleOrganizationCreated}
        />
      </div>
      <AdminOrganizationsDashboard
        organizations={filteredOrganizations}
        onOrganizationUpdated={handleOrganizationUpdated}
        onOrganizationDeleted={handleOrganizationDeleted}
      />
    </div>
  )
}
