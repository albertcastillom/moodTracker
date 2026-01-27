export function createRouter({ routes, outlet }) {
  function pathOnly(url) {
    try {
      return new URL(url, window.location.origin).pathname;
    } catch {
      return "/";
    }
  }

  // tiny helper: wait for a CSS transition to finish
  function waitTransition(el) {
    return new Promise((resolve) => {
      const reduceMotion = window.matchMedia?.(
        "(prefers-reduced-motion: reduce)",
      )?.matches;
      if (reduceMotion) return resolve();

      const onEnd = (e) => {
        if (e.target !== el) return;
        el.removeEventListener("transitionend", onEnd);
        resolve();
      };

      el.addEventListener("transitionend", onEnd);

      // safety timeout in case transitionend doesn't fire
      setTimeout(() => {
        el.removeEventListener("transitionend", onEnd);
        resolve();
      }, 300);
    });
  }

  async function render(pathname) {
    const view = routes[pathname] || routes["/"] || routes["/404"];
    if (!view) throw new Error(`No view for route: ${pathname}`);

    const reduceMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    )?.matches;

    // Phase 1: fade out old content (if any)
    if (!reduceMotion) {
      outlet.classList.add("page-transition");
      outlet.classList.remove("page-transition--in");

      // Force style flush so transition actually triggers
      // eslint-disable-next-line no-unused-expressions
      outlet.offsetHeight;

      // Wait a tick (or you can wait transitionend)
      await new Promise((r) => setTimeout(r, 120));
    }

    // Swap content
    outlet.innerHTML = "";
    await view(outlet);

    // Phase 2: fade in new content
    if (!reduceMotion) {
      outlet.classList.add("page-transition");
      outlet.classList.remove("page-transition--in");
      requestAnimationFrame(() => {
        outlet.classList.add("page-transition--in");
      });

      // Cleanup after the transition ends
      setTimeout(() => {
        outlet.classList.remove("page-transition", "page-transition--in");
      }, 260);
    }
  }

  function navigate(to) {
    history.pushState({}, "", to);
    render(to);
  }

  function onLinkClick(e) {
    const a = e.target.closest("a[data-link]");
    if (!a) return;

    // allow cmd/ctrl-click, new tab, etc.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();

    const to = pathOnly(a.href);
    navigate(to);
  }

  function start() {
    document.addEventListener("click", onLinkClick);
    window.addEventListener("popstate", () => render(window.location.pathname));
    render(window.location.pathname);
  }

  return { start, navigate };
}
