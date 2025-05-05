import StatusBadge from "@/components/ui/status-badge";

interface TaskRowProps {
  task_id?: number;
  description: string;
  status: string;
}

const TaskRow = ({ task_id, description, status }: TaskRowProps) => (
  <tr className="transition hover:bg-gray-50 text-sm">
    <td className="border px-4 py-3 text-center whitespace-nowrap">
      {task_id}
    </td>
    <td className="border px-4 py-3 text-left">{description}</td>
    <td className="border px-4 py-3 text-center">
      <StatusBadge status={status} />
    </td>
  </tr>
);

export default TaskRow;
