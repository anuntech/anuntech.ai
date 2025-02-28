import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ClipboardCopyIcon, CheckIcon } from "lucide-react";

export function CodeBlock({ code, language }) {
  const codeRef = useRef(null);
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    if (window.hljs && codeRef.current) {
      window.hljs.highlightElement(codeRef.current);
    }
  }, [code]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block-container relative my-4 rounded-md bg-[#f5f2f0] p-0">
      <div className="flex items-center justify-between bg-muted px-4 py-2">
        <span className="text-xs font-medium text-muted-foreground">
          {language || "código"}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-8 gap-1 text-xs"
        >
          {copied ? (
            <>
              <CheckIcon className="h-3 w-3" />
              Copiado
            </>
          ) : (
            <>
              <ClipboardCopyIcon className="h-3 w-3" />
              Copiar
            </>
          )}
        </Button>
      </div>
      <pre className="m-0 overflow-x-auto p-4">
        <code ref={codeRef} className={language ? `language-${language}` : ""}>
          {code}
        </code>
      </pre>
    </div>
  );
} 