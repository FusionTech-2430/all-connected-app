'use client'

import { useState } from 'react'
import AdminFAQDashboard from '@/components/dashboard/faqs/AdminFAQDashboard'
import SearchInput from '@/components/shared/search-input'
import { FAQ } from '@/types/faq'
import { CreateFAQButton } from '@/components/faq/create-faq-button'

const initialFAQs: FAQ[] = [
  {
    id: 1,
    category: 'Account',
    question: '¿Cómo puedo cambiar mi contraseña?',
    answer:
      'Para cambiar tu contraseña, ve a la sección de configuración de tu cuenta y selecciona la opción "Cambiar contraseña". Sigue las instrucciones para establecer una nueva contraseña segura.'
  },
  {
    id: 2,
    category: 'Customer Support',
    question: '¿Cuál es el horario de atención al cliente?',
    answer:
      'Nuestro servicio de atención al cliente está disponible de lunes a viernes, de 9:00 AM a 6:00 PM (hora local). Durante los fines de semana y días festivos, ofrecemos soporte limitado a través de nuestro sistema de tickets.'
  },
  {
    id: 3,
    category: 'Subscription',
    question: '¿Cómo puedo cancelar mi suscripción?',
    answer:
      'Para cancelar tu suscripción, inicia sesión en tu cuenta, ve a la sección de "Suscripciones" y haz clic en "Cancelar suscripción". Sigue los pasos indicados para completar el proceso de cancelación.'
  },
  {
    id: 4,
    category: 'Orders',
    question: '¿Cuánto tiempo tarda en llegar mi pedido?',
    answer:
      'El tiempo de entrega varía según tu ubicación y el método de envío seleccionado. Generalmente, los pedidos nacionales tardan de 3 a 5 días hábiles, mientras que los pedidos internacionales pueden tardar de 7 a 14 días hábiles.'
  },
  {
    id: 5,
    category: 'Returns',
    question: '¿Ofrecen reembolsos?',
    answer:
      'Sí, ofrecemos reembolsos completos para productos devueltos dentro de los 30 días posteriores a la compra, siempre que el artículo esté en su estado original y sin usar. Para iniciar un reembolso, contacta a nuestro servicio de atención al cliente.'
  },
  {
    id: 6,
    category: 'Returns',
    question: '¿Ofrecen reembolsos?',
    answer:
      'Sí, ofrecemos reembolsos completos para productos devueltos dentro de los 30 días posteriores a la compra, siempre que el artículo esté en su estado original y sin usar. Para iniciar un reembolso, contacta a nuestro servicio de atención al cliente.'
  },
  {
    id: 7,
    category: 'Returns',
    question: '¿Ofrecen reembolsos?',
    answer:
      'Sí, ofrecemos reembolsos completos para productos devueltos dentro de los 30 días posteriores a la compra, siempre que el artículo esté en su estado original y sin usar. Para iniciar un reembolso, contacta a nuestro servicio de atención al cliente.'
  },
  {
    id: 8,
    category: 'Returns',
    question: '¿Ofrecen reembolsos?',
    answer:
      'Sí, ofrecemos reembolsos completos para productos devueltos dentro de los 30 días posteriores a la compra, siempre que el artículo esté en su estado original y sin usar. Para iniciar un reembolso, contacta a nuestro servicio de atención al cliente.'
  },
  {
    id: 9,
    category: 'Returns',
    question: '¿Ofrecen reembolsos?',
    answer:
      'Sí, ofrecemos reembolsos completos para productos devueltos dentro de los 30 días posteriores a la compra, siempre que el artículo esté en su estado original y sin usar. Para iniciar un reembolso, contacta a nuestro servicio de atención al cliente.'
  },
  {
    id: 10,
    category: 'Returns',
    question: '¿Ofrecen reembolsos?',
    answer:
      'Sí, ofrecemos reembolsos completos para productos devueltos dentro de los 30 días posteriores a la compra, siempre que el artículo esté en su estado original y sin usar. Para iniciar un reembolso, contacta a nuestro servicio de atención al cliente.'
  },
  {
    id: 11,
    category: 'Returns',
    question: '¿Ofrecen reembolsos?',
    answer:
      'Sí, ofrecemos reembolsos completos para productos devueltos dentro de los 30 días posteriores a la compra, siempre que el artículo esté en su estado original y sin usar. Para iniciar un reembolso, contacta a nuestro servicio de atención al cliente.'
  }
]

export default function AdminFAQ() {
  const [faqs, setFAQs] = useState<FAQ[]>(initialFAQs)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSearch = (value: string) => {
    setSearchQuery(value)
  }

  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">
          Gestión de preguntas frecuentes
        </h1>
        <div className="flex justify-between items-center">
          <SearchInput
            className="w-1/3"
            paramName="search"
            placeholder="Buscar por pregunta, respuesta o categoría..."
            onChange={handleSearch}
            value={searchQuery}
          />
          <CreateFAQButton
            onFAQCreated={(newFAQ) =>
              setFAQs((prevFAQs) => [...prevFAQs, newFAQ])
            }
          />
        </div>
      </div>
      <AdminFAQDashboard
        faqs={filteredFAQs}
        onFAQUpdated={(updatedFAQ) => {
          setFAQs((prevFAQs) =>
            prevFAQs.map((f) => (f.id === updatedFAQ.id ? updatedFAQ : f))
          )
        }}
        onFAQDeleted={(faqId) => {
          setFAQs((prevFAQs) => prevFAQs.filter((f) => f.id !== faqId))
        }}
      />
    </>
  )
}