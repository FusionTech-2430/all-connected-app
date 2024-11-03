'use client'

import { useEffect, useState } from 'react'
import AdminBusinessDashboard from '@/components/dashboard/businesses/AdminBusinessDashboard'
import SearchInput from '@/components/shared/search-input'
import { getBusinesses } from '@/lib/api/business'
import { Business } from '@/types/business'

export default function AdminBusiness() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchBusinesses = async () => {
    try {
      const data = await getBusinesses()
      setBusinesses(data)
      setFilteredBusinesses(data)
    } catch (error) {
      console.error('Error fetching businesses:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBusinesses()
  }, [])

  useEffect(() => {
    const filtered = businesses.filter((business) =>
      business.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredBusinesses(filtered)
  }, [searchTerm, businesses])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Gestión de emprendimiento</h1>
        <div className="flex justify-between items-center mb-1">
          <SearchInput
            className="w-1/3"
            paramName="name"
            placeholder="Buscar por nombre..."
            onChange={handleSearch}
            value={searchTerm}
          />
        </div>
      </div>
      <AdminBusinessDashboard
        businesses={filteredBusinesses}
        onBusinessUpdated={(updatedBusiness) => {
          setBusinesses((prevBusinesses) =>
            prevBusinesses.map((b) =>
              b.id_business === updatedBusiness.id_business
                ? updatedBusiness
                : b
            )
          )
        }}
        onBusinessDeleted={(businessId) => {
          setBusinesses((prevBusinesses) =>
            prevBusinesses.filter((b) => b.id_business !== businessId)
          )
        }}
      />
    </>
  )
}
