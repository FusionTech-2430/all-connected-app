'use client'

import { useFormStatus } from 'react-dom'

import { Button, ButtonProps } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface SubmitButtonProps
  extends Omit<ButtonProps, 'type' | 'aria-disabled' | 'disabled' | 'onClick'> {
  loadingMessage?: string
  children?: React.ReactNode
}

export default function SubmitButton({
  loadingMessage = 'Cargando...',
  children,
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <>
      <Button type="submit" aria-disabled={pending} disabled={pending} {...props} >
        {pending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {loadingMessage}
          </>
        ) : (
          children
        )}
      </Button>
    </>
  )
}
