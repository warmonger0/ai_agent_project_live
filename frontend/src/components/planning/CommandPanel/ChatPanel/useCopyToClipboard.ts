// File: frontend/src/components/planning/CommandPanel/ChatPanel/useCopyToClipboard.ts

import { useState, useCallback } from "react";

export function useCopyToClipboard(delay = 1500) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    (text: string) => {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), delay);
      });
    },
    [delay]
  );

  return { copy, copied };
}
