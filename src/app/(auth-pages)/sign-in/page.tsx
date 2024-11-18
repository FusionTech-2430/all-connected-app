import NavBar from '@/components/ui-own/NavBar'
import Footer from '@/components/layout/FooterApp'
import SignInForm from '@/components/auth/sign-in-form'
import Image from 'next/image'

export default function SignInPage() {
  return (
    <div className="container mx-auto p-6">
      <NavBar />
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
        <div className="flex flex-col justify-center px-8 md:px-16">
          <h1 className="text-3xl font-bold text-[#0369A1] mb-4">
            ¡Bienvenido de nuevo!
          </h1>
          <p className="text-gray-700 mb-8">
            Ingresa tu correo y contraseña para iniciar sesión
          </p>
          {/* Sección de formulario */}
          <SignInForm />
          <p className="text-center mt-4 text-sm">
            ¿No tienes una cuenta?{' '}
            <a href="/sign-up" className="text-[#0369A1]">
              Regístrate
            </a>
          </p>
        </div>

        {/* Sección del banner */}
        <div className="relative bg-[#075985] flex justify-center items-center rounded-lg">
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/allconnected-p.appspot.com/o/static_images%2FBanner2-removebg-preview%201.png?alt=media"
            alt="AllConnected"
            className="z-10 w-2/3"
            width={800}
            height={800}
          />

          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(7, 89, 133, 0.2), rgba(7, 89, 133, 0.2)), url('/background2.png'), url('/background2.2.png')",
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              height: '100%',
              width: '100%'
            }}
          />
        </div>
      </div>
      <Footer />
    </div>
  )
}
