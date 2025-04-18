import { Button, Center, Text, VStack } from "@chakra-ui/react";
import { supabase } from "../supabaseClient";

export default function Login() {
  return (
    <Center h="100vh">
      <VStack>
        <Text fontSize="2xl">Welcome to TaskChop</Text>
        <Button
          onClick={() =>
            supabase.auth.signInWithOAuth({
              provider: "google",
              options: {
                redirectTo: import.meta.env.VITE_SUPABASE_REDIRECT_URL,
              },
            })
          }
        >
          Sign in with Google
        </Button>
      </VStack>
    </Center>
  );
}
