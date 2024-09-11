import { ModeToggle } from '@/components/mode-toggle'

export default function Page() {
  return (
    <>
      <main className="flex flex-col min-h-screen justify-center items-center gap-4">
        <h1 className="text-lg font-bold">Hello, world!</h1>
        <ModeToggle />
      </main>
    </>
  )
}
