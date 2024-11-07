import { AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <AlertTriangle
          className="mx-auto h-12 w-12 text-yellow-500"
          aria-hidden="true"
        />
        <h1 className="mt-3 text-2xl font-semibold text-gray-900">
          403 - Forbidden
        </h1>
        <p className="mt-4 text-gray-500">
          Lo siento, no tienes permiso para acceder a esta página.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-block px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
