'use client'

import { useEffect } from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MoreHorizontal } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { EditFAQButton } from '@/components/faq/edit-faq-button'
import { DeleteFAQButton } from '@/components/faq/delete-faq-button'
import { FAQ } from '@/types/faq'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

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

  useEffect(() => {
  }, [faqs])

  const faqsArray = Array.isArray(faqs) ? faqs : []
  const totalFaqs = faqsArray.length
  const totalPages = Math.ceil(totalFaqs / itemsPerPage)

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedFaqs = faqsArray.slice(startIndex, endIndex)

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  return (
    <div className="container mx-auto p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pregunta Frecuente</TableHead>
            <TableHead>Respuesta</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!faqsArray || faqsArray.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-8">
                No hay preguntas frecuentes disponibles
              </TableCell>
            </TableRow>
          ) : (
            paginatedFaqs.map((faq) => (
              <TableRow key={faq.id}>
                <TableCell className="font-medium">{faq.pregunta}</TableCell>
                <TableCell>{faq.respuesta}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menú</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <EditFAQButton faq={faq} onEditSuccess={onFAQUpdated} />
                      <DeleteFAQButton
                        faq={faq}
                        onDeleteSuccess={onFAQDeleted}
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-500">
          Mostrando {totalFaqs > 0 ? startIndex + 1 : 0} -{' '}
          {Math.min(endIndex, totalFaqs)} de {totalFaqs} preguntas frecuentes.
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
            Página {currentPage} de {Math.max(totalPages, 1)}
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