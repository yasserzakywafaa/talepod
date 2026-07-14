// FAQPage JSON-LD builder from @yasserzakywafaa/client-core/web, wrapped to keep
// TalePod's (faqs, url) signature by injecting the local getAbsoluteUrl helper.
import {
  createFAQPageSchema as createFAQPageSchemaCore,
  type FAQItem,
} from "@yasserzakywafaa/client-core/web";
import { getAbsoluteUrl } from "./schemaGenerators";

export type { FAQItem } from "@yasserzakywafaa/client-core/web";

export const createFAQPageSchema = (faqs: FAQItem[], url?: string): object =>
  createFAQPageSchemaCore({ getAbsoluteUrl }, faqs, url);
