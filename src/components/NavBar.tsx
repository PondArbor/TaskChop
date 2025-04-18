import { useNavigate } from "react-router-dom";

import {
  Avatar,
  Box,
  Center,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useSession } from "../context/SessionContext";
import { supabase } from "../supabaseClient";

export default function Navbar() {
  const navigate = useNavigate();
  const { session, isLoading } = useSession();
  const bgColor = useColorModeValue("gray.100", "gray.900");

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (isLoading)
    return (
      <Center h="100vh">
        <Spinner />
      </Center>
    );

  if (!session) return <Text>You must be logged in to view this page.</Text>;

  const { user_metadata } = session.user;

  return (
    <Box bg={bgColor} px={4} boxShadow="sm">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Text
          fontWeight="bold"
          fontSize="lg"
          cursor="pointer"
          onClick={() => navigate("/")}
        >
          🫲TaskChop
        </Text>
        <Menu>
          <MenuButton>
            <Avatar size="sm" src={user_metadata.avatar_url} cursor="pointer" />
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => navigate("/")}>Home</MenuItem>
            <MenuItem onClick={() => navigate("/settings")}>Settings</MenuItem>
            <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Box>
  );
}
