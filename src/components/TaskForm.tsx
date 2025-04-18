import { shouldCreateTaskInstanceToday } from "../utils/shouldCreateTaskInstance";

import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Task } from "../types/Task";

type TaskFormProps = {
  isOpen: boolean;
  onClose: () => void;
  refreshTasks?: () => void; // optional
  initialData?: Task;
};

export default function TaskForm({
  isOpen,
  onClose,
  refreshTasks,
  initialData,
}: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [assignedDate, setAssignedDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );

  const [frequency, setFrequency] = useState("daily");
  const toast = useToast();

  // Pre-fill values if editing
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setFrequency(initialData.frequency || "daily");
      setDayOfWeek(initialData.day_of_week || "");
      setAssignedDate(
        initialData.assigned_date || new Date().toISOString().split("T")[0]
      );
    } else {
      setTitle("");
      setDescription("");
      setFrequency("daily");
      setDayOfWeek("");
      setAssignedDate(new Date().toISOString().split("T")[0]);
    }
  }, [initialData]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast({ status: "warning", title: "Task title is required" });
      return;
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user) {
      toast({
        status: "error",
        title: "User not authenticated",
        description:
          userError?.message || "You must be logged in to create a task.",
      });
      return;
    }

    const taskData = {
      title,
      description,
      frequency,
      owner_id: user.id,
      status: "active",
      assigned_date:
        frequency === "assigned" || frequency === "one_time"
          ? assignedDate
          : null,
      day_of_week:
        frequency === "weekly" ||
        frequency === "assigned" ||
        frequency === "one_time"
          ? dayOfWeek
          : null,
    };

    const { data, error } = initialData
      ? await supabase
          .from("tasks")
          .update(taskData)
          .eq("id", initialData.id)
          .select()
          .single()
      : await supabase.from("tasks").insert(taskData).select().single();

    if (error) {
      toast({
        status: "error",
        title: "Error saving task",
        description: error.message,
      });
    } else {
      toast({
        status: "success",
        title: `Task ${initialData ? "updated" : "created"}`,
      });

      if (shouldCreateTaskInstanceToday(data)) {
        const { error: instanceError } = await supabase
          .from("task_instances")
          .insert({
            task_id: data.id,
            assigned_date: new Date().toISOString().split("T")[0],
            status: "pending",
          });

        if (instanceError) {
          toast({
            status: "warning",
            title: "Task saved, but instance was not created",
            description: instanceError.message,
          });
        }
      }

      if (refreshTasks) refreshTasks();
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{initialData ? "Edit Task" : "New Task"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel>Title</FormLabel>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Description</FormLabel>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Frequency</FormLabel>
            <Select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
            >
              <option value="assigned">One-Time</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Bi-weekly / Monthly</option>
            </Select>
          </FormControl>
          {frequency === "assigned" && (
            <FormControl mt={4}>
              <FormLabel>Assigned Date</FormLabel>
              <Input
                type="date"
                value={assignedDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => {
                  const dateStr = e.target.value;
                  setAssignedDate(dateStr);

                  const weekday = new Date(dateStr)
                    .toLocaleDateString("en-US", {
                      weekday: "long",
                    })
                    .toLowerCase();

                  setDayOfWeek(weekday);
                }}
              />
            </FormControl>
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} variant="ghost" mr={3}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} colorScheme="blue">
            {initialData ? "Save" : "Create"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
