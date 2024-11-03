'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
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
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import { Business } from '@/types/business'
import { User } from '@/types/users/user'
import { getOrganizationById } from '@/lib/api/organizations'
import { getUser } from '@/lib/api/users'
import { DeleteButton } from '@/components/business/delete-business-button'
import { EditButton } from '@/components/business/edit-business-button'

interface AdminBusinessDashboardProps {
  businesses: Business[]
  onBusinessUpdated: (updatedBusiness: Business) => void
  onBusinessDeleted: (businessId: string) => void
}

export default function AdminBusinessDashboard({
  businesses,
  onBusinessUpdated,
  onBusinessDeleted
}: AdminBusinessDashboardProps) {
  const [organizations, setOrganizations] = useState<{ [key: string]: string }>(
    {}
  )
  const [owners, setOwners] = useState<{ [key: string]: User }>({})
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const totalPages = Math.ceil(businesses.length / itemsPerPage)

  const paginatedBusinesses = businesses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  useEffect(() => {
    const fetchData = async () => {
      const orgs: { [key: string]: string } = {}
      const ownersData: { [key: string]: User } = {}
      for (const business of businesses) {
        if (business.organizations) {
          for (const orgId of business.organizations) {
            if (!orgs[orgId]) {
              const organization = await getOrganizationById(orgId)
              orgs[orgId] = organization.name
            }
          }
        }
        if (!ownersData[business.owner_id]) {
          const owner = await getUser(business.owner_id)
          ownersData[business.owner_id] = owner
        }
      }
      setOrganizations(orgs)
      setOwners(ownersData)
      setIsLoading(false)
    }
    fetchData()
  }, [businesses])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Dueño</TableHead>
            <TableHead>Organización</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedBusinesses.map((business) => (
            <TableRow key={business.id_business}>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 relative flex-shrink-0">
                    <Image
                      src={business.logo_url || '/placeholder.svg'}
                      alt={`${business.name} logo`}
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                  <span>{business.name}</span>
                </div>
              </TableCell>
              <TableCell>
                {owners[business.owner_id] ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 relative flex-shrink-0">
                      <Image
                        src={
                          owners[business.owner_id].photo_url ||
                          '/placeholder.svg'
                        }
                        alt={`${owners[business.owner_id].fullname} photo`}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-full"
                      />
                    </div>
                    <span>{owners[business.owner_id].fullname}</span>
                  </div>
                ) : (
                  business.owner_id
                )}
              </TableCell>
              <TableCell>
                {business.organizations
                  ?.map((orgId) => organizations[orgId] || orgId)
                  .join(', ')}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <EditButton
                      business={business}
                      onEditSuccess={onBusinessUpdated}
                    />
                    <DeleteButton
                      business={business}
                      onDeleteSuccess={onBusinessDeleted}
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-500">
          Mostrando {(currentPage - 1) * itemsPerPage + 1} -{' '}
          {Math.min(currentPage * itemsPerPage, businesses.length)} de {businesses.length}{' '}
          emprendimientos.
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            &lt;&lt;
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
          >
            &lt;
          </Button>
          <span className="text-sm py-2">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              handlePageChange(Math.min(currentPage + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            &gt;
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            &gt;&gt;
          </Button>
        </div>
      </div>
    </div>
  )
}