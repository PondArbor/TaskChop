import { Button, Center, VStack, Text } from '@chakra-ui/react'
import { supabase } from '../supabaseClient'

export default function Login() {
  return (
    <Center h="100vh">
      <VStack>
        <Text fontSize="2xl">Welcome to TaskChop</Text>
        <Button onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}>
          Sign in with Google
        </Button>
      </VStack>
    </Center>
  )
}