import AuthFormContent from '@/components/forms/authFormContent'
import { connectToDatabase } from '@/db'

async function SignInPage (): Promise<React.ReactNode> {
  await connectToDatabase()
  return (
    <AuthFormContent />
  )
}

export default SignInPage
