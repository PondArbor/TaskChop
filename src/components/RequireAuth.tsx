import { Center, Spinner } from "@chakra-ui/react";
import React from "react";
import { Navigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";

export default function RequireAuth({
  children,
}: {
  children: React.ReactElement;
}) {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner />
      </Center>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
