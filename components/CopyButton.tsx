"use client"

import { Copy, Check } from "lucide-react";
import { useState } from "react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <button
      onClick={handleCopy}
      title={copied ? "Copied!" : "Copy prompt"}
      className={`shrink-0 p-1.5 rounded-lg transition-colors ${
        copied
          ? "text-green-600 bg-green-50"
          : "text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50"
      }`}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}
