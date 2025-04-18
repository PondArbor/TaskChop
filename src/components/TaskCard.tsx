import {
  Badge,
  Box,
  Checkbox,
  Flex,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { supabase } from "../supabaseClient";
import { Task } from "../types/Task";

type TaskCardProps = {
  task: Task;
  status: string;
  assignedDate: string;
  missedCount?: number;
  lastCompleted?: string;
  instanceId?: string;
  onStatusChange?: () => void;
};

export default function TaskCard({
  task,
  status,
  assignedDate,
  missedCount,
  lastCompleted,
  instanceId,
  onStatusChange,
}: TaskCardProps) {
  const toast = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusToggle = async () => {
    if (!instanceId) return;

    const newStatus = status === "completed" ? "pending" : "completed";

    setIsUpdating(true);
    const { error } = await supabase
      .from("task_instances")
      .update({ status: newStatus })
      .eq("id", instanceId);

    setIsUpdating(false);

    if (error) {
      toast({
        status: "error",
        title: "Failed to update task status",
        description: error.message,
      });
    } else {
      onStatusChange?.();
    }
  };

  const showMissedNotice = typeof missedCount === "number" && missedCount > 0;

  return (
    <Box
      p={2}
      mb={2}
      borderWidth="1px"
      borderRadius="md"
      bg="gray.50"
      _hover={{ bg: "gray.100" }}
    >
      <Flex align="center" justify="space-between" mb={1}>
        <Flex align="center" gap={2}>
          <Checkbox
            isChecked={status === "completed"}
            onChange={handleStatusToggle}
            isDisabled={isUpdating}
            colorScheme="green"
          />
          <Text fontWeight="bold" fontSize="sm">
            {task.title}
          </Text>
        </Flex>

        <Badge
          fontSize="0.65em"
          colorScheme={
            status === "missed"
              ? "red"
              : status === "completed"
              ? "green"
              : "blue"
          }
        >
          {status}
        </Badge>
      </Flex>

      {task.description && (
        <Text fontSize="xs" color="gray.700" noOfLines={2} mb={1}>
          {task.description}
        </Text>
      )}

      {showMissedNotice && (
        <Box mb={1}>
          <Tooltip
            label={`Missed ${missedCount} ${
              missedCount === 1 ? "day" : "days"
            }${
              lastCompleted
                ? `, last completed ${new Date(
                    lastCompleted
                  ).toLocaleDateString()}`
                : ""
            }`}
            fontSize="xs"
            hasArrow
          >
            <Badge fontSize="0.65em" colorScheme="orange">
              Missed ×{missedCount}
            </Badge>
          </Tooltip>
        </Box>
      )}

      <Flex gap={3} fontSize="xs" color="gray.600" wrap="wrap">
        <Text>
          <strong>Every:</strong> {task.frequency}
          {task.frequency === "weekly" && task.day_of_week
            ? ` (${task.day_of_week})`
            : ""}
        </Text>
        <Text>
          <strong>Scheduled:</strong> {assignedDate}
        </Text>
        {task.tag_id && (
          <Text>
            <strong>Tag:</strong> {task.tag_id}
          </Text>
        )}
        {task.created_at && (
          <Text>
            <strong>Created:</strong>{" "}
            {new Date(task.created_at).toLocaleDateString()}
          </Text>
        )}
      </Flex>
    </Box>
  );
}
