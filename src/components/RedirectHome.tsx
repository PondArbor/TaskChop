import { Navigate } from 'react-router-dom'
import { useSession } from '../context/SessionContext'
import { Center, Spinner } from '@chakra-ui/react'

export default function RedirectHome() {
  const { session, isLoading } = useSession()

  if (isLoading) {
    return <Center h="100vh"><Spinner /></Center>
  }

  if (session) {
    return <Navigate to="/" replace />
  } else {
    return <Navigate to="/login" replace />
  }
}
