import React, { useState, useEffect } from "react";

interface CopyButtonProps {
  text: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ text }) => {
  const [copied, setCopied] = useState<null | "success" | "error">(null);

  const isClipboardSupported =
    typeof navigator !== "undefined" && !!navigator.clipboard?.writeText;

  const handleCopy = async () => {
    try {
      if (isClipboardSupported) {
        await navigator.clipboard.writeText(text);
        setCopied("success");
      } else {
        console.warn("Clipboard API not supported.");
        setCopied("error");
      }
    } catch (err) {
      console.error("Copy failed", err);
      setCopied("error");
    }
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  return (
    <>
      <button
        onClick={handleCopy}
        disabled={!isClipboardSupported}
        title={
          isClipboardSupported ? "Copy to clipboard" : "Clipboard not supported"
        }
        className={`hover:underline z-10 relative ${
          !isClipboardSupported ? "text-gray-400 cursor-not-allowed" : ""
        }`}
      >
        Copy
      </button>

      {/* Top-center floating feedback message */}
      {copied && (
        <div
          className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-md text-sm text-white z-[9999] shadow-lg transition-opacity duration-300 ${
            copied === "success" ? "bg-green-700" : "bg-red-700"
          }`}
          role="status"
          aria-live="polite"
        >
          {copied === "success" ? "Copied to clipboard!" : "Failed to copy."}
        </div>
      )}
    </>
  );
};

export default CopyButton;
