import { useEffect } from "react";

/**
 * Hook to inject Schema.org JSON-LD structured data into the page
 * @param schema - The Schema.org JSON-LD object
 * @param id - Optional unique ID for the script tag (useful for updates)
 */
export const useSchemaOrg = (
  schema: object | null,
  id: string = "schema-org",
) => {
  useEffect(() => {
    if (!schema) {
      const existingScript = document.getElementById(id);
      if (existingScript) {
        existingScript.remove();
      }
      return;
    }

    const existingScript = document.getElementById(id);
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById(id);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [schema, id]);
};
