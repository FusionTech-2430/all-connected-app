'use client'

import { useRouter } from 'next/navigation'
import { Button, ButtonProps } from '@/components/ui/button'

interface GoBackButtonProps extends Omit<ButtonProps, 'onClick'> {}

export default function GoBackButton(props: GoBackButtonProps) {
  const router = useRouter()
  return (
    <Button
      {...props}
      onClick={() => {
        router.back()
      }}
    >
      Volver atrás
    </Button>
  )
}
