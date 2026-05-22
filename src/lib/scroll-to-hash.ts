/** Scroll to an in-page anchor. Next.js Link often skips scroll on same-route hash clicks. */
export function scrollToHash(
  hash: string,
  options?: { behavior?: ScrollBehavior },
): boolean {
  const id = hash.replace(/^#/, "");
  if (!id) return false;

  const el = document.getElementById(id);
  if (!el) return false;

  el.scrollIntoView({
    behavior: options?.behavior ?? "smooth",
    block: "start",
  });
  window.history.pushState(null, "", `#${id}`);
  return true;
}
