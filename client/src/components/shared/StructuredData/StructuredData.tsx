import { useEffect, useMemo } from "react";

interface StructuredDataProps {
  data: Record<string, unknown> | Record<string, unknown>[];
  id?: string;
}

export default function StructuredData({ data, id }: StructuredDataProps) {
  const serialized = useMemo(() => JSON.stringify(data), [data]);

  useEffect(() => {
    const scriptId = id ?? "structured-data";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }

    script.textContent = serialized;

    return () => {
      if (id) {
        document.getElementById(scriptId)?.remove();
      }
    };
  }, [serialized, id]);

  return null;
}
