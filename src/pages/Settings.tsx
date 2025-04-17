import {
  Avatar,
  Box,
  Center,
  Divider,
  Heading,
  Spinner,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useSession } from "../context/SessionContext";

export default function Settings() {
  const { session, isLoading } = useSession();

  if (isLoading)
    return (
      <Center h="100vh">
        <Spinner />
      </Center>
    );
  if (!session) return <Text>You must be logged in to view this page.</Text>;

  const { email, created_at, user_metadata } = session.user;

  return (
    <Center py={10}>
      <Box
        p={6}
        maxW="lg"
        borderWidth="1px"
        borderRadius="lg"
        boxShadow="lg"
        w="100%"
      >
        <VStack spacing={5}>
          <Avatar size="xl" src={user_metadata.avatar_url} />
          <Heading size="md">{user_metadata.full_name}</Heading>
          <Text color="gray.500">{email}</Text>
          <Divider />
          <Stack w="100%" spacing={2}>
            <Text>
              <strong>Member since </strong>{" "}
              {new Date(created_at).toLocaleString()}
            </Text>
          </Stack>
        </VStack>
      </Box>
    </Center>
  );
}
