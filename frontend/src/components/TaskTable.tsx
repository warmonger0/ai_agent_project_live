import { useState, useEffect } from 'react';
import { fetchTasks } from '../services/taskService';

interface Task {
  task_id: number;
  description: string;
  status: string;
}

const TaskTable = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await fetchTasks();
        console.log('Fetched tasks:', data); // Optional for debug
        setTasks(data);
      } catch (error) {
        console.error('Error loading tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  if (loading) {
    return <p className="text-center mt-8 text-lg text-gray-600">Loading tasks...</p>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Task Dashboard</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">ID</th>
              <th className="border px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Description</th>
              <th className="border px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task: Task, index: number) => (
              <tr key={task.task_id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}>
                <td className="border px-6 py-4 text-sm text-gray-800">{task.task_id}</td>
                <td className="border px-6 py-4 text-sm text-gray-800">{task.description}</td>
                <td className="border px-6 py-4 text-sm text-gray-800">{task.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskTable;
