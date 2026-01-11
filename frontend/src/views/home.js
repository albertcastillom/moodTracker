import { wireClock } from "../ui/clock.js";
import { wireLocation } from "../ui/location.js";
import { loadAverage, wireMoodUI } from "../ui/mood.js";

export async function homeView(outlet) {
  outlet.innerHTML = `
    <div>
      <h1>Mood Tracker</h1>
      <h2>The current mood on</h2>
      <p id="datetime"></p>

      <h2>In</h2>
      <p id="location">--</p>

      <button id="goSlidesBtn" class="slides-btn">How are you feeling today?</button>

      <h2 id="averageDisplay">Average Rating: --</h2>

      <div style="margin-top: 16px;">
        <label for="rangeRating">Mood rating</label>
        <input id="rangeRating" type="range" min="1" max="10" value="5" />
        <span id="ratingValue">5</span>
        <button id="rating-submit-btn">Save mood</button>
      </div>
    </div>
  `;

  // wire behaviors after HTML is in the DOM
  wireClock();
  wireLocation();
  wireMoodUI();
  loadAverage();

  // navigation handled by router, but we can programmatically go:
  document.getElementById("goSlidesBtn")?.addEventListener("click", () => {
    // use regular navigation so router catches it:
    window.history.pushState({}, "", "/slides");
    window.dispatchEvent(new PopStateEvent("popstate"));
  });
}
