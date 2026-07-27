// Shared logic lives in @yasserzakywafaa/client-core. This thin re-export keeps
// existing `src/shared/utils/url` import sites working while sourcing the impl from core.
export { parseQueryString, createQueryString } from "@yasserzakywafaa/client-core";
export { replaceUrl } from "@yasserzakywafaa/client-core/web";
