import NavBar from '@/components/ui-own/NavBar'
import Footer from '@/components/layout/FooterApp'
import SignUpForm from '@/components/auth/sign-up-form'

export default function UsersPage() {
  return (
    <div className="container mx-auto p-6">
      <NavBar />
      <div
        className="background-section relative py-10"
        style={{ backgroundColor: '#075985', borderRadius: '15px' }}
      >
        <div className="text-center pt-12 pb-24">
          <h1 className="text-4xl font-bold text-white">
            Bienvenido a All Connected
          </h1>
          <p className="text-white mt-2">
            All Connected Marketplace: Conecta, emprende y descubre en una
            comunidad universitaria llena de oportunidades.
          </p>
        </div>
      </div>

      <div className="form-section mx-auto shadow-lg relative z-10 bg-white p-8 rounded-lg -mt-10 w-full max-w-4xl">
        <h2
          className="text-2xl font-semibold text-center mb-6"
          style={{ color: '#0369A1' }}
        >
          Regístrate
        </h2>
        <SignUpForm />
        <p className="text-center mt-4 text-sm">
          ¿Ya tienes una cuenta?{' '}
          <a href="/sign-in" style={{ color: '#0369A1' }}>
            Inicia Sesión
          </a>
        </p>
      </div>

      <Footer />
    </div>
  )
}
