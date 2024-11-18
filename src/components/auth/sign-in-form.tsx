'use client'

import { signIn } from '@/lib/actions/auth'
import React from 'react'
import SubmitButton from '@/components/shared/submit-button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useFormState } from 'react-dom'

export default function SignInForm() {
  const [state, formAction] = useFormState(signIn, null)

  return (
    <>
      {state?.error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          {state.error}
        </div>
      )}
      <form action={formAction} className="space-y-4">
        <div>
          <Label className="block text-gray-700">Correo</Label>
          <Input
            type="email"
            name="email"
            //   value={email}
            //   onChange={(e) => setEmail(e.target.value)}
            placeholder="Tu dirección de correo electrónico"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
          />
        </div>
        <div>
          <Label>Contraseña</Label>
          <Input type="password" name="password" placeholder="Tu contraseña" />
          {/* <label className="block text-gray-700">Contraseña</label>
        <input
        type="password"
          name="password"
          //   value={password}
          //   onChange={(e) => setPassword(e.target.value)}
          placeholder="Tu contraseña"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
          /> */}
        </div>
        <div className="text-center">
          <SubmitButton className="w-full bg-[#0284C7] font-semibold py-2 px-4 rounded-lg hover:bg-blue-700">
            Iniciar Sesión
          </SubmitButton>
        </div>
      </form>
    </>
  )
}
