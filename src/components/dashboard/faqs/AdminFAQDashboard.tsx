'use client'

import { useState } from 'react'
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
import { FAQ } from '@/types/faq'
import { DeleteFAQButton } from '@/components/faq/delete-faq-button'
import { EditFAQButton } from '@/components/faq/edit-faq-button'
import { CreateFAQButton } from '@/components/faq/create-faq-button'

interface AdminFAQDashboardProps {
  faqs: FAQ[]
  onFAQUpdated: (updatedFAQ: FAQ) => void
  onFAQDeleted: (faqId: number) => void
}

export default function AdminFAQDashboard({
  faqs,
  onFAQUpdated,
  onFAQDeleted
}: AdminFAQDashboardProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil(faqs.length / itemsPerPage)

  const paginatedFAQs = faqs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-end mb-4">
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Categoría</TableHead>
            <TableHead>Pregunta Frecuente</TableHead>
            <TableHead>Respuesta</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedFAQs.map((faq) => (
            <TableRow key={faq.id}>
              <TableCell>{faq.category}</TableCell>
              <TableCell>{faq.question}</TableCell>
              <TableCell>{faq.answer}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <EditFAQButton faq={faq} onEditSuccess={onFAQUpdated} />
                    <DeleteFAQButton faq={faq} onDeleteSuccess={onFAQDeleted} />
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
          {Math.min(currentPage * itemsPerPage, faqs.length)} de {faqs.length}{' '}
          preguntas frecuentes.
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
