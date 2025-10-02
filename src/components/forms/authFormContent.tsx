'use client'

import { useState } from 'react'
import SignUpForm from './signupForm'
import SignInForm from './signinForm'
import Button from '../button'

function AuthFormContent (): React.ReactNode {
  const [isSignIn, setIsSignIn] = useState < boolean >(true)
  return (
    <div>
      {isSignIn ? <SignInForm /> : <SignUpForm />}
      <Button
        type='button'
        variant='ghost'
        onClick={() => setIsSignIn(!isSignIn)}
      >
        {isSignIn ? 'Create an account' : 'Already have an account?'}
      </Button>
    </div>
  )
}

export default AuthFormContent
