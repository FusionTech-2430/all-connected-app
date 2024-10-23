import NavBar from '@/components/ui-own/nav-bar-consumer'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar />
      {children}
    </>
  )
}
