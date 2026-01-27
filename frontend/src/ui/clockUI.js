export function wireClock() {
  const el = document.getElementById("datetime");
  if (!el) return;

  const tick = () => {
    const now = new Date();
    el.textContent = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
  };

  tick();
  setInterval(tick, 1000);
}
