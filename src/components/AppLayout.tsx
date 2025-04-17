// src/components/AppLayout.tsx
import { Outlet } from 'react-router-dom'
import { Box } from '@chakra-ui/react'
import Navbar from './NavBar'

export default function AppLayout() {
  return (
    <Box minH="100vh">
      <Navbar />
      <Box pt={4} px={4}>
        <Outlet />
      </Box>
    </Box>
  )
}
