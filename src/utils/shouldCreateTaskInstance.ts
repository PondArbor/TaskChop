import { Task } from "../types/Task";
import getTodaysDate from "./getTodaysDate";

export function shouldCreateTaskInstanceToday(task: Task): boolean {
  const today = new Date();
  const todayISO = getTodaysDate();
  const weekday = today
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();

  if (task.status !== "active") return false;

  switch (task.frequency) {
    case "daily":
      return true;
    case "weekly":
      return task.day_of_week === weekday;
    case "assigned":
      return task.assigned_date === todayISO;
    default:
      return false;
  }
}
