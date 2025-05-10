import React, { useState, useEffect } from "react";

interface CopyButtonProps {
  text: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ text }) => {
  const [copied, setCopied] = useState<null | "success" | "error">(null);

  const handleCopy = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        setCopied("success");
      } else {
        console.warn("Clipboard API not available.");
        setCopied("error");
      }
    } catch (err) {
      console.error("Copy failed", err);
      setCopied("error");
    }
  };

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const isClipboardSupported =
    typeof navigator !== "undefined" && !!navigator.clipboard?.writeText;

  return (
    <>
      <button
        onClick={handleCopy}
        className={`hover:underline z-10 relative ${
          !isClipboardSupported ? "text-gray-400 cursor-not-allowed" : ""
        }`}
        disabled={!isClipboardSupported}
        title={
          isClipboardSupported ? "Copy to clipboard" : "Clipboard not supported"
        }
      >
        Copy
      </button>

      {/* Floating Feedback Bubble */}
      {copied && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-sm px-4 py-2 rounded shadow-lg z-50 transition-opacity duration-300">
          {copied === "success" ? "Copied to clipboard!" : "Copy failed."}
        </div>
      )}
    </>
  );
};

export default CopyButton;
