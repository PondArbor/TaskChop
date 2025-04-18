import { Alert, AlertIcon, Badge, Box, Stack, Text } from "@chakra-ui/react";
import { Task } from "../types/Task";

type TaskCardProps = {
  task: Task;
  status: string;
  assignedDate: string;
  missedCount?: number;
  lastCompleted?: string;
};

export default function TaskCard({
  task,
  status,
  assignedDate,
  missedCount,
  lastCompleted,
}: TaskCardProps) {
  const showMissedNotice = missedCount && missedCount > 0;

  return (
    <Box p={3} mb={3} borderWidth="1px" borderRadius="md" bg="gray.50">
      <Stack spacing={2}>
        {/* Title */}
        <Text fontWeight="bold">{task.title}</Text>

        {/* Missed Notice */}
        {showMissedNotice && (
          <Alert
            status="warning"
            variant="left-accent"
            fontSize="sm"
            p={2}
            borderRadius="md"
          >
            <AlertIcon boxSize="16px" />
            Missed {missedCount} {missedCount === 1 ? "day" : "days"}
            {lastCompleted && (
              <>
                ; last completed on{" "}
                {new Date(lastCompleted).toLocaleDateString()}
              </>
            )}
            .
          </Alert>
        )}

        {/* Description */}
        {task.description && (
          <Text fontSize="sm" color="gray.700">
            {task.description}
          </Text>
        )}

        {/* Frequency + Day */}
        <Text fontSize="sm" color="gray.500">
          <strong>Frequency:</strong> {task.frequency}
          {task.frequency === "weekly" && task.day_of_week
            ? ` (${task.day_of_week})`
            : ""}
        </Text>

        {/* Assigned Date */}
        <Text fontSize="sm" color="gray.500">
          <strong>Scheduled:</strong> {assignedDate}
        </Text>

        {/* Status */}
        <Badge
          colorScheme={
            status === "missed"
              ? "red"
              : status === "completed"
              ? "green"
              : "blue"
          }
          width="fit-content"
        >
          {status}
        </Badge>

        {/* Optional: tag and created_at */}
        {task.tag_id && (
          <Text fontSize="xs" color="gray.400">
            Tag: {task.tag_id}
          </Text>
        )}
        {task.created_at && (
          <Text fontSize="xs" color="gray.400">
            Created: {new Date(task.created_at).toLocaleDateString()}
          </Text>
        )}
      </Stack>
    </Box>
  );
}
