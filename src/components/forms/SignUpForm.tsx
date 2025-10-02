'use client'

import { useState, ReactNode, FormEvent } from 'react'
import { toast } from 'react-toastify'
import InputField from '@components/ui/InputField'
import Button from '@components/ui/Button'
import { authClient } from '@/lib/auth-client'

interface Credentials {
  email: string
  password: string
  name: string
}

export default function SignUpForm (): ReactNode {
  const [credentials, setCredentials] = useState<Credentials>({
    email: '',
    password: '',
    name: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault()
    setIsLoading(true)

    void authClient.signUp.email({
      ...credentials,
      callbackURL: '/sign-in'
    }, {
      onRequest: () => {
        toast.loading('Création de votre compte... 🐣', {
          toastId: 'signup'
        })
      },
      onSuccess: () => {
        toast.update('signup', {
          render: 'Compte créé avec succès ! 🎈',
          type: 'success',
          isLoading: false,
          autoClose: 3000
        })
      },
      onError: (ctx) => {
        toast.update('signup', {
          render: `Erreur: ${ctx.error.message} 😿`,
          type: 'error',
          isLoading: false,
          autoClose: 5000
        })
        setIsLoading(false)
      }
    })
  }

  return (
    <form
      className='flex flex-col gap-6'
      onSubmit={handleSubmit}
    >
      <InputField
        type='text'
        name='name'
        label='Nom'
        value={credentials.name}
        onChangeText={name => setCredentials({ ...credentials, name })}
        required
        placeholder='Votre nom de dresseur'
      />

      <InputField
        type='email'
        name='email'
        label='Email'
        value={credentials.email}
        onChangeText={email => setCredentials({ ...credentials, email })}
        required
        placeholder='votre@email.com'
      />

      <InputField
        type='password'
        name='password'
        label='Mot de passe'
        value={credentials.password}
        onChangeText={password => setCredentials({ ...credentials, password })}
        required
        placeholder='••••••••'
      />

      <Button
        type='submit'
        variant='primary'
        className={isLoading ? 'opacity-75 cursor-not-allowed' : ''}
      >
        Créer mon compte
      </Button>
    </form>
  )
}
