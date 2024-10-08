import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useUser } from '@/hooks/use-user' // O donde esté tu hook useUser

export function WithAuthRedirect(WrappedComponent: React.ComponentType) {
  return function AuthRedirect(props: React.ComponentProps<typeof WrappedComponent>) {
    const router = useRouter()
    const { user, loading } = useUser()

    useEffect(() => {
      // if the user is logged in, redirect to the user's business page
      if (!loading && user) {
        router.push('/my-business')
      }
    }, [user, loading, router])

    if (loading) {
      // TODO: Implement a loader
      return <p>Cargando...</p>
    }

    // If no user is logged in, render the wrapped component
    return <WrappedComponent {...props} />
  }
}
