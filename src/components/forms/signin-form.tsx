'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import InputField from '../input'
import Button from '../button'
import { authClient, signInWithGithub } from '@/lib/auth-client'

interface Credentials {
  email: string
  password: string
}

function SignInForm ({ onError }: { onError: (error: string) => void }): React.ReactNode {
  const router = useRouter()
  const [credentials, setCredentials] = useState<Credentials>({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    setIsLoading(true)
    onError('') // Clear previous errors

    void authClient.signIn.email({
      email: credentials.email,
      password: credentials.password,
      callbackURL: '/app'
    }, {
      onRequest: (ctx) => {
        console.log('Signing in...', ctx)
      },
      onSuccess: (ctx) => {
        console.log('User signed in:', ctx)
        setIsLoading(false)

        // Redirection explicite vers l'application
        router.push('/app')
        router.refresh() // Rafraîchir pour charger la session
      },
      onError: (ctx) => {
        console.error('Sign in error:', ctx)
        setIsLoading(false)
        onError(ctx.error.message)
      }
    })
  }

  return (
    <div className='space-y-6'>
      <div className='text-center'>
        <h2 className='text-2xl font-bold text-cyan-400 mb-2 text-shadow-glow'>
          🔐 Connexion
        </h2>
        <p className='text-cyan-200 text-sm'>
          Retrouvez vos petits compagnons ! 👾
        </p>
      </div>

      <form className='flex flex-col justify-center space-y-4' onSubmit={handleSubmit}>
        <InputField
          label='Email'
          type='email'
          name='email'
          value={credentials.email}
          onChangeText={(text: string) => setCredentials({ ...credentials, email: text })}
        />
        <InputField
          label='Mot de passe'
          type='password'
          name='password'
          value={credentials.password}
          onChangeText={(text: string) => setCredentials({ ...credentials, password: text })}
        />
        <Button
          type='submit'
          size='lg'
          disabled={isLoading}
          variant='primary'
        >
          {isLoading ? '🔄 Connexion...' : '🎮 Se connecter'}
        </Button>
        <button
          className='group bg-white flex items-center border-2 border-black px-4 py-2 text-md w-fit gap-2 rounded-md text-black hover:cursor-pointer hover:bg-black hover:text-white transition-all duration-300'
          onClick={(e) => {
            e.preventDefault()
            setIsLoading(true)
            void signInWithGithub()
          }}
        >
          {/* svg github logo */}
          <svg
            height='32' aria-hidden='true' viewBox='0 0 24 24' version='1.1' width='32' data-view-component='true'
            className='group-hover:fill-white octicon octicon-mark-github v-align-middle transition-all duration-300'
          >
            <path
              d='M12 1C5.923 1 1 5.923 1 12c0 4.867 3.149 8.979 7.521 10.436.55.096.756-.233.756-.522 0-.262-.013-1.128-.013-2.049-2.764.509-3.479-.674-3.699-1.292-.124-.317-.66-1.293-1.127-1.554-.385-.207-.936-.715-.014-.729.866-.014 1.485.797 1.691 1.128.99 1.663 2.571 1.196 3.204.907.096-.715.385-1.196.701-1.471-2.448-.275-5.005-1.224-5.005-5.432 0-1.196.426-2.186 1.128-2.956-.111-.275-.496-1.402.11-2.915 0 0 .921-.288 3.024 1.128a10.193 10.193 0 0 1 2.75-.371c.936 0 1.871.123 2.75.371 2.104-1.43 3.025-1.128 3.025-1.128.605 1.513.221 2.64.111 2.915.701.77 1.127 1.747 1.127 2.956 0 4.222-2.571 5.157-5.019 5.432.399.344.743 1.004.743 2.035 0 1.471-.014 2.654-.014 3.025 0 .289.206.632.756.522C19.851 20.979 23 16.854 23 12c0-6.077-4.922-11-11-11Z'
            />
          </svg>
          Se connecter avec GitHub
        </button>
      </form>
    </div>
  )
}

export default SignInForm
