import { AppHeader } from '@/components/header'
import Sidebar from '@/components/sidebar'

export default function AppLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex h-dvh w-full gap-4">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex w-full flex-col sm:gap-4 sm:py-4 overflow-y-auto">
        {/* Header */}
        <AppHeader className="sticky flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6" />

        {/* Main content */}
        <main className='h-full pr-4'>{children}</main>
      </div>
    </div>
  )
}
