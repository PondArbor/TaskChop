export type TaskFrequency = "assigned" | "daily" | "weekly" | "monthly";
export type TaskStatus = "active" | "paused" | "inactive";

export interface Task {
  id: string;
  owner_id: string;
  title: string;
  frequency: TaskFrequency;
  status?: TaskStatus;
  tag_id?: string;
  created_at?: string;
  description?: string;
  day_of_week: string;
  assigned_date?: string; // ISO 8601 format: 'YYYY-MM-DD'
}

export interface TaskInstance {
  id: string;
  task_id: string;
  assigned_date: string;
  status: string;
  tasks: Task; // joined via foreign key
};