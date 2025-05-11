// File: src/components/ui/status-badge.tsx

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

  return (
    <Badge variant={variant} data-testid="status-badge">
      {status}
    </Badge>
  );
};

export default StatusBadge;
