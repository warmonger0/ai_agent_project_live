import { useState, useEffect } from "react";
import { fetchTasks } from "../lib/services/taskService";
import Table from "./table/Table";
import TaskRow from "./table/TaskRow";

interface Task {
  id: number;
  description: string;
  status: string;
}

const TaskTable = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const res = await fetchTasks();
        const taskArray = Array.isArray(res?.data) ? res.data : [];
        console.log("✅ Loaded tasks:", taskArray);
        setTasks(taskArray);
      } catch (error) {
        console.error("❌ Error loading tasks:", error);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  if (loading) {
    return (
      <p className="text-center mt-8 text-lg text-gray-600">Loading tasks...</p>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Task Dashboard</h1>
      <Table headers={["ID", "Description", "Status"]}>
        {tasks.map((task) => (
          <TaskRow
            key={task.id}
            task_id={task.id}
            description={task.description}
            status={task.status}
          />
        ))}
      </Table>
    </div>
  );
};

export default TaskTable;
