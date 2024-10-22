import SubmitButton from '@/components/shared/submit-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signUp } from '@/lib/actions/auth'

export default function SignUpForm() {
  return (
    <form action={signUp} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          {/* <label className="block text-gray-700">Nombre</label>
          <input
            type="text"
            name="fullname"
            placeholder="Tu nombre completo"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
          /> */}
          <Label htmlFor="fullname">Nombre</Label>
          <Input
            id="fullname"
            name="fullname"
            type="text"
            placeholder="Tu nombre completo"
          />
        </div>

        <div>
          {/* <label className="block text-gray-700">Nombre de usuario</label>
          <input
            type="text"
            name="username"
            placeholder="Tu nombre de usuario"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
          /> */}
          <Label htmlFor="username">Nombre de usuario</Label>
          <Input
            id="username"
            name="username"
            type="text"
            placeholder="Tu nombre de usuario"
          />
        </div>

        <div>
          {/* <label className="block text-gray-700">Correo Electrónico</label>
          <input
            type="email"
            name="email"
            placeholder="Tu dirección de correo electrónico"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
          /> */}
          <Label htmlFor="mail">Correo Electrónico</Label>
          <Input id="mail" name="mail" type="email" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          {/* <label className="block text-gray-700">Contraseña</label>
          <input
            type="password"
            name="password"
            placeholder="Tu contraseña"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
          /> */}
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Tu contraseña"
          />
        </div>
        <div>
          {/* <label className="block text-gray-700">Confirmar Contraseña</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirma tu contraseña"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
          /> */}
          <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirma tu contraseña"
          />
        </div>
      </div>
      <div>
        {/* <label className="block text-gray-700">Foto de Perfil (Opcional)</label>
        <input
          type="file"
          onChange={handleFileChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
        /> */}

        {/* <Label htmlFor="photo">Foto de Perfil (Opcional)</Label>
        <Input id="photo" name="photo" type="file" /> */}
      </div>
      <div className="text-center mt-6">
        <SubmitButton
          loadingMessage="Creando cuenta..."
          className="w-full bg-[#0284C7] font-semibold py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          Crear Cuenta
        </SubmitButton>
        {/* <button
          type="submit"
          className={`w-full bg-[#0284C7] text-white font-semibold py-2 px-4 rounded-lg ${isLoading ? 'cursor-not-allowed opacity-50' : 'hover:bg-blue-700'}`}
          disabled={isLoading} // Desactivar el botón cuando está en modo de carga
        >
        </button> */}
      </div>
    </form>
  )
}
