import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="flex justify-between bg-primary-50 p-8 h-fit">
      <p>&copy; 2024 AllConnected. Todos los derechos reservados.</p>
      <div>
        <Link href="#" className="hover:underline mr-4">
          Términos de servicio
        </Link>
        <Link href="#" className="hover:underline">
          Privacidad
        </Link>
      </div>
    </footer>
  )
}
