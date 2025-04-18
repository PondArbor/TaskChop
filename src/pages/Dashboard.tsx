// src/pages/Dashboard.tsx
import {
  Box,
  Button,
  Grid,
  Heading,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import { useFetchTaskInstances } from "../hooks/useFetchTaskInstances";

const sectionLabels = {
  assigned: "Assigned",
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Bi-weekly / Monthly",
};

export default function Dashboard() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { taskCards, loading } = useFetchTaskInstances();

  const grouped = {
    assigned: taskCards.filter((t) => t.tasks?.frequency === "assigned"),
    daily: taskCards.filter((t) => t.tasks?.frequency === "daily"),
    weekly: taskCards.filter((t) => t.tasks?.frequency === "weekly"),
    monthly: taskCards.filter((t) => t.tasks?.frequency === "monthly"),
  };

  return (
    <>
      <Heading size="lg" mb={6}>
        Your Tasks
      </Heading>
      <Button mb={6} colorScheme="teal" onClick={onOpen}>
        + New Task
      </Button>

      <TaskForm
        isOpen={isOpen}
        onClose={onClose}
        refreshTasks={() => window.location.reload()} // or rerun useFetchTaskInstances via context/state later
      />

      {loading ? (
        <Spinner />
      ) : (
        <Grid
          templateColumns={{
            base: "1fr",
            md: "repeat(2, 1fr)",
            xl: "repeat(4, 1fr)",
          }}
          gap={6}
        >
          {Object.entries(grouped).map(([key, instances]) => (
            <Box
              key={key}
              bg="white"
              borderRadius="lg"
              boxShadow="md"
              p={4}
              minH="300px"
            >
              <Heading size="md" mb={3}>
                {sectionLabels[key as keyof typeof sectionLabels]}
              </Heading>
              {instances.length === 0 ? (
                <Text color="gray.500" fontSize="sm">
                  No tasks here
                </Text>
              ) : (
                instances.map((ti) => (
                  <TaskCard
                    key={ti.id}
                    task={ti.tasks}
                    status={ti.status}
                    assignedDate={ti.assigned_date}
                    missedCount={ti.missedCount}
                    lastCompleted={ti.lastCompleted}
                  />
                ))
              )}
            </Box>
          ))}
        </Grid>
      )}
    </>
  );
}
