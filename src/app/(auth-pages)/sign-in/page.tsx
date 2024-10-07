'use client'

import React from 'react'
import SignIn from '@/components/account/auth/SignIn'
import { WithAuthRedirect } from '@/components/hoc/WithAuthRedirect'

const SignInPage = () => {
  return (
    <div className="container mx-auto p-6">
        <SignIn />
    </div>
  )
}

export default WithAuthRedirect(SignInPage)
