import GoBackButton from '@/components/ui-own/go-back-button'
import { TriangleAlert } from 'lucide-react'

export default function NotFound() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <TriangleAlert size={64} />
        <div className="mx-auto max-w-md text-center">
          <h1 className="text-9xl font-bold tracking-tight">404</h1>
          <p className="mt-4 text-2xl font-semibold tracking-tight">
            Oops, la página que buscabas no existe.
          </p>
          <div className="mt-6">
            <GoBackButton size="sm" />
          </div>
        </div>
      </main>
    </>
  )
}
