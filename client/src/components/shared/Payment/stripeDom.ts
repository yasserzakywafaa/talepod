/** Stripe.js sometimes leaves iframe markup as plain text nodes in document.body. */
export const cleanupOrphanedStripeDom = (): void => {
  if (typeof document === "undefined") return;

  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
  );

  const nodesToRemove: Text[] = [];
  let node = walker.nextNode();

  while (node) {
    const text = node.textContent ?? "";
    if (
      text.includes("js.stripe.com/v3/m-outer") ||
      (text.includes("js.stripe.com") && text.includes('aria-hidden="true"'))
    ) {
      nodesToRemove.push(node as Text);
    }
    node = walker.nextNode();
  }

  nodesToRemove.forEach((textNode) => textNode.remove());
};

export const isHeadlessPrerender = (): boolean =>
  typeof navigator !== "undefined" &&
  /HeadlessChrome|puppeteer/i.test(navigator.userAgent);
