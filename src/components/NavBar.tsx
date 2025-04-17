import { HamburgerIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { supabase } from "../supabaseClient";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <Box bg={useColorModeValue("gray.100", "gray.900")} px={4} boxShadow="sm">
      <Flex h={16} alignItems="center">
        <Text
          fontWeight="bold"
          fontSize="lg"
          cursor="pointer"
          role="link"
          onClick={() => navigate("/")}
        >
          TaskChop
        </Text>

        <Spacer />

        <Menu>
          <MenuButton
            as={IconButton}
            icon={<HamburgerIcon />}
            variant="ghost"
            aria-label="Options"
          />
          <MenuList>
            <MenuItem onClick={() => navigate("/")}>Dashboard</MenuItem>
            <MenuItem onClick={() => navigate("/settings")}>Settings</MenuItem>
            <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Box>
  );
}
