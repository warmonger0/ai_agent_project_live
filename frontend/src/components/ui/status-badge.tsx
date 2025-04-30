import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const variant =
    status === "success"
      ? "success"
      : status === "error"
      ? "destructive"
      : "outline";

  return <Badge variant={variant}>{status}</Badge>;
};

export default StatusBadge;
