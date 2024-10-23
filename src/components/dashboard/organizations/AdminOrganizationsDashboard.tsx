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
import { Organizations } from '@/types/organizations'
import { DeleteOrganizationButton } from '@/components/organization/DeleteOrganizationButton'
import { EditOrganizationButton } from '@/components/organization/EditOrganizationButton'

interface AdminOrganizationsDashboardProps {
  organizations: Organizations[]
  onOrganizationUpdated: (updatedOrganization: Organizations) => void
  onOrganizationDeleted: (organizationId: string) => void
}

export default function AdminOrganizationsDashboard({
  organizations,
  onOrganizationUpdated,
  onOrganizationDeleted
}: AdminOrganizationsDashboardProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Dirección</TableHead>
            <TableHead>Latitud</TableHead>
            <TableHead>Longitud</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {organizations.map((organization) => (
            <TableRow key={organization.id_organization}>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 relative flex-shrink-0">
                    <Image
                      src={organization.photo_url || '/placeholder.svg'}
                      alt={`${organization.name} logo`}
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                  <span>{organization.name}</span>
                </div>
              </TableCell>
              <TableCell>{organization.address}</TableCell>
              <TableCell>{organization.location_lat}</TableCell>
              <TableCell>{organization.location_lng}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <EditOrganizationButton
                      organization={organization}
                      onEditSuccess={onOrganizationUpdated}
                    />
                    <DeleteOrganizationButton
                      organization={organization}
                      onDeleteSuccess={onOrganizationDeleted}
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
          Total: {organizations.length} organizaciones.
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            &lt;&lt;
          </Button>
          <Button variant="outline" size="sm">
            &lt;
          </Button>
          <span className="text-sm">Página 1 de 2</span>
          <Button variant="outline" size="sm">
            &gt;
          </Button>
          <Button variant="outline" size="sm">
            &gt;&gt;
          </Button>
        </div>
      </div>
    </div>
  )
}
