import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Task, TaskInstance } from "../types/Task";
import getTodaysDate from "../utils/getTodaysDate";

export type EnrichedTaskInstance = TaskInstance & {
  tasks: Task;
  missedCount?: number;
  lastCompleted?: string;
};

export function useFetchTaskInstances() {
  const [taskCards, setTaskCards] = useState<EnrichedTaskInstance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const today = getTodaysDate();

      const { data: instances, error } = await supabase
        .from("task_instances")
        .select(
          `
          *,
          tasks:task_id (*)
        `
        )
        .eq("assigned_date", today);

      if (error || !instances) {
        console.error("Error loading task instances:", error);
        setTaskCards([]);
        setLoading(false);
        return;
      }

      // For each instance, fetch recent history and enrich
      const enriched = await Promise.all(
        instances.map(async (inst) => {
          const { data: history } = await supabase
            .from("task_instances")
            .select("*")
            .eq("task_id", inst.task_id)
            .lt("assigned_date", today)
            .order("assigned_date", { ascending: false })
            .limit(7);

          const { missedCount, lastCompleted } = getMissedContext(
            history || []
          );
          return { ...inst, missedCount, lastCompleted };
        })
      );

      setTaskCards(enriched);
      setLoading(false);
    };

    fetchData();
  }, []);

  return { taskCards, loading };
}

function getMissedContext(instances: TaskInstance[]) {
  let missedCount = 0;
  let lastCompleted = undefined;

  for (const inst of instances) {
    if (inst.status === "missed") {
      missedCount++;
    } else if (inst.status === "completed") {
      lastCompleted = inst.assigned_date;
      break;
    } else {
      break;
    }
  }

  return { missedCount, lastCompleted };
}
