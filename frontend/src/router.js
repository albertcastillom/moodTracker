export function createRouter({ routes, outlet }) {
  function pathOnly(url) {
    try {
      return new URL(url, window.location.origin).pathname;
    } catch {
      return "/";
    }
  }

  async function render(pathname) {
    const view = routes[pathname] || routes["/404"];
    outlet.innerHTML = ""; // clear old view
    await view(outlet);
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
