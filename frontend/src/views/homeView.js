import { wireClock } from "../ui/clockUI.js";
import { wireLocation } from "../ui/locationUI.js";
import { loadAverage, wireMoodUI } from "../ui/moodUI.js";

export async function homeView(outlet) {
  outlet.innerHTML = `
     <section class="page page--mood">
      <header class="page__header">
        <h1>Mood Tracker</h1>
        <p class="page__meta">
          <span id="datetime"></span>
          <span class="dot">•</span>
          <span id="location">--</span>
        </p>
      </header>

      <div class="card">
        <h2 id="averageDisplay">Average Rating: --</h2>

        <div class="mood-input">
          <label for="rangeRating">Mood rating</label>
          <div class="mood-input__row">
            <input id="rangeRating" type="range" min="1" max="10" value="5" />
            <span id="ratingValue" class="pill">5</span>
            <button id="rating-submit-btn" class="btn">Save mood</button>
          </div>
        </div>
      </div>
    </section>
  `;

  // wire behaviors after HTML is in the DOM
  wireClock();
  wireLocation();
  wireMoodUI();
  loadAverage();

  // navigation handled by router, but we can programmatically go:
  document.getElementById("goHabitsBtn")?.addEventListener("click", () => {
    // use regular navigation so router catches it:
    window.history.pushState({}, "", "/habits");
    window.dispatchEvent(new PopStateEvent("popstate"));
  });
}
