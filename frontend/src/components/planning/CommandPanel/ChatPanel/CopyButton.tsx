// File: frontend/src/components/planning/CommandPanel/ChatPanel/CopyButton.tsx

import React, { useState } from "react";

interface CopyButtonProps {
  text: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } else {
        console.warn("Clipboard API not available.");
      }
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const isClipboardSupported =
    typeof navigator !== "undefined" && !!navigator.clipboard?.writeText;

  return (
    <button
      onClick={handleCopy}
      className={`hover:underline ${
        !isClipboardSupported ? "text-gray-400 cursor-not-allowed" : ""
      }`}
      disabled={!isClipboardSupported}
      title={
        isClipboardSupported ? "Copy to clipboard" : "Clipboard not supported"
      }
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
};

export default CopyButton;
