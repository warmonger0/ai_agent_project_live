// File: frontend/src/components/planning/CommandPanel/ChatPanel/CopyButton.tsx

import React, { useState } from "react";

interface CopyButtonProps {
  text: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <button onClick={handleCopy} className="hover:underline">
      {copied ? "Copied" : "Copy"}
    </button>
  );
};

export default CopyButton;
