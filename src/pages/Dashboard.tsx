import {
  Button,
  Center,
  HStack,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";
import { supabase } from "../supabaseClient";

export default function Dashboard() {
  const { session, isLoading } = useSession();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  useEffect(() => {
    if (!isLoading && !session) {
      navigate("/login");
    }
  }, [isLoading, session, navigate]);

  if (isLoading || !session) {
    return (
      <Center h="100vh">
        <Spinner />
      </Center>
    );
  }

  return (
    <Center h="100vh">
      <VStack spacing={4}>
        <Text>Welcome, {session.user.email}</Text>
        <HStack spacing={4}>
          <Button onClick={() => navigate("/settings")} colorScheme="blue">
            Settings
          </Button>
          <Button onClick={handleLogout} colorScheme="red">
            Sign Out
          </Button>
        </HStack>
      </VStack>
    </Center>
  );
}
