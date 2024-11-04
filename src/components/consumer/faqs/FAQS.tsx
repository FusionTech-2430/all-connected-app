'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { FAQ } from '@/types/faq'

interface ConsumerFAQDashboardProps {
  faqs: FAQ[]
}

export default function ConsumerFAQDashboard({ faqs }: ConsumerFAQDashboardProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

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
          </TableRow>
        </TableHeader>
        <TableBody>
          {!faqsArray || faqsArray.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2} className="text-center py-8">
                No hay preguntas frecuentes disponibles
              </TableCell>
            </TableRow>
          ) : (
            paginatedFaqs.map((faq) => (
              <TableRow key={faq.id}>
                <TableCell className="font-medium">{faq.pregunta}</TableCell>
                <TableCell>{faq.respuesta}</TableCell>
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